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
