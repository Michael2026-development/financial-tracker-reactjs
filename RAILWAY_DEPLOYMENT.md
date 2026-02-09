# Railway Deployment Guide

This guide walks you through deploying your backend API to Railway.

## Prerequisites

- GitHub account (to connect Railway)
- Railway account (sign up at https://railway.app)
- Your Gemini API key (for receipt scanning feature)

## Step 1: Prepare Your Repository

1. Make sure all changes are committed to git
2. Push your code to GitHub if not already there

## Step 2: Create Railway Project

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `financial-tracker` repository
5. Railway will detect your monorepo - select the `apps/api` folder as the root

## Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. Note: The `DATABASE_URL` environment variable will be automatically created

## Step 4: Configure Environment Variables

In your Railway project settings, add these environment variables:

```
BETTER_AUTH_SECRET=<generate-a-secure-secret>
BETTER_AUTH_URL=https://<your-railway-domain>.up.railway.app
GEMINI_API_KEY=<your-gemini-api-key>
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
FRONTEND_PRODUCTION_URL=https://financial-tracker-weld.vercel.app
```

**To generate a secure BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 5: Set Build Configuration

Railway should auto-detect your build settings from `railway.json`, but verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `apps/api` (if monorepo)

## Step 6: Deploy

1. Click **"Deploy"** in Railway
2. Watch the build logs
3. Once deployed, Railway will give you a public URL like: `https://your-app.up.railway.app`

## Step 7: Run Database Migrations

After first deployment, you need to initialize your database:

1. Click on your API service in Railway
2. Go to the **"Settings"** tab
3. Find the **"Database"** connection string
4. Use Railway's built-in terminal or run locally:

```bash
# Set the production DATABASE_URL temporarily
export DATABASE_URL="<your-railway-postgres-url>"

# Run migrations
npm run db:push
```

Or you can use Railway's CLI:
```bash
railway link
railway run npm run db:push
```

## Step 8: Test Your Backend

Visit your Railway URL + `/api/health`:
```
https://your-app.up.railway.app/api/health
```

You should see:
```json
{"status": "ok", "timestamp": "2026-02-09T..."}
```

## Step 9: Update Frontend

1. Update `apps/web/.env.production` with your Railway URL:
```
VITE_API_URL=https://your-app.up.railway.app
```

2. In Vercel dashboard, update environment variable:
   - Navigate to your project settings
   - Go to "Environment Variables"
   - Add `VITE_API_URL` = `https://your-app.up.railway.app`

3. Redeploy your frontend on Vercel

## Troubleshooting

### Build Fails
- Check Railway build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally with `npm run build`

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly in Railway
- Check that PostgreSQL addon is running
- Run `npm run db:push` to initialize schema

### CORS Errors
- Verify `FRONTEND_PRODUCTION_URL` includes your Vercel URL
- Check Railway logs for CORS-related errors
- Ensure cookies are enabled in your browser

### Authentication Not Working
- Verify `BETTER_AUTH_URL` matches your Railway domain
- Check that `BETTER_AUTH_SECRET` is set
- Clear browser cookies and try again

## Next Steps

After successful deployment:
1. Test sign up from your Vercel app
2. Test sign in
3. Add a test transaction
4. Verify all features work end-to-end

## Useful Railway Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# View logs
railway logs

# Run commands in Railway environment
railway run <command>
```
