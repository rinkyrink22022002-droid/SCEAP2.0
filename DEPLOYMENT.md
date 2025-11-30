# SCEAP 2.0 Deployment Guide

## Quick Deployment Checklist

- [x] Frontend: Built successfully (273.89 kB gzip)
- [x] Backend: All Python files compile
- [x] API: All endpoints tested and working
- [x] Git: Clean commit history, pushed to GitHub
- [x] TypeScript: Zero compilation errors
- [x] Environment: Configured for dev and production

## Deployment Steps

### Option 1: Deploy to Render (Recommended - One Click)

1. **Connect Repository**
   - Go to https://render.com
   - Sign in / Create account
   - Click "New" → "Blueprint"
   - Connect your GitHub repository: `rinkyrink22022002-droid/SCEAP2.0`
   - Click "Connect"

2. **Select Branch**
   - Select `main` branch
   - Click "Deploy"

3. **Render will automatically**
   - Deploy backend service (sceap-backend)
   - Deploy frontend static site (sceap-frontend)
   - Configure environment variables
   - Set up HTTPS and auto-renewal

4. **After Deployment**
   - Backend URL: `https://sceap-backend-xxxx.onrender.com`
   - Frontend URL: `https://sceap-frontend-xxxx.onrender.com`
   - Frontend will automatically use backend URL

### Option 2: Manual Deploy (Advanced)

#### Backend Deployment

1. Create new Web Service on Render
2. Configure:
   - **Name**: sceap-backend
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install poetry && poetry install`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variable**: `PYTHONUNBUFFERED=1`

#### Frontend Deployment

1. Create new Static Site on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variable**: `VITE_API_BASE=https://your-backend-url.onrender.com`

### Option 3: Deploy to Vercel/Netlify (Frontend Only)

**Frontend**:
1. Connect repository to Vercel/Netlify
2. Set Framework: `Vite`
3. Set Build Command: `cd frontend && npm run build`
4. Set Publish Directory: `frontend/dist`
5. Add Environment Variable: `VITE_API_BASE=https://your-backend-url`

**Backend** (requires separate deployment):
- Use Render/Railway/Heroku/AWS

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://sceap-backend-xxxx.onrender.com/
# Expected: {"status":"UP"}
```

### 2. Single Cable Sizing
```bash
curl -X POST https://sceap-backend-xxxx.onrender.com/cable/size \
  -H "Content-Type: application/json" \
  -d '{"cable_number":"TEST-001","load_kw":55,"voltage":415,"pf":0.85,"eff":0.95,"length":100,"mv_per_a_m":0.44,"derating_factors":[1.0,0.9],"csa_options":[25,35,50,70,95,120,150,185,240],"sc_current":8000,"sc_time":1,"k_const":115}'
```

### 3. Cable Catalogue
```bash
curl "https://sceap-backend-xxxx.onrender.com/cable/catalog?min_csa=10&max_csa=120"
```

### 4. Frontend Access
- Open `https://sceap-frontend-xxxx.onrender.com`
- Fill in cable sizing form
- Click "Run Cable Sizing Engine"
- Verify results displayed correctly

## Troubleshooting

### Backend not responding
- Check Render logs: Dashboard → sceap-backend → Logs
- Verify `PYTHONUNBUFFERED=1` is set
- Check Python version compatibility

### Frontend showing blank page
- Check browser console for errors
- Verify `VITE_API_BASE` environment variable
- Ensure backend URL is correct and accessible

### API requests failing (CORS)
- Backend CORS is enabled for all origins
- Check browser Network tab for request/response
- Verify backend is running

### High memory usage
- Monitor on Render dashboard
- Consider scaling up instance

## Environment Variables

### Frontend (VITE_* prefix)
```
VITE_API_BASE=https://sceap-backend-xxxx.onrender.com
VITE_ENABLE_ADVANCED_ROUTING=false
VITE_ENABLE_TRAY_VISUALIZATION=false
```

### Backend (Direct)
```
PYTHONUNBUFFERED=1
PORT=8000 (auto-set by Render)
```

## Monitoring & Maintenance

### Daily
- Check Render Dashboard for errors
- Monitor API response times

### Weekly
- Review error logs
- Check build/deploy status

### Monthly
- Update dependencies
- Security audit (poetry audit)

## Rollback Procedure

If deployment fails:

1. On Render Dashboard, select service
2. Click "Manual Deploy" → select previous commit
3. Or revert git commit and push:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
4. Render auto-redeploys on push

## Performance Optimization

- Frontend: ~273 kB gzip (already optimized)
- Backend: Python 3.11 with async support
- No database queries (in-memory catalogue)
- Minimal dependencies

## Support

For issues:
1. Check logs on Render Dashboard
2. Review this guide's troubleshooting section
3. Open GitHub issue with:
   - Error message
   - Render build logs
   - Browser console errors

---

**Deployment Status**: Ready for production  
**Last Updated**: November 2025
