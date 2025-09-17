# ValueNumber™ Application - Production Deployment Guide

## Quick Deployment Instructions

### Prerequisites
- Python 3.8+
- MongoDB (local or cloud)
- Node.js 16+ (for frontend build - already built)

### Environment Setup

1. **Backend Environment Variables**
   Create `/backend/.env` with:
   ```
   MONGO_URL=mongodb://localhost:27017/valuenumber
   JWT_SECRET=your-super-secret-jwt-key-here
   EMERGENT_LLM_KEY=your-emergent-llm-key
   ```

2. **Frontend Environment Variables**
   Create `/frontend/.env` with:
   ```
   REACT_APP_BACKEND_URL=http://your-domain.com
   ```

### Deployment Steps

1. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   uvicorn server:app --host 0.0.0.0 --port 8001
   ```

3. **Serve Frontend**
   The `build` folder contains production-ready static files.
   
   **Option A: Using a web server (Recommended)**
   - Upload the `build` folder contents to your web server
   - Configure your web server to serve static files
   - Ensure API calls to `/api/*` are proxied to your backend

   **Option B: Using Node.js serve**
   ```bash
   npm install -g serve
   serve -s build -p 3000
   ```

### Important Notes

- **Database**: Ensure MongoDB is running and accessible at MONGO_URL
- **CORS**: Backend is configured to accept requests from your frontend domain
- **API Routes**: All backend routes are prefixed with `/api/`
- **Passcode**: Default admin passcode is "VN-2025-GO"

### Production Checklist

- [ ] Update REACT_APP_BACKEND_URL to production domain
- [ ] Set secure JWT_SECRET
- [ ] Configure MongoDB connection
- [ ] Set up HTTPS/SSL
- [ ] Configure reverse proxy (nginx/apache)
- [ ] Test all functionality after deployment

### Troubleshooting

1. **Backend not starting**: Check MongoDB connection and environment variables
2. **Frontend API errors**: Verify REACT_APP_BACKEND_URL matches backend domain
3. **Authentication issues**: Check JWT_SECRET configuration
4. **Calculator not working**: Ensure EMERGENT_LLM_KEY is properly set

For support, visit: https://emergent.com/support