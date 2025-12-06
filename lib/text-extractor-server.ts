import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Server-side text extraction from various file formats
 * This runs on the server where Node.js Buffer is available
 */

export async function extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        return await extractTextFromPDF(file);
    }

    // DOCX files
    if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
    ) {
        return await extractTextFromDOCX(file);
    }

    // TXT files
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        return await extractTextFromTXT(file);
    }

    // Unknown file type - fallback to manual input
    throw new Error("Unsupported file type. Please use PDF, TXT, or DOCX files.");
}

async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF file");
    }
}

async function extractTextFromDOCX(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert DOCX to text using mammoth
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        throw new Error("Failed to extract text from DOCX file");
    }
}

async function extractTextFromTXT(file: File): Promise<string> {
    try {
        const text = await file.text();
        return text;
    } catch (error) {
        console.error("Error extracting text from TXT:", error);
        throw new Error("Failed to extract text from TXT file");
    }
}

