import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

# -----------------------------
# CONFIG
# -----------------------------
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15

TRAIN_PATH = "datasets/tumor_type_dataset/train"
TEST_PATH = "datasets/tumor_type_dataset/test"

CATEGORIES = ["glioma", "meningioma", "pituitary", "notumor"]

# -----------------------------
# DATA GENERATOR
# -----------------------------
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=15,
    zoom_range=0.15,
    horizontal_flip=True,
)

test_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

train_data = train_datagen.flow_from_directory(
    TRAIN_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True,
)

test_data = test_datagen.flow_from_directory(
    TEST_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False,
)

# -----------------------------
# MODEL
# -----------------------------
base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights="imagenet"
)

# Freeze most layers
for layer in base_model.layers[:-30]:
    layer.trainable = False

for layer in base_model.layers[-30:]:
    layer.trainable = True

# Custom head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.5)(x)
output = Dense(4, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# -----------------------------
# CALLBACK
# -----------------------------
early_stop = EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)

# -----------------------------
# TRAINING
# -----------------------------
history = model.fit(
    train_data,
    steps_per_epoch=train_data.samples // BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=test_data,
    validation_steps=test_data.samples // BATCH_SIZE,
    callbacks=[early_stop],
)

# -----------------------------
# EVALUATION
# -----------------------------
loss, acc = model.evaluate(test_data)
print(f"\nFinal Test Accuracy: {acc:.4f}")

# -----------------------------
# PREDICTIONS
# -----------------------------
y_pred = model.predict(test_data)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true = test_data.classes

print("\nClassification Report:\n")
print(classification_report(y_true, y_pred_classes, target_names=CATEGORIES))

# -----------------------------
# CONFUSION MATRIX
# -----------------------------
cm = confusion_matrix(y_true, y_pred_classes)

plt.figure(figsize=(6, 5))
plt.imshow(cm, cmap="Blues")
plt.title("Confusion Matrix")
plt.colorbar()
plt.xlabel("Predicted")
plt.ylabel("True")
plt.show()

# -----------------------------
# ACCURACY GRAPH
# -----------------------------
plt.figure(figsize=(8, 5))
plt.plot(history.history["accuracy"], label="Train Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
plt.title("Model Accuracy")
plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend()
plt.grid()
plt.show()

# -----------------------------
# SAVE MODEL
# -----------------------------
os.makedirs("models", exist_ok=True)
model.save("models/tumor_type_model.keras")
