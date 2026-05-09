# Viva Questions and Answers

## Q1: What is the main objective of this project?

A1: To automate brain tumor diagnosis from medical scan images using AI models and provide a usable web interface for analysis, classification, segmentation, and reporting.

## Q2: Which technologies are used in the frontend?

A2: The frontend uses React, Vite, Tailwind CSS, Framer Motion, React Router DOM, Axios, React Hot Toast, Recharts, and React QR Code.

## Q3: Which backend framework is used and why?

A3: FastAPI is used because it is lightweight, supports asynchronous endpoints, has integrated validation with Pydantic, and works well with Python machine learning libraries.

## Q4: What machine learning models are included in the project?

A4: A custom CNN for binary detection, a MobileNetV2 transfer learning model for tumor type classification, and a U-Net-style segmentation model for tumor masks.

## Q5: What is the purpose of the `/predict/full` endpoint?

A5: `/predict/full` runs the full inference pipeline, returning binary detection results and, if a tumor is detected, tumor type prediction, segmentation output, and size categorization.

## Q6: How is tumor segmentation handled?

A6: A U-Net-style model predicts a binary mask from the input image. The backend then thresholds the mask and calculates tumor area percentage.

## Q7: Is there any database used?

A7: No. The project stores analysis history in browser `localStorage` and does not use server-side database storage.

## Q8: How does the system generate reports?

A8: The backend uses ReportLab to create a PDF report containing patient details, scan information, predictions, and segmentation outcomes.

## Q9: What are the main limitations of the current implementation?

A9: Limitations include no secure authentication, no persistent database, local-only deployment configuration, and no explicit cloud infrastructure.

## Q10: What future improvements would you recommend?

A10: Add user authentication, database persistence, Docker/cloud deployment, DICOM support, model explainability, and production-grade logging.
