from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    img = Image.open(file.file)
    img = img.convert("RGB") # для PNG и других форматов
    img = img.resize((800, 600), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/jpeg")