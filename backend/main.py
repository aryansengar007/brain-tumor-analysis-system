from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import socket
import traceback
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import base64
import io
from PIL import Image
import os
from report_generator import generate_pdf_report


# Custom loss functions for segmentation model
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


# Register custom objects
tf.keras.utils.get_custom_objects()["bce_dice_loss"] = bce_dice_loss
tf.keras.utils.get_custom_objects()["dice_coef"] = dice_coef

app = FastAPI(title="Brain Tumor Analysis API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
BINARY_MODEL = None
TYPE_MODEL = None
SEGMENTATION_MODEL = None

# Constants
IMG_SIZE_BINARY = 128
IMG_SIZE_TYPE = 224
IMG_SIZE_SEG = 128
BINARY_CATEGORIES = ["Healthy", "Tumor"]
TYPE_CATEGORIES = ["glioma", "meningioma", "pituitary", "notumor"]


def load_models():
    global BINARY_MODEL, TYPE_MODEL, SEGMENTATION_MODEL
    try:
        BINARY_MODEL = tf.keras.models.load_model("../models/brain_tumor_model.h5")
        TYPE_MODEL = tf.keras.models.load_model("../models/tumor_type_model.keras")
        SEGMENTATION_MODEL = tf.keras.models.load_model(
            "../models/segmentation_model.keras"
        )
        print("Models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {e}")
        raise


# Load models on startup
load_models()


def preprocess_image_binary(image_bytes):
    """Preprocess image for binary classification"""
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Invalid image")

    # Resize
    img = cv2.resize(img, (IMG_SIZE_BINARY, IMG_SIZE_BINARY))
    # Normalize
    img = img / 255.0
    # Reshape for model
    img = img.reshape(1, IMG_SIZE_BINARY, IMG_SIZE_BINARY, 1)
    return img


def preprocess_image_type(image_bytes):
    """Preprocess image for tumor type classification"""
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes))
    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")
    # Resize
    image = image.resize((IMG_SIZE_TYPE, IMG_SIZE_TYPE))
    # Convert to numpy array
    img_array = np.array(image)
    # Preprocess for MobileNetV2
    img_array = preprocess_input(img_array)
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def preprocess_image_segmentation(image_bytes):
    """Preprocess image for segmentation"""
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image")

    # Resize
    img = cv2.resize(img, (IMG_SIZE_SEG, IMG_SIZE_SEG))
    # Normalize
    img = img / 255.0
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    return img


def predict_binary(image_bytes):
    """Predict binary classification"""
    img = preprocess_image_binary(image_bytes)
    prediction = BINARY_MODEL.predict(img)
    class_idx = np.argmax(prediction[0])
    confidence = float(prediction[0][class_idx])
    result = BINARY_CATEGORIES[class_idx]
    return {"result": result, "confidence": confidence}


def predict_type(image_bytes):
    """Predict tumor type"""
    img = preprocess_image_type(image_bytes)
    prediction = TYPE_MODEL.predict(img)
    class_idx = np.argmax(prediction[0])
    result = TYPE_CATEGORIES[class_idx]
    probabilities = {
        cat: float(pred) for cat, pred in zip(TYPE_CATEGORIES, prediction[0])
    }
    return {"result": result, "probabilities": probabilities}


def predict_segmentation(image_bytes):
    """Predict segmentation mask"""
    img = preprocess_image_segmentation(image_bytes)
    prediction = SEGMENTATION_MODEL.predict(img)
    # Assuming output is (1, 128, 128, 1)
    mask = prediction[0, :, :, 0]
    # Threshold to binary mask
    mask = (mask > 0.5).astype(np.uint8) * 255

    # Calculate tumor area percentage
    total_pixels = mask.size
    tumor_pixels = np.sum(mask > 0)
    tumor_area_percent = (tumor_pixels / total_pixels) * 100

    # Encode mask to base64
    _, buffer = cv2.imencode(".png", mask)
    mask_base64 = base64.b64encode(buffer).decode("utf-8")

    return {"mask": mask_base64, "tumor_area_percent": tumor_area_percent}


def get_size_category(area_percent):
    """Categorize tumor size"""
    if area_percent < 10:
        return "Small"
    elif area_percent < 30:
        return "Medium"
    else:
        return "Large"


class PredictionResponse(BaseModel):
    binary: dict
    type_result: dict
    segmentation: dict
    size_category: str


class ReportRequest(BaseModel):
    patient_name: str
    age: int
    gender: str
    scan_type: str = "MRI"
    image_filename: str
    original_image: str  # base64
    result: str
    confidence: float
    tumor_type: str = None
    probabilities: dict = None
    tumor_area: float = None
    size_category: str = None
    segmentation_mask: str = None  # base64


@app.post("/predict/binary")
async def predict_binary_endpoint(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = predict_binary(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/predict/type")
async def predict_type_endpoint(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = predict_type(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/predict/segmentation")
async def predict_segmentation_endpoint(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = predict_segmentation(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "localhost"
    finally:
        s.close()
    return ip


@app.get("/get-local-ip")
async def get_local_ip_endpoint():
    local_ip = get_local_ip()
    return {"ip": local_ip, "port": 5173}


@app.post("/predict/full")
async def predict_full_endpoint(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        binary_result = predict_binary(image_bytes)

        # Only run segmentation and type classification if tumor is detected
        if binary_result["result"] == "Tumor":
            type_result = predict_type(image_bytes)
            segmentation_result = predict_segmentation(image_bytes)

            # Smart filter: if tumor area is very small (<1%), treat as no tumor
            tumor_area_percent = segmentation_result["tumor_area_percent"]
            if tumor_area_percent < 1.0:
                # Treat as healthy (noise filtering)
                return {
                    "binary": binary_result,
                    "type": None,
                    "segmentation": None,
                    "size_category": None,
                    "message": "Noise detected - tumor area too small to be significant",
                }

            size_category = get_size_category(tumor_area_percent)

            return {
                "binary": binary_result,
                "type": type_result,
                "segmentation": segmentation_result,
                "size_category": size_category,
            }
        else:
            # Healthy case - skip segmentation and type classification
            return {
                "binary": binary_result,
                "type": None,
                "segmentation": None,
                "size_category": None,
                "message": "No tumor detected - segmentation not required",
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/generate-report")
async def generate_report_endpoint(request: ReportRequest):
    payload = request.dict()
    try:
        print("Report request received at /generate-report")
        print("Payload keys:", list(payload.keys()))
        if payload.get("original_image"):
            print("Original image length:", len(payload.get("original_image")))
        if payload.get("segmentation_mask"):
            print("Segmentation mask length:", len(payload.get("segmentation_mask")))

        print("Generating report...")
        pdf_bytes = generate_pdf_report(payload)
        print("PDF generated successfully. Size:", len(pdf_bytes), "bytes")

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=brain_tumor_report.pdf"
            },
        )
    except Exception as e:
        print("REPORT ERROR:", str(e))
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)},
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
