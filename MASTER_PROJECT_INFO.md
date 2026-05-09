# Brain Tumor Analysis System

## Project Abstract

A hybrid AI-enabled brain tumor analysis platform that combines medical image classification, tumor type prediction, segmentation, and report generation. The system integrates a React-based frontend dashboard with a FastAPI backend and TensorFlow models to offer a clinician-friendly analysis pipeline for MRI/CT brain scans.

## 1. Project Overview

- **Project Title:** Brain Tumor Analysis System
- **Project Type:** AI-powered healthcare application
- **Domain:** Medical imaging, healthcare analytics, deep learning
- **Main Objective:** Automate brain tumor screening using deep learning and provide a usable web-based interface for diagnosis support.
- **Problem Statement:** Manual review of brain scans is time-intensive, inconsistent, and requires specialized radiology expertise. This project addresses the need for faster, reproducible decision support.
- **Proposed Solution:** A full-stack system that uses pretrained TensorFlow models for detection, classification, and segmentation, served through FastAPI and presented with an interactive React dashboard.
- **Real-world Use Case:** Radiology support tool for hospitals, telemedicine screening, pre-diagnostic triaging, and medical report generation for patient consultations.
- **Key Features:**
  - Binary brain tumor detection (healthy vs tumor)
  - Tumor type classification (glioma, meningioma, pituitary, no tumor)
  - Segmentation mask generation with tumor area percentage
  - PDF medical report generation
  - Batch image analysis and download export
  - History tracking in browser storage
  - QR code sharing for mobile access
- **Expected Output:** Classification label, confidence score, tumor type probabilities, segmentation mask, tumor area percentage, size category, and downloadable report.

## 2. Technologies Used

- **Python**
  - Used for backend inference, model training, and Streamlit demo.
  - Benefits: rich ML libraries, rapid prototyping, strong Python ecosystem.
- **JavaScript / React**
  - Used for frontend UI, routing, and client-side logic.
  - Benefits: reactive UI, component reuse, fast development.
- **HTML / CSS / Tailwind CSS**
  - Used for layout, styling, and responsive design.
  - Benefits: efficient styling, consistent dark theme, utility-first classes.
- **Vite**
  - Used as the frontend build and development tool.
  - Benefits: fast hot reload, optimized builds, simple configuration.
- **FastAPI**
  - Used for backend API and model serving.
  - Benefits: async performance, automatic documentation, type-safe endpoints.
- **Uvicorn**
  - ASGI server to run FastAPI.
- **TensorFlow / Keras**
  - Used for model definition, training, evaluation, and inference.
  - Benefits: deep learning workflow, pretrained transfer learning support.
- **OpenCV**
  - Used for image preprocessing, resizing, and mask encoding.
- **Pillow**
  - Used for image conversion and handling.
- **ReportLab**
  - Used to generate professional PDF medical reports.
- **Shooter Utilities:** `pandas`, `numpy`, `scikit-learn`, `matplotlib`, `seaborn` for data handling and evaluation.
- **React Libraries:** `react-router-dom`, `framer-motion`, `axios`, `react-hot-toast`, `recharts`, `react-qr-code`.
- **Streamlit**
  - Provides a demonstration/prototyping web interface for single and batch analysis.

## 3. Libraries & Packages

| Library/Package  | Purpose                            | Used In File(s)                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------------ |
| fastapi          | REST API backend                   | `backend/main.py`                                            |
| uvicorn          | ASGI server                        | `backend/main.py`                                            |
| tensorflow       | Model training and inference       | `backend/main.py`, `src/*.py`                                |
| numpy            | Numerical arrays and preprocessing | various Python files                                         |
| opencv-python    | Image read/resize/mask encoding    | `backend/main.py`, `src/*.py`, `backend/report_generator.py` |
| pillow           | Image conversion                   | `backend/main.py`, `src/streamlit_app.py`                    |
| python-multipart | Multipart file uploads for FastAPI | `backend/requirements.txt`                                   |
| reportlab        | PDF report generation              | `backend/report_generator.py`                                |
| pydantic         | Data validation for API models     | `backend/main.py`                                            |
| pandas           | Data tables and batch export       | `src/streamlit_app.py`                                       |
| matplotlib       | Visualizations and report images   | `src/*.py`, `backend/report_generator.py`                    |
| scikit-learn     | Train/test split and metrics       | `src/Tumor_classifier.py`, `src/tumor_type_classifier.py`    |
| seaborn          | Confusion matrix plotting          | `src/Tumor_classifier.py`, `src/tumor_type_classifier.py`    |
| qrcode           | QR code generation in Streamlit    | `src/streamlit_app.py`                                       |
| streamlit        | Interactive demo UI                | `src/streamlit_app.py`                                       |
| react            | Frontend framework                 | `frontend/src/*.jsx`                                         |
| react-dom        | DOM rendering                      | `frontend/src/main.jsx`                                      |
| framer-motion    | UI animations                      | `frontend/src/*.jsx`                                         |
| react-router-dom | Client routing                     | `frontend/src/App.jsx`                                       |
| axios            | HTTP client                        | `frontend/src/services/api.js`                               |
| react-hot-toast  | Notifications                      | `frontend/src/pages/*.jsx`                                   |
| react-qr-code    | QR code rendering                  | `frontend/src/pages/QRPage.jsx`                              |
| recharts         | Charts and visualization           | `frontend/src/components/ui/ResultPanel.jsx`                 |
| tailwindcss      | Styling framework                  | `tailwind.config.js`, `frontend/src/index.css`               |
| vite             | Build tool                         | `vite.config.js`                                             |
| eslint           | Linting                            | `package.json`                                               |

### Library categories

- ML libraries: TensorFlow, scikit-learn, OpenCV, Pillow
- Visualization libraries: matplotlib, seaborn, recharts
- Backend libraries: FastAPI, Uvicorn, ReportLab, pydantic
- Frontend libraries: React, React Router DOM, Framer Motion, axios, react-hot-toast
- Utility libraries: pandas, numpy, qrcode

## 4. Machine Learning / Deep Learning Details

### Binary Classification Model

- Architecture: custom convolutional neural network (CNN)
- Type: CNN
- Input shape: `128x128x1` grayscale
- Output classes: `Healthy`, `Tumor`
- Activation: ReLU in hidden layers, softmax output
- Loss: categorical crossentropy
- Optimizer: Adam
- Epochs: 10
- Batch size: 16
- Dataset: combined brain MRI and CT scans of healthy and tumor cases
- Preprocessing: grayscale conversion, resize to 128x128, normalization to [0,1]
- Evaluation: train/validation accuracy, confusion matrix

### Tumor Type Classification Model

- Architecture: transfer learning with MobileNetV2
- Type: CNN backbone + fully connected head
- Input shape: `224x224x3` RGB
- Output classes: `glioma`, `meningioma`, `pituitary`, `notumor`
- Activation: ReLU hidden, softmax output
- Loss: categorical crossentropy
- Optimizer: Adam (learning rate 1e-5)
- Epochs: 15
- Batch size: 32
- Dataset: `datasets/tumor_type_dataset` train/test directories
- Preprocessing: MobileNetV2 `preprocess_input`, resizing, augmentation
- Augmentation: rotation range 15, zoom 0.15, horizontal flip
- Evaluation: classification report, confusion matrix, validation curves

### Segmentation Model

- Architecture: U-Net-style encoder-decoder
- Type: semantic segmentation with deep CNN
- Input shape: `128x128x3`
- Output: `128x128x1` binary mask
- Activation: sigmoid output
- Loss: binary crossentropy + dice loss
- Optimizer: Adam (learning rate 1e-4)
- Epochs: 30
- Batch size: 8
- Dataset: `datasets/tumor_segmentation_dataset/images` and `masks`
- Preprocessing: resize to 128x128, normalize image, convert masks to binary threshold
- Evaluation: Dice coefficient metric, overlay visualization

### Why these models were selected

- Stable and efficient CNN design for binary detection
- MobileNetV2 supports transfer learning on limited medical data
- U-Net-style architecture is effective for segmentation masks and medical image localization
- This combination balances accuracy, inference speed, and practical deployment

## 5. Project Architecture

### Working pipeline

1. Upload image via React UI
2. Frontend sends form data to FastAPI
3. Backend performs preprocessing and inference
4. Models return prediction results
5. Frontend displays outputs and enables report download

### Input → Processing → Output flow

- Input: brain scan image file
- Processing:
  - binary detection
  - tumor type classification (if tumor detected)
  - segmentation prediction (if tumor detected)
  - size categorization
- Output: JSON result, image preview, mask visualization, downloadable PDF

### Module-wise explanation

- `frontend/`: single-page application, UI pages, services, components
- `backend/main.py`: API definitions, model loading, image preprocessing
- `backend/report_generator.py`: PDF generation engine
- `src/`: training scripts and Streamlit interface
- `datasets/`: image datasets for training and validation
- `models/`: pre-trained TensorFlow weights and artifacts

### Folder structure explanation

- `frontend/`: React source code and assets
- `backend/`: API and report generation service
- `src/`: ML model training and interactive demo code
- `datasets/`: binary detection, tumor type, and segmentation datasets
- `models/`: saved model files ready for inference
- root files: dependency manager files and config

### Frontend/backend interaction

- Frontend uses `axios` to call backend endpoints
- Backend responds with JSON and binary mask images encoded in Base64
- Frontend stores analysis history locally

### Database interaction

- No server-side database is used
- History is persisted in browser `localStorage`

### API flow

- `/predict/binary`: returns tumor probability
- `/predict/type`: returns tumor type probabilities
- `/predict/segmentation`: returns mask and tumor area
- `/predict/full`: combined inference pipeline
- `/generate-report`: PDF medical report generation
- `/get-local-ip`: local network URL discovery

## 6. File-by-File Analysis

### `README.md`

- Purpose: project overview and setup guide
- Contains: instructions for backend and frontend setup, API endpoint list, structure notes

### `backend/main.py`

- Purpose: primary inference API server
- Main functions: model loading, image preprocessing, prediction endpoints, report endpoint, IP discovery
- Technologies: FastAPI, TensorFlow, OpenCV, PIL, NumPy

### `backend/report_generator.py`

- Purpose: create professional PDF medical reports
- Key functions: `generate_pdf_report`
- Technologies: ReportLab, OpenCV, PIL, NumPy

### `backend/requirements.txt`

- Purpose: backend-specific dependency listing

### `requirements.txt`

- Purpose: global Python dependency list for ML/demo scripts

### `frontend/package.json`

- Purpose: frontend package management and scripts

### `frontend/src/App.jsx`

- Purpose: main React routing and login gating

### `frontend/src/pages/AnalyzePage.jsx`

- Purpose: single image analysis page
- Functionality: upload, analyze, preview, patient details, report generation

### `frontend/src/pages/BatchPage.jsx`

- Purpose: batch image analysis view and CSV export

### `frontend/src/pages/HistoryPage.jsx`

- Purpose: show saved analysis history from `localStorage`

### `frontend/src/pages/DashboardPage.jsx`

- Purpose: analytics dashboard with mock metrics

### `frontend/src/pages/LoginPage.jsx`

- Purpose: simple local login UI

### `frontend/src/pages/QRPage.jsx`

- Purpose: generate and share QR code for mobile access

### `frontend/src/components/ui/DropZone.jsx`

- Purpose: drag-and-drop file upload component

### `frontend/src/components/ui/ResultPanel.jsx`

- Purpose: display prediction results and probability charts

### `frontend/src/components/ui/StatCard.jsx`

- Purpose: reusable dashboard statistic card

### `frontend/src/components/layout/Sidebar.jsx`

- Purpose: application sidebar navigation

### `frontend/src/components/layout/Topbar.jsx`

- Purpose: top bar header

### `frontend/src/services/api.js`

- Purpose: Axios wrapper for backend API calls and history persistence

### `frontend/src/main.jsx`

- Purpose: React app entry point

### `frontend/src/index.css`

- Purpose: Tailwind base styling and custom glass UI theme

### `tailwind.config.js`

- Purpose: Tailwind color palette and content paths

### `vite.config.js`

- Purpose: Vite config for frontend dev server and build

### `frontend/index.html`

- Purpose: root HTML file for React app

### `src/streamlit_app.py`

- Purpose: demo Streamlit interface for analysis and batch operations

### `src/Tumor_classifier.py`

- Purpose: binary brain tumor model training and evaluation

### `src/tumor_type_classifier.py`

- Purpose: tumor type transfer learning training and evaluation

### `src/tumor_segmentation.py`

- Purpose: tumor segmentation model training and mask generation

## 7. Frontend Details

- **Framework:** React
- **UI libraries:** Framer Motion, Recharts, React Hot Toast, React QR Code
- **Styling:** Tailwind CSS, custom glassmorphism styles
- **Routing:** React Router DOM
- **State management:** `useState`, `useEffect`, local component state
- **Responsiveness:** grid layouts and adaptive components for different screen sizes
- **Theme system:** dark UI with primary and secondary accent colors
- **Components:** DropZone, ResultPanel, StatCard, Sidebar, Topbar, pages for Analyze, Batch, History, QR, Dashboard

## 8. Backend Details

- **Server framework:** FastAPI
- **API routes:** `/predict/binary`, `/predict/type`, `/predict/segmentation`, `/predict/full`, `/generate-report`, `/get-local-ip`
- **Authentication:** none in backend; frontend gate only local login
- **Database connectivity:** none
- **Business logic:** model orchestration, noise filtering, PDF report generation, image preprocessing
- **Deployment config:** Uvicorn with CORS enabled for all origins

## 9. Database Details

- No database or external persistence layer exists.
- History is stored client-side using browser `localStorage`.
- No tables, no schema, no server-side queries.

## 10. Dataset Analysis

- **Dataset source:** local repository datasets folder with MRI, CT, and segmentation images
- **Dataset size:** ~22,946 image files across the dataset folders
- **Number of classes:**
  - Binary detection: 2 classes (`Healthy`, `Tumor`)
  - Tumor type: 4 classes (`glioma`, `meningioma`, `pituitary`, `notumor`)
  - Segmentation: binary mask classes
- **Data format:** JPEG and PNG medical scan images, grayscale and RGB, segmentation masks as PNG
- **Data preprocessing:** resizing, normalization, grayscale conversion, MobileNetV2 preprocessing
- **Data augmentation:** rotation, zoom, horizontal flip for tumor-type classification

## 11. Tools & Software Used

- **VS Code:** development environment
- **Node.js / npm:** frontend package management
- **Python:** backend and ML scripting
- **FastAPI:** API development
- **Uvicorn:** running backend server
- **TensorFlow:** deep learning models
- **OpenCV:** image preprocessing
- **ReportLab:** PDF medical report creation
- **React / Vite:** frontend application
- **Tailwind CSS:** frontend styling
- **Streamlit:** interactive demo interface
- **GitHub:** repository management

## 12. Deployment & Execution

### How project runs

- Backend: `uvicorn backend.main:app --reload`
- Frontend: `npm install` then `npm run dev`
- Streamlit demo: `streamlit run src/streamlit_app.py`

### Environment setup

- Python dependencies declared in root `requirements.txt` and `backend/requirements.txt`
- Frontend dependencies declared in `frontend/package.json`

### Hosting platform

- Not configured for cloud deployment in this repository
- Intended for local machine deployment

## 13. Performance & Results

- Project includes model evaluation scripts that produce:
  - test accuracy
  - classification reports
  - confusion matrix visualizations
  - training accuracy plots
- Exact numeric metrics are not fixed in the repository; evaluation is generated during training runs.
- Output quality is likely solid for prototype-level medical inference.

## 14. Challenges Faced

- Handling multiple dataset types and scanner modalities
- No backend data persistence layer
- Local IP detection for mobile QR sharing is environment-dependent
- Missing explicit dependency for `qrcode` package in root requirements
- Manual login gating without secure authentication
- Deployment readiness limited by local-only config

## 15. Future Enhancements

- Add database and secure user authentication
- Deploy the app in Docker and cloud-hosted environments
- Add model explainability such as Grad-CAM
- Support DICOM and volumetric scan formats
- Implement server-side history and patient records
- Add HTTPS, logging, monitoring, and performance optimization
- Introduce model versioning and server-side caching

## Final Summaries

### Final Tech Stack Summary

- React + Vite + Tailwind + FastAPI + TensorFlow + OpenCV + ReportLab
- Modern frontend combined with Python ML-driven backend
- No server database, but local history available in browser storage

### Final Architecture Summary

- Frontend uploads scan images
- Backend serves models through API endpoints
- Combined inference endpoint performs detection, classification, and segmentation
- PDF report generation completes the user workflow
- History and batch processing are handled client-side

### Final Project Abstract

A full-stack prototype for AI-assisted brain tumor analysis, demonstrating how medical imaging can be automated and delivered through a web application with inference, segmentation, and reporting pipelines.

### Final Conclusion

This repository offers a strong final-year project foundation, combining deep learning, medical image processing, and full-stack engineering. It is well-suited for presentation, research documentation, and portfolio demonstration.

# Architecture Explanation

## System Overview

The Brain Tumor Analysis System is a full-stack application that couples a React frontend with a FastAPI backend and TensorFlow machine learning models. The frontend handles user interaction and visualization, while the backend manages model inference, preprocessing, and report generation.

## High-Level Architecture

1. **Frontend UI**
   - Built with React and Tailwind CSS.
   - Provides pages for analysis, batch uploads, history, dashboard, login, and QR sharing.
   - Uses `axios` to call backend endpoints.
   - Stores analysis history in browser `localStorage`.

2. **Backend API**
   - Built with FastAPI and served by Uvicorn.
   - Loads three TensorFlow models on startup.
   - Accepts image uploads and returns predictions as JSON.
   - Generates PDF medical reports using ReportLab.

3. **Machine Learning Models**
   - Binary classification model for tumor detection.
   - Tumor type classification model for tumor subtype prediction.
   - Segmentation model for generating tumor masks.

4. **Data Flow**
   - Upload image from frontend
   - FastAPI receives the file
   - Image preprocessing occurs in backend
   - Models perform inference
   - Backend builds JSON response
   - Frontend displays results and offers report download

## Module Responsibilities

- `frontend/src/*`
  - Components: reusable UI building blocks
  - Pages: user-facing screens and workflows
  - Services: `api.js` manages HTTP requests and local history

- `backend/main.py`
  - API endpoints for prediction and report generation
  - Model loading and preprocessing logic
  - Utility functions for encoding masks and calculating tumor size

- `backend/report_generator.py`
  - Creates PDF reports with patient and prediction details
  - Formats output images and text into a professional medical report

- `src/*.py`
  - Training scripts for models
  - Streamlit demo interface for alternate usage

## Key Endpoints

- `/predict/binary`: binary healthy vs tumor classification
- `/predict/type`: tumor subtype classification
- `/predict/segmentation`: segmentation mask and area
- `/predict/full`: combined pipeline for full inference
- `/generate-report`: generate and download PDF report
- `/get-local-ip`: returns local network IP for mobile access

## Communication Pattern

- Frontend → Backend: HTTP POST for image upload and prediction
- Backend → Frontend: JSON results, Base64 images,/report link
- Frontend stores user analysis results locally for history browsing

## Deployment Notes

- The project is designed for local development.
- No cloud orchestration or database services are currently included.
- The presence of `requirements.txt` and `frontend/package.json` supports separate backend/frontend environment setup.
- Running Streamlit is optional and provides an alternate demo interface.

## Scalability Considerations

- Add a database for persistent history and user accounts.
- Introduce caching to speed repeated predictions.
- Containerize backend and frontend for deployment.
- Configure HTTPS and secure API access.
- Add logging and monitoring for production readiness.

# Technology Stack

## Frontend

- React: UI framework for single-page application
- Vite: fast frontend build and development tool
- Tailwind CSS: utility-first styling framework
- Framer Motion: animated UI transitions
- React Router DOM: client-side routing
- Axios: API requests
- React Hot Toast: notification system
- Recharts: charting and visualization
- React QR Code: QR generation

## Backend

- Python: main server and ML scripting language
- FastAPI: API framework for inference services
- Uvicorn: ASGI server for running FastAPI
- TensorFlow / Keras: machine learning model training and inference
- OpenCV: image loading and preprocessing
- Pillow: image conversion and handling
- ReportLab: PDF report creation
- Pydantic: data validation

## Data Science

- NumPy: numerical operations
- pandas: dataframes and CSV export
- scikit-learn: metrics and train/test splitting
- matplotlib: plots and visualization
- seaborn: confusion matrix visualizations
- qrcode: QR image generation in Streamlit

## Development Tools

- npm / Node.js: frontend dependency and script management
- ESLint: JavaScript linting
- Tailwind CLI: CSS build integration

## Storage

- Browser localStorage: client-side history persistence
- Local file system: dataset storage and model files
