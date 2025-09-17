from fastapi import FastAPI, APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import smtplib
from email.message import EmailMessage
import jwt
import bcrypt

from fastapi import BackgroundTasks, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import tempfile
import zipfile

# Optional: Google Drive integration
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build as gbuild
    from googleapiclient.http import MediaFileUpload
    GOOGLE_DRIVE_AVAILABLE = True
except Exception:
    GOOGLE_DRIVE_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins.split(',')] if cors_origins else ['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

class ConceptAccessCreate(BaseModel):
    fullname: str
    email: EmailStr
    zip: str

class ConceptAccess(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullname: str
    email: EmailStr
    zip: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


def _send_gmail_notification(data: ConceptAccess) -> dict:
    host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    port = int(os.environ.get('SMTP_PORT', '587'))
    user = os.environ.get('SMTP_USER')
    password = os.environ.get('SMTP_PASS')
    to_email = os.environ.get('NOTIFY_TO', '713Consulting@gmail.com')
    from_email = os.environ.get('FROM_EMAIL', user or 'no-reply@713consulting.net')
    from_name = os.environ.get('FROM_NAME', '713 Consulting Notifications')
    reply_to = os.environ.get('REPLY_TO', '713Consulting@gmail.com')

    if not (user and password):
        raise HTTPException(status_code=500, detail="SMTP_USER/SMTP_PASS not configured on server")

    msg = EmailMessage()
    msg['Subject'] = f"Concepts Access — {data.fullname}"
    msg['From'] = f"{from_name} <{from_email}>"
    msg['To'] = to_email
    msg['Reply-To'] = reply_to
    msg.set_content(
        f"""
A visitor accessed 713Consulting.net/concepts

Name: {data.fullname}
Email: {data.email}
ZIP: {data.zip}
Time (UTC): {data.timestamp}
""".strip()
    )

    sent = False
    error = None
    try:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(user, password)
            smtp.send_message(msg)
            sent = True
    except Exception as e:
        error = str(e)
    return {"sent": sent, "error": error}


@api_router.post('/notify/concepts-access')
async def notify_concepts_access(payload: ConceptAccessCreate):
    record = ConceptAccess(**payload.dict())
    # store to mongo (safe even if email fails)
    await db.concepts_access.insert_one(record.dict())
    # try email
    result = _send_gmail_notification(record)
    return {"ok": True, "email_sent": result.get('sent', False), "error": result.get('error'), "record_id": record.id}

# Utility to zip directories on-demand for reliable downloads

def _zip_directory_to_temp(base_dir: Path, exclude_prefixes=None, zip_name_prefix="archive") -> str:
    """Create a temporary zip file from base_dir, excluding any path that starts with prefixes.
    Returns the temp file path.
    """
    exclude_prefixes = exclude_prefixes or []
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".zip", prefix=f"{zip_name_prefix}-")
    tmp_path = tmp.name
    tmp.close()

    base_dir = Path(base_dir)

    with zipfile.ZipFile(tmp_zip := tmp_path, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir):
            rel_root = Path(root)
            normalized_root = str(rel_root).replace("\\", "/")
            skip_root = any(normalized_root.startswith(prefix) for prefix in (exclude_prefixes or []))
            if skip_root:
                dirs[:] = []
                continue
            for f in files:
                abs_path = Path(root) / f
                norm_abs = str(abs_path).replace("\\", "/")
                if any(norm_abs.startswith(prefix) for prefix in (exclude_prefixes or [])):
                    continue
                arcname = str(abs_path.relative_to(base_dir))
                zf.write(str(abs_path), arcname)

    return tmp_zip


@api_router.get("/download/source", response_class=FileResponse)
async def download_source(background_tasks: BackgroundTasks):
    base_dir = ROOT_DIR.parent  # /app
    exclude_prefixes = [
        str((base_dir / "frontend" / "node_modules")).replace("\\", "/"),
        str((base_dir / "frontend" / "build")).replace("\\", "/"),
        str((base_dir / ".git")).replace("\\", "/"),
        str((base_dir / "tests")).replace("\\", "/"),
        str((base_dir / "scripts")).replace("\\", "/"),
        str((base_dir / "__pycache__")).replace("\\", "/"),
    ]
    try:
        tmp_zip = _zip_directory_to_temp(base_dir, exclude_prefixes=exclude_prefixes, zip_name_prefix="713-source")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create source archive: {e}")

    filename = "713-consulting-source.zip"
    background_tasks.add_task(os.remove, tmp_zip)
    return FileResponse(tmp_zip, media_type="application/zip", filename=filename)


@api_router.get("/download/build", response_class=FileResponse)
async def download_build(background_tasks: BackgroundTasks):
    base_dir = ROOT_DIR.parent  # /app
    build_dir = base_dir / "frontend" / "build"
    if not build_dir.exists() or not any(build_dir.iterdir()):
        raise HTTPException(status_code=404, detail="Production build not found. Please run yarn build to generate /frontend/build.")

    try:
        tmp_zip = _zip_directory_to_temp(build_dir, exclude_prefixes=[], zip_name_prefix="713-build")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create build archive: {e}")

    filename = "713-consulting-build.zip"
    background_tasks.add_task(os.remove, tmp_zip)
    return FileResponse(tmp_zip, media_type="application/zip", filename=filename)


def _drive_service_from_env():
    if not GOOGLE_DRIVE_AVAILABLE:
        raise HTTPException(status_code=501, detail="Google Drive client not installed on server")
    sa_json = os.environ.get("GOOGLE_DRIVE_SA_JSON")
    folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
    if not sa_json or not folder_id:
        raise HTTPException(status_code=400, detail="Google Drive not configured. Please provide GOOGLE_DRIVE_SA_JSON and GOOGLE_DRIVE_FOLDER_ID.")
    try:
        import json
        info = json.loads(sa_json)
        creds = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/drive"])
        service = gbuild('drive', 'v3', credentials=creds)
        return service, folder_id
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google Drive credentials: {e}")


def _drive_upload_file(service, folder_id: str, file_path: str, filename: str):
    file_metadata = { 'name': filename, 'parents': [folder_id] }
    media = MediaFileUpload(file_path, mimetype='application/zip', resumable=False)
    created = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink, webContentLink').execute()
    # Make file link-accessible (anyone with link can view)
    service.permissions().create(fileId=created['id'], body={'type': 'anyone', 'role': 'reader'}).execute()
    return created
    media = MediaFileUpload(file_path, mimetype='application/zip', resumable=False)
    created = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink, webContentLink').execute()
    # Make file link-accessible (anyone with link can view)
    service.permissions().create(fileId=created['id'], body={'type': 'anyone', 'role': 'reader'}).execute()
    return created

@api_router.get("/download/all-in-one", response_class=FileResponse)
async def download_all_in_one(background_tasks: BackgroundTasks):
    base_dir = ROOT_DIR.parent  # /app
    # Exclude heavy/irrelevant folders, but INCLUDE frontend/build in this archive
    exclude_prefixes = [
        str((base_dir / "frontend" / "node_modules")).replace("\\", "/"),
        str((base_dir / ".git")).replace("\\", "/"),
        str((base_dir / "__pycache__")).replace("\\", "/"),
        str((base_dir / "tests")).replace("\\", "/"),
        str((base_dir / "scripts")).replace("\\", "/"),
    ]
    try:
        tmp_zip = _zip_directory_to_temp(base_dir, exclude_prefixes=exclude_prefixes, zip_name_prefix="713-all")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create all-in-one archive: {e}")

    filename = "713-consulting-all-in-one.zip"
    background_tasks.add_task(os.remove, tmp_zip)
    return FileResponse(tmp_zip, media_type="application/zip", filename=filename)


@api_router.get("/export/google-drive/source")
async def export_drive_source(background_tasks: BackgroundTasks):
    service, folder_id = _drive_service_from_env()
    base_dir = ROOT_DIR.parent
    exclude_prefixes = [
        str((base_dir / "frontend" / "node_modules")).replace("\\", "/"),
        str((base_dir / "frontend" / "build")).replace("\\", "/"),
        str((base_dir / ".git")).replace("\\", "/"),
        str((base_dir / "tests")).replace("\\", "/"),
        str((base_dir / "scripts")).replace("\\", "/"),
        str((base_dir / "__pycache__")).replace("\\", "/"),
    ]
    tmp_zip = _zip_directory_to_temp(base_dir, exclude_prefixes=exclude_prefixes, zip_name_prefix="713-source")
    try:
        created = _drive_upload_file(service, folder_id, tmp_zip, "713-consulting-source.zip")
        return JSONResponse({"id": created['id'], "webViewLink": created.get('webViewLink'), "webContentLink": created.get('webContentLink')})
    finally:
        background_tasks.add_task(os.remove, tmp_zip)


@api_router.get("/export/google-drive/build")
async def export_drive_build(background_tasks: BackgroundTasks):
    service, folder_id = _drive_service_from_env()
    base_dir = ROOT_DIR.parent
    build_dir = base_dir / "frontend" / "build"
    if not build_dir.exists() or not any(build_dir.iterdir()):
        raise HTTPException(status_code=404, detail="Production build not found. Please run yarn build to generate /frontend/build.")
    tmp_zip = _zip_directory_to_temp(build_dir, exclude_prefixes=[], zip_name_prefix="713-build")
    try:
        created = _drive_upload_file(service, folder_id, tmp_zip, "713-consulting-build.zip")
        return JSONResponse({"id": created['id'], "webViewLink": created.get('webViewLink'), "webContentLink": created.get('webContentLink')})
    finally:
        background_tasks.add_task(os.remove, tmp_zip)

# Include the router in the main app (after all routes are defined)
app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()