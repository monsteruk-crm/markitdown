import io
import tempfile
import os
from typing import Optional

import fastapi
import fastapi.middleware.cors
from fastapi import UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from markitdown import MarkItDown

app = fastapi.FastAPI(
    title="MarkItDown API",
    description="Convert documents to Markdown using Microsoft MarkItDown",
    version="1.0.0",
)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MarkItDown
md = MarkItDown(enable_plugins=False)


@app.get("/health")
async def health() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "service": "markitdown", "version": "1.0.0"}


@app.post("/convert")
async def convert_file(
    file: UploadFile = File(..., description="File to convert to Markdown"),
) -> dict[str, str]:
    """
    Convert an uploaded file to Markdown.
    
    Supports: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), 
    HTML, CSV, JSON, XML, images, and more.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Read file content
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    # Get file extension
    _, ext = os.path.splitext(file.filename)
    
    try:
        # Create a temporary file with the correct extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        # Convert using MarkItDown
        result = md.convert_local(tmp_path)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        return {
            "filename": file.filename,
            "markdown": result.text_content or "",
            "title": result.title or file.filename,
        }
    except Exception as e:
        # Clean up temp file on error
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@app.post("/convert-url")
async def convert_url(
    url: str = Query(..., description="URL to convert to Markdown"),
) -> dict[str, str]:
    """
    Convert content from a URL to Markdown.
    
    Supports: Web pages (HTML), YouTube URLs (transcription), 
    and direct links to supported file types.
    """
    if not url:
        raise HTTPException(status_code=400, detail="No URL provided")
    
    try:
        result = md.convert(url)
        return {
            "url": url,
            "markdown": result.text_content or "",
            "title": result.title or url,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@app.get("/supported-formats")
async def supported_formats() -> dict[str, list[str]]:
    """List supported file formats for conversion."""
    return {
        "documents": [".pdf", ".docx", ".pptx", ".xlsx", ".xls"],
        "web": [".html", ".htm"],
        "data": [".csv", ".json", ".xml"],
        "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
        "audio": [".mp3", ".wav"],
        "archives": [".zip"],
        "ebooks": [".epub"],
        "other": ["YouTube URLs", "Web pages"],
    }
