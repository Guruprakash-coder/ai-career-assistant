import os
import io
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
import google.generativeai as genai

app = FastAPI()

# 1. Authenticate with Google using the key from your .env file
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.get("/")
def read_root():
    return {"message": "Python AI Service is running!"}

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Please upload a PDF file."}
    
    # 2. Extract Text from PDF (What we did before)
    content = await file.read()
    pdf = PdfReader(io.BytesIO(content))
    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text()
        
    # 3. The AI Prompt Setup
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    You are an expert technical AI recruiter. Read the following resume text.
    Extract the candidate's top technical skills, give the resume a score out of 100 
    based on standard software engineering roles, and provide a 2-sentence summary of their profile.
    
    Return the response as a clean JSON format.
    
    Resume Text:
    {extracted_text}
    """
    
    # 4. Send to the LLM and wait for the response
    response = model.generate_content(prompt)
    
    # 5. Return the AI's analysis to the user!
    return {
        "filename": file.filename,
        "ai_analysis": response.text
    }