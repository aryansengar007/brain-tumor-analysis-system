import io
import uuid
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import cv2
import numpy as np
from PIL import Image as PILImage
import base64


def generate_pdf_report(data):
    """
    Generate a professional medical PDF report for brain tumor analysis.

    Args:
        data (dict): Contains patient info, image, and analysis results

    Returns:
        bytes: PDF content as bytes
    """
    # Create PDF buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.darkblue,
    )

    header_style = ParagraphStyle(
        "Header",
        parent=styles["Normal"],
        fontSize=14,
        spaceAfter=10,
        alignment=TA_LEFT,
        textColor=colors.black,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=16,
        spaceAfter=15,
        spaceBefore=20,
        textColor=colors.darkblue,
        borderWidth=1,
        borderColor=colors.lightgrey,
        borderPadding=5,
    )

    normal_style = styles["Normal"]
    normal_style.fontSize = 11
    normal_style.spaceAfter = 8

    # Story elements
    story = []

    # HEADER
    story.append(Paragraph("Brain Tumor AI Diagnostic System", title_style))
    story.append(Spacer(1, 0.5 * inch))

    # Report Info
    report_id = str(uuid.uuid4())[:8].upper()
    current_time = datetime.now()

    header_data = [
        ["Report ID:", report_id],
        ["Date & Time:", current_time.strftime("%Y-%m-%d %H:%M:%S")],
        ["System Version:", "1.0.0"],
    ]

    header_table = Table(header_data, colWidths=[2 * inch, 4 * inch])
    header_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(header_table)
    story.append(Spacer(1, 0.3 * inch))

    # PATIENT DETAILS
    story.append(Paragraph("PATIENT INFORMATION", section_style))

    patient_data = [
        ["Patient Name:", data.get("patient_name", "N/A")],
        ["Age:", str(data.get("age", "N/A"))],
        ["Gender:", data.get("gender", "N/A")],
        ["Patient ID:", data.get("patient_id", f"P{report_id}")],
    ]

    patient_table = Table(patient_data, colWidths=[2 * inch, 4 * inch])
    patient_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ]
        )
    )
    story.append(patient_table)
    story.append(Spacer(1, 0.2 * inch))

    # SCAN DETAILS
    story.append(Paragraph("SCAN DETAILS", section_style))

    scan_data = [
        ["Scan Type:", data.get("scan_type", "MRI/CT")],
        ["Image Filename:", data.get("image_filename", "N/A")],
        ["Upload Timestamp:", current_time.strftime("%Y-%m-%d %H:%M:%S")],
    ]

    scan_table = Table(scan_data, colWidths=[2 * inch, 4 * inch])
    scan_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ]
        )
    )
    story.append(scan_table)
    story.append(Spacer(1, 0.2 * inch))

    # ANALYSIS RESULTS
    story.append(Paragraph("ANALYSIS RESULTS", section_style))

    binary_result = data.get("result", "N/A")
    confidence = data.get("confidence", 0)

    analysis_data = [
        ["Binary Classification:", binary_result],
        ["Confidence Score:", ".1f"],
    ]

    analysis_table = Table(analysis_data, colWidths=[2 * inch, 4 * inch])
    analysis_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ]
        )
    )
    story.append(analysis_table)

    # Tumor Type if applicable
    if binary_result == "Tumor":
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph("Tumor Classification Details", styles["Heading3"]))

        tumor_type = data.get("tumor_type", "N/A")
        probabilities = data.get("probabilities", {})

        type_data = [["Tumor Type:", tumor_type]]
        type_table = Table(type_data, colWidths=[2 * inch, 4 * inch])
        type_table.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 11),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("BACKGROUND", (0, 0), (-1, -1), colors.lightgrey),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ]
            )
        )
        story.append(type_table)

        # Probabilities
        if probabilities:
            story.append(Spacer(1, 0.1 * inch))
            prob_data = [["Type", "Probability"]]
            for tumor_type_name, prob in probabilities.items():
                prob_data.append([tumor_type_name.capitalize(), ".1f"])

            prob_table = Table(prob_data, colWidths=[2 * inch, 2 * inch])
            prob_table.setStyle(
                TableStyle(
                    [
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
                        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                        ("BACKGROUND", (0, 0), (0, 0), colors.darkblue),
                        ("TEXTCOLOR", (0, 0), (0, 0), colors.white),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ]
                )
            )
            story.append(prob_table)

    story.append(Spacer(1, 0.2 * inch))

    # SEGMENTATION ANALYSIS
    story.append(Paragraph("SEGMENTATION ANALYSIS", section_style))

    tumor_area = data.get("tumor_area", 0)
    size_category = data.get("size_category", "N/A")

    seg_data = [["Tumor Area:", ".1f"], ["Size Category:", size_category]]

    seg_table = Table(seg_data, colWidths=[2 * inch, 4 * inch])
    seg_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ]
        )
    )
    story.append(seg_table)
    story.append(Spacer(1, 0.2 * inch))

    # VISUALS
    story.append(Paragraph("VISUAL ANALYSIS", section_style))

    # Add images if available
    original_image = data.get("original_image")
    segmentation_mask = data.get("segmentation_mask")

    if original_image:
        try:
            # Decode base64 image
            img_data = base64.b64decode(
                original_image.split(",")[1]
                if "," in original_image
                else original_image
            )
            img_buffer = io.BytesIO(img_data)
            img = PILImage.open(img_buffer)

            # Resize for PDF
            img.thumbnail((300, 300), PILImage.Resampling.LANCZOS)

            # Convert to RGB if necessary
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Save to buffer
            img_buffer = io.BytesIO()
            img.save(img_buffer, format="PNG")
            img_buffer.seek(0)

            story.append(Paragraph("Original Scan Image:", styles["Heading4"]))
            story.append(Image(img_buffer, width=3 * inch, height=3 * inch))
            story.append(Spacer(1, 0.1 * inch))
        except Exception as e:
            story.append(Paragraph("Original image could not be loaded.", normal_style))

    if segmentation_mask:
        try:
            # Create overlay image
            overlay_img = create_segmentation_overlay(original_image, segmentation_mask)
            if overlay_img:
                story.append(Paragraph("Segmentation Overlay:", styles["Heading4"]))
                story.append(Image(overlay_img, width=3 * inch, height=3 * inch))
                story.append(Spacer(1, 0.1 * inch))
        except Exception as e:
            story.append(
                Paragraph("Segmentation overlay could not be created.", normal_style)
            )

    # MEDICAL INTERPRETATION
    story.append(Paragraph("MEDICAL INTERPRETATION", section_style))

    interpretation = generate_medical_interpretation(data)
    story.append(Paragraph(interpretation, normal_style))
    story.append(Spacer(1, 0.2 * inch))

    # RECOMMENDATIONS
    story.append(Paragraph("RECOMMENDATIONS", section_style))

    recommendations = generate_recommendations(data)
    for rec in recommendations:
        story.append(Paragraph(f"• {rec}", normal_style))

    story.append(Spacer(1, 0.2 * inch))

    # DISCLAIMER
    story.append(Paragraph("DISCLAIMER", section_style))

    disclaimer = """
    This AI diagnostic system is designed to assist healthcare professionals in the analysis of brain scans.
    The results provided are for informational purposes only and should not be considered as a definitive diagnosis.
    All findings should be reviewed and confirmed by qualified medical professionals.
    This system is not a replacement for professional medical judgment, clinical examination, or laboratory testing.
    """

    story.append(Paragraph(disclaimer, normal_style))
    story.append(Spacer(1, 0.3 * inch))

    # FOOTER
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontSize=9,
        alignment=TA_CENTER,
        textColor=colors.grey,
    )

    story.append(
        Paragraph(
            "Developed by Aryan Sengar | Brain Tumor AI Diagnostic System v1.0.0",
            footer_style,
        )
    )
    story.append(Paragraph("For research and educational purposes only", footer_style))

    # Build PDF
    doc.build(story)

    # Get PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()

    return pdf_bytes


def create_segmentation_overlay(original_image_b64, mask_b64):
    """Create an overlay image combining original and segmentation mask"""
    try:
        # Decode original image
        orig_data = base64.b64decode(
            original_image_b64.split(",")[1]
            if "," in original_image_b64
            else original_image_b64
        )
        orig_img = PILImage.open(io.BytesIO(orig_data))

        # Decode mask
        mask_data = base64.b64decode(mask_b64)
        mask_img = PILImage.open(io.BytesIO(mask_data))

        # Ensure same size
        mask_img = mask_img.resize(orig_img.size, PILImage.Resampling.LANCZOS)

        # Create overlay
        overlay = PILImage.new("RGBA", orig_img.size, (0, 0, 0, 0))
        mask_rgba = PILImage.new("RGBA", mask_img.size, (255, 0, 0, 128))  # Red overlay

        # Apply mask
        overlay.paste(mask_rgba, mask=mask_img.convert("L"))

        # Composite with original
        result = PILImage.alpha_composite(orig_img.convert("RGBA"), overlay)

        # Save to buffer
        buffer = io.BytesIO()
        result.save(buffer, format="PNG")
        buffer.seek(0)

        return buffer
    except Exception as e:
        print(f"Error creating overlay: {e}")
        return None


def generate_medical_interpretation(data):
    """Generate automated medical interpretation text"""
    result = data.get("result", "Unknown")
    confidence = data.get("confidence", 0)
    tumor_type = data.get("tumor_type", "")
    tumor_area = data.get("tumor_area", 0)
    size_category = data.get("size_category", "")

    if result == "Healthy":
        interpretation = f"""
        The AI analysis indicates no significant tumor presence in the brain scan.
        The model shows a confidence level of {confidence:.1f}% in classifying this scan as healthy.
        No abnormal tissue regions were detected in the segmentation analysis.
        """
    else:
        interpretation = f"""
        The AI model has detected potential tumor tissue in the brain scan with a confidence level of {confidence:.1f}%.
        The identified tumor type is classified as {tumor_type}.
        Segmentation analysis reveals that the affected area constitutes approximately {tumor_area:.1f}% of the total scan region,
        which falls into the {size_category.lower()} size category.
        The highlighted regions in the segmentation overlay indicate areas of concern that should be further evaluated.
        """

    return interpretation.strip()


def generate_recommendations(data):
    """Generate medical recommendations based on analysis"""
    result = data.get("result", "Unknown")
    tumor_type = data.get("tumor_type", "")
    size_category = data.get("size_category", "")

    recommendations = []

    if result == "Tumor":
        recommendations.append(
            "Immediate consultation with a neurologist or neurosurgeon is recommended."
        )
        recommendations.append(
            "Further diagnostic imaging (MRI with contrast) should be considered for detailed evaluation."
        )
        recommendations.append(
            "Clinical correlation with patient symptoms and additional laboratory tests is advised."
        )

        if size_category == "Large":
            recommendations.append(
                "Urgent surgical evaluation may be necessary given the tumor size."
            )
        elif size_category == "Medium":
            recommendations.append(
                "Regular monitoring and follow-up imaging is recommended."
            )
        else:
            recommendations.append(
                "Close observation with periodic imaging follow-up is suggested."
            )

        if tumor_type in ["glioma", "meningioma"]:
            recommendations.append(
                "Consider referral to a specialized neuro-oncology center for comprehensive evaluation."
            )
    else:
        recommendations.append(
            "Continue routine health screenings as recommended by healthcare provider."
        )
        recommendations.append(
            "Maintain regular check-ups and report any new neurological symptoms promptly."
        )

    recommendations.append(
        "All AI findings should be interpreted in the context of clinical presentation and additional diagnostic tests."
    )

    return recommendations
