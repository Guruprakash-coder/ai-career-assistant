from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
import io

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from the Python ML Service! Docker is working."}

# Our new POST route to handle resume uploads
@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    # 1. Security Check: Make sure they actually uploaded a PDF
    if not file.filename.endswith(".pdf"):
        return {"error": "Please upload a PDF file."}
    
    # 2. Read the file into memory
    content = await file.read()
    pdf = PdfReader(io.BytesIO(content))
    
    # 3. Loop through the pages and extract the text
    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text()
        
    # 4. For now, let's just return some stats to prove it worked!
    word_count = len(extracted_text.split())
    
    return {
        "filename": file.filename,
        "total_pages": len(pdf.pages),
        "word_count": word_count,
        "text_preview": extracted_text[:200] + "..." # Just show the first 200 characters
    }