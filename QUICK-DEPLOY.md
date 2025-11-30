# 🚀 SCEAP 2.0 - DEPLOYMENT INSTRUCTIONS

## Quick Deploy to Render.com

### Step 1: Click the Deploy Button Below

🎯 **[DEPLOY TO RENDER](https://render.com/deploy?repo=https://github.com/rinkyrink22022002-droid/SCEAP2.0)**

This will:
1. Take you to Render.com
2. Ask you to connect your GitHub account (if not already connected)
3. Create a new Blueprint deployment
4. Automatically configure both services:
   - **Backend**: Python FastAPI service
   - **Frontend**: Static React site

### Step 2: Authorize & Deploy

1. Click "Connect Repository" or "Deploy" on Render
2. Select the `main` branch
3. Click "Deploy Blueprint"
4. Wait ~10-15 minutes for build to complete

### Step 3: Get Your Live URLs

After deployment completes, you'll see:
- **Backend URL**: `https://sceap-backend-xxxx.onrender.com`
- **Frontend URL**: `https://sceap-frontend-xxxx.onrender.com`

### Step 4: Test Manually

Open the **Frontend URL** in your browser and:

1. **Fill in the form**:
   - Load: 55 kW
   - Voltage: 415V
   - Length: 100m
   - Click "Run Cable Sizing Engine"

2. **Verify Results**:
   - Should show CSA ~120 mm²
   - Voltage drop calculation
   - Short-circuit check status

3. **Test Approval Workflow**:
   - Click checkbox to approve the cable
   - Progress bar should show "1 of 1 approved"
   - Click "Export Results as Excel"

4. **Test Bulk Mode**:
   - Click "Add Row" multiple times
   - Enter different loads
   - Click "Calculate All"
   - Check multiple cables, then "Bulk Approve All"

---

## Manual Deployment (If Button Doesn't Work)

If the button above doesn't work, manually deploy:

1. Go to https://render.com
2. Sign in (create account if needed)
3. Click **"New"** → **"Blueprint"**
4. **Connect Repository**: `https://github.com/rinkyrink22022002-droid/SCEAP2.0`
5. Select **`main`** branch
6. Click **"Deploy"**
7. Wait for build completion (~10-15 minutes)

---

## Expected Timeline

| Phase | Time | What Happens |
|-------|------|--------------|
| Blueprint creation | 1 min | Render reads render.yaml config |
| Backend build | 3-5 min | Installs Python deps, prepares FastAPI |
| Frontend build | 3-5 min | npm install, Vite build |
| Deploy & routing | 1-2 min | Services go live, HTTPS enabled |
| **Total** | **~10-15 min** | **✅ Live & accessible** |

---

## After Deployment - Testing Checklist

### Health Check
```bash
curl https://your-backend-url/
# Expected: {"status":"UP"}
```

### Single Cable Sizing
- Form: 55 kW, 415V, 100m
- Expected Result: CSA 120 mm² with metrics

### Bulk Sizing
- Add 2-3 rows with different loads
- Expected: All sized correctly

### Approval Workflow
- Check a cable, see progress update
- Expected: Progress bar shows "1 of X approved"

### Export
- Click "Export Results as Excel"
- Expected: Excel file downloads

### 3D Visualization
- View the animated 3D cable panel
- Expected: Animated cores, compliance indicators

---

## Need Help?

See the documentation in the repository:
- `README.md` - Project overview
- `DEPLOYMENT.md` - Detailed deployment guide
- `READY-TO-DEPLOY.md` - Quick reference

---

**Status**: Ready to deploy  
**Repository**: https://github.com/rinkyrink22022002-droid/SCEAP2.0  
**Branch**: main  
**Configuration**: render.yaml (pre-configured)

Let's go live! 🚀
