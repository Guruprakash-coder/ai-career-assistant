import os
import io
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from google import genai # <--- The new import!

app = FastAPI()

# The new SDK automatically looks for the GEMINI_API_KEY in your .env!
client = genai.Client()

@app.get("/")
def read_root():
    return {"message": "Python AI Service is running!"}

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Please upload a PDF file."}
    
    # 1. Extract Text
    content = await file.read()
    pdf = PdfReader(io.BytesIO(content))
    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text()
        
    # 2. Setup Prompt
    prompt = f"""
    You are an expert technical AI recruiter. Read the following resume text.
    Extract the candidate's top technical skills, give the resume a score out of 100 
    based on standard software engineering roles, and provide a 2-sentence summary of their profile.
    
    Return the response as a clean JSON format.
    
    Resume Text:
    {extracted_text}
    """
    
    # 3. New SDK Execution Syntax
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    
    return {
        "filename": file.filename,
        "ai_analysis": response.text
    }