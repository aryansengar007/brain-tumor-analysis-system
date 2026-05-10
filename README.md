<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D2137,100:00B4CC&height=200&section=header&text=Brain%20Tumor%20Analysis%20System&fontSize=36&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Detection%20%C2%B7%20Classification%20%C2%B7%20Segmentation&descAlignY=58&descSize=16&descColor=A8D8E8" width="100%"/>

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)

<br/>

> **A full-stack AI medical imaging platform** that automates brain tumor detection, classification, and pixel-level segmentation from MRI scans — with automated clinical PDF reports, QR code sharing, and batch processing, all running from a modern React + FastAPI web application.

<br/>

[![Detection](https://img.shields.io/badge/Detection%20Accuracy-97.3%25-00B4CC?style=flat-square)](.)
[![Classification](https://img.shields.io/badge/Classification%20Accuracy-90.0%25-00B4CC?style=flat-square)](.)
[![Dice Score](https://img.shields.io/badge/Segmentation%20Dice-0.80%2B-00B4CC?style=flat-square)](.)
[![Dataset](https://img.shields.io/badge/Training%20Images-~23K-00B4CC?style=flat-square)](.)

</div>

<br/>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🧠 AI Detection Pipeline**
- Binary tumor detection — Healthy vs Tumor
- Four-class type classification — Glioma, Meningioma, Pituitary, No Tumor
- U-Net pixel-level segmentation with area estimation
- Confidence scores and probability visualisation

</td>
<td width="50%">

**🖥️ Web Application**
- Drag-and-drop single image & batch analysis
- Automated PDF clinical report generation
- QR code report sharing for mobile access
- Analysis history tracking and dashboard analytics

</td>
</tr>
</table>

---

## 📸 Screenshots

### 🔐 Login Page
| | |
|---|---|
| ![Login 1](assets/page_1.png) | ![Login 2](assets/page_2.png) |

### 📊 Dashboard
| | | |
|---|---|---|
| ![Dashboard 1](assets/dashboard_1.png) | ![Dashboard 2](assets/dashboard_2.png) | ![Dashboard 3](assets/dashboard_3.png) |
| ![Dashboard 4](assets/dashboard_4.png) | ![Dashboard 5](assets/dashboard_5.png) | |

### 🔬 Scan Results
| | | |
|---|---|---|
| ![Result 1](assets/result_1.png) | ![Result 2](assets/result_2.png) | ![Result 3](assets/result_3.png) |
| ![Result 4](assets/result_4.png) | ![Result 5](assets/result_5.png) | |

### 📄 Generated Reports
| | | |
|---|---|---|
| ![File 1](assets/file_1.png) | ![File 2](assets/file_2.png) | ![File 3](assets/file_3.png) |
| ![File 4](assets/file_4.png) | ![File 5](assets/file_5.png) | ![File 6](assets/file_6.png) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│             React.js Frontend                   │
│   (Vite · Tailwind CSS · Framer Motion)         │
└────────────────────┬────────────────────────────┘
                     │  HTTP / JSON
                     ▼
┌─────────────────────────────────────────────────┐
│              FastAPI Backend                    │
│   (Uvicorn · Image Preprocessing · ReportLab)  │
└────────────────────┬────────────────────────────┘
                     │  Model Inference
                     ▼
┌─────────────────────────────────────────────────┐
│           TensorFlow Model Layer                │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐ │
│  │  CNN Binary  │  │ MobileNetV2  │  │ U-Net │ │
│  │  Classifier  │→ │  Classifier  │→ │ Seg.  │ │
│  └──────────────┘  └──────────────┘  └───────┘ │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
         Prediction + PDF Report + QR Code
```

---

## 🧠 Machine Learning Models

| Model | Task | Architecture | Result |
|-------|------|-------------|--------|
| **Binary Classifier** | Healthy vs Tumor | Custom CNN (128×128 grayscale) | **97.3% Accuracy** |
| **Type Classifier** | Glioma · Meningioma · Pituitary · No Tumor | MobileNetV2 Transfer Learning (224×224 RGB) | **90.0% Accuracy** |
| **Segmentation** | Pixel-level tumor mask | U-Net Encoder-Decoder (128×128) | **Dice Score 0.80+** |

<details>
<summary><b>📐 Model Details</b></summary>

<br/>

**CNN Binary Classifier**
- Optimizer: Adam · Loss: Binary Cross-Entropy
- Epochs: 10 · Batch Size: 433 · Dropout: 0.5
- Callbacks: EarlyStopping + ReduceLROnPlateau

**MobileNetV2 Classifier**
- Pretrained on ImageNet (frozen base) · Fine-tuned classifier head
- Optimizer: Adam · Loss: Categorical Cross-Entropy
- Epochs: 15 · Batch Size: 175 · Dropout: 0.3
- Augmentation: Rotation, Zoom, Flip, Shear

**U-Net Segmentation**
- Encoder-Decoder with skip connections
- Loss: Dice + Binary Cross-Entropy (combined)
- Epochs: 30 · Batch Size: 307
- Regularisation: Batch Normalisation + Dropout

</details>

---

## ⚡ Tech Stack

<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>AI / ML</th>
</tr>
<tr>
<td>

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)<br/>
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)<br/>
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)<br/>
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)<br/>
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square)<br/>
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

</td>
<td>

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)<br/>
![Uvicorn](https://img.shields.io/badge/Uvicorn-4B32C3?style=flat-square)<br/>
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white)<br/>
![Pillow](https://img.shields.io/badge/Pillow-3776AB?style=flat-square&logo=python&logoColor=white)<br/>
![ReportLab](https://img.shields.io/badge/ReportLab-CC0000?style=flat-square)<br/>
![nibabel](https://img.shields.io/badge/nibabel-4A4A4A?style=flat-square)

</td>
<td>

![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)<br/>
![Keras](https://img.shields.io/badge/Keras-D00000?style=flat-square&logo=keras&logoColor=white)<br/>
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)<br/>
![pandas](https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white)<br/>
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)

</td>
</tr>
</table>

---

## 📂 Project Structure

```
brain-tumor-analysis-system/
│
├── backend/
│   ├── main.py                  # FastAPI application entry point
│   ├── requirements.txt
│   ├── models/
│   │   ├── binary_model.h5      # CNN binary classifier
│   │   ├── type_model.h5        # MobileNetV2 classifier
│   │   └── segmentation_model.h5# U-Net segmentation model
│   └── utils/
│       ├── preprocess.py        # Image preprocessing pipeline
│       └── report.py            # PDF report generation
│
├── frontend/
│   ├── src/
│   │   ├── components/          # DropZone, ResultPanel, Sidebar
│   │   ├── pages/               # Dashboard, History, Batch, Login
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── datasets/
│   ├── binary_dataset/
│   ├── tumor_type_dataset/
│   └── segmentation_dataset/
│
└── assets/                      # README screenshots
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

### 1 · Clone the Repository

```bash
git clone https://github.com/aryansengar007/brain-tumor-analysis-system.git
cd brain-tumor-analysis-system
```

### 2 · Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

> Backend runs at **`http://localhost:8000`**

### 3 · Start the Frontend

Open a new terminal (`Ctrl + Shift + `` ` `` ` in VS Code), then:

```bash
cd frontend
npm install
npm run dev
```

> Open the localhost link shown in the terminal (typically **`http://localhost:5173`**)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict/binary` | Tumor vs Healthy detection |
| `POST` | `/predict/type` | Four-class tumor classification |
| `POST` | `/predict/segmentation` | U-Net mask + area estimation |
| `POST` | `/predict/full` | Complete 3-stage pipeline |
| `POST` | `/generate-report` | PDF report generation |
| `GET`  | `/get-local-ip` | Retrieve local server IP for QR linking |

> All endpoints accept `multipart/form-data` image uploads and return structured JSON responses.

---

## 📊 Results & Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| 🎯 Detection Accuracy | **97.3%** (1,924 test samples) |
| 📊 Classification Accuracy | **90.0%** (macro F1 = 0.90) |
| 🔲 Segmentation Dice Score | **0.80+** (Val Dice = 0.8041) |
| 📁 Training Dataset | **~22,946** images across 3 datasets |
| ⚙️ Training Environment | CPU-only (no GPU required) |

</div>

<details>
<summary><b>📈 Per-Class Classification Performance</b></summary>

<br/>

| Class | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| Glioma | 0.94 | 0.76 | 0.84 |
| Meningioma | 0.85 | 0.86 | 0.86 |
| Pituitary | 0.88 | **1.00** | 0.94 |
| No Tumor | 0.94 | 0.98 | **0.96** |
| **Macro Avg** | **0.90** | **0.90** | **0.90** |

</details>

---

## 🔮 Future Improvements

- [ ] **Grad-CAM** — Visual saliency maps for explainable AI decisions
- [ ] **DICOM Support** — Native `.dcm` file input for hospital PACS integration
- [ ] **Cloud Deployment** — AWS / GCP with auto-scaling and HTTPS
- [ ] **Mobile App** — Android / iOS for on-the-go MRI analysis
- [ ] **Vision Transformers** — Swin Transformer / ViT model upgrades
- [ ] **Real-Time Inference** — GPU-accelerated sub-second predictions
- [ ] **Multi-User Auth** — Role-based access control for clinical teams
- [ ] **Database Integration** — PostgreSQL for persistent multi-session history

---

## 👨‍💻 Author

<div align="center">

**Aryan Sengar**
B.Tech Computer Science & Engineering

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aryansengar007)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/aryan-sengar-786b96290)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00B4CC,100:0D2137&height=100&section=footer" width="100%"/>

*If you find this project useful, consider dropping a ⭐ — it helps a lot!*

© 2025 Aryan Sengar · All Rights Reserved

</div>
