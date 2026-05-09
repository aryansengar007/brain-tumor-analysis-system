import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# -----------------------------
# CONFIG
# -----------------------------
IMG_SIZE = 128

IMAGE_DIR = r"D:\My Projects\Brain Tumor Analysis System\datasets\tumor_segmentation_dataset\images"
MASK_DIR = r"D:\My Projects\Brain Tumor Analysis System\datasets\tumor_segmentation_dataset\masks"


# -----------------------------
# SORT FILES NUMERICALLY
# -----------------------------
def sort_numerically(files):
    return sorted(files, key=lambda x: int(os.path.splitext(x)[0]))


image_files = sort_numerically(os.listdir(IMAGE_DIR))
mask_files = sort_numerically(os.listdir(MASK_DIR))

# -----------------------------
# LOAD DATA
# -----------------------------
images = []
masks = []

for img_file, mask_file in zip(image_files, mask_files):
    img_path = os.path.join(IMAGE_DIR, img_file)
    mask_path = os.path.join(MASK_DIR, mask_file)

    # IMAGE
    img = cv2.imread(img_path)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0

    # MASK (IMPORTANT FIX 🔥)
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    mask = cv2.resize(mask, (IMG_SIZE, IMG_SIZE))

    # convert to binary (CRITICAL)
    mask = (mask > 127).astype(np.float32)
    mask = np.expand_dims(mask, axis=-1)

    images.append(img)
    masks.append(mask)

images = np.array(images)
masks = np.array(masks)

print("Data loaded:", images.shape, masks.shape)

# -----------------------------
# SPLIT DATA
# -----------------------------
X_train, X_val, y_train, y_val = train_test_split(
    images, masks, test_size=0.2, random_state=42
)


# -----------------------------
# DICE METRIC + LOSS
# -----------------------------
def dice_coef(y_true, y_pred):
    smooth = 1e-6
    y_true_f = tf.reshape(y_true, [-1])
    y_pred_f = tf.reshape(y_pred, [-1])
    intersection = tf.reduce_sum(y_true_f * y_pred_f)
    return (2.0 * intersection + smooth) / (
        tf.reduce_sum(y_true_f) + tf.reduce_sum(y_pred_f) + smooth
    )


def dice_loss(y_true, y_pred):
    return 1 - dice_coef(y_true, y_pred)


def bce_dice_loss(y_true, y_pred):
    bce = tf.keras.losses.BinaryCrossentropy()(y_true, y_pred)
    return bce + dice_loss(y_true, y_pred)


# -----------------------------
# IMPROVED U-NET
# -----------------------------
def conv_block(x, filters):
    x = layers.Conv2D(filters, 3, padding="same")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation("relu")(x)

    x = layers.Conv2D(filters, 3, padding="same")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation("relu")(x)

    return x


def build_unet(input_shape=(128, 128, 3)):
    inputs = layers.Input(input_shape)

    # Encoder
    c1 = conv_block(inputs, 32)
    p1 = layers.MaxPooling2D()(c1)

    c2 = conv_block(p1, 64)
    p2 = layers.MaxPooling2D()(c2)

    c3 = conv_block(p2, 128)
    p3 = layers.MaxPooling2D()(c3)

    # Bottleneck
    c4 = conv_block(p3, 256)
    c4 = layers.Dropout(0.3)(c4)

    # Decoder
    u5 = layers.UpSampling2D()(c4)
    u5 = layers.concatenate([u5, c3])
    c5 = conv_block(u5, 128)

    u6 = layers.UpSampling2D()(c5)
    u6 = layers.concatenate([u6, c2])
    c6 = conv_block(u6, 64)

    u7 = layers.UpSampling2D()(c6)
    u7 = layers.concatenate([u7, c1])
    c7 = conv_block(u7, 32)

    outputs = layers.Conv2D(1, 1, activation="sigmoid")(c7)

    return models.Model(inputs, outputs)


model = build_unet()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss=bce_dice_loss,
    metrics=[dice_coef],
)

model.summary()

# -----------------------------
# CALLBACKS (VERY IMPORTANT)
# -----------------------------
callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.3, patience=3, min_lr=1e-6),
]

# -----------------------------
# TRAIN
# -----------------------------
history = model.fit(
    X_train,
    y_train,
    validation_data=(X_val, y_val),
    epochs=30,
    batch_size=8,
    callbacks=callbacks,
)


# -----------------------------
# VISUALIZATION
# -----------------------------
def show_prediction(index):
    pred = model.predict(np.expand_dims(X_val[index], axis=0))[0]

    plt.figure(figsize=(12, 4))

    plt.subplot(1, 4, 1)
    plt.imshow(X_val[index])
    plt.title("Image")

    plt.subplot(1, 4, 2)
    plt.imshow(y_val[index].squeeze(), cmap="gray")
    plt.title("Mask")

    plt.subplot(1, 4, 3)
    plt.imshow(pred.squeeze(), cmap="gray")
    plt.title("Prediction")

    plt.subplot(1, 4, 4)
    plt.imshow(X_val[index])
    plt.imshow(pred.squeeze(), cmap="jet", alpha=0.5)
    plt.title("Overlay")

    plt.show()


show_prediction(5)

# -----------------------------
# SAVE
# -----------------------------
model.save("models/segmentation_model.keras")
