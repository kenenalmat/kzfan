# Quick Deployment Guide

Follow these steps to deploy your KZ Fan app to Render:

## Step 1: Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `kzfan`)
3. Don't initialize with README (we already have one)

## Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/kzfan.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Render

### Using Blueprint (Easiest)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Sign up or log in
3. Click **"New"** → **"Blueprint"**
4. Connect your GitHub account
5. Select your `kzfan` repository
6. Render will detect `render.yaml` and show:
   - ✅ Web Service: kzfan-app
   - ✅ PostgreSQL Database: kzfan-db
7. Click **"Apply"**

### Configure Environment Variables

After deployment starts:

1. Go to your web service in Render dashboard
2. Navigate to **"Environment"** tab
3. Add the following variable:
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: `8543944566:AAGWOwgjQhTl-V63sl7Xlm-nTnJIN6oOvG0` (your bot token)
4. Click **"Save Changes"**

The service will automatically redeploy.

## Step 5: Create Admin User

Once deployed, you need to create an admin user:

1. In Render dashboard, go to your **PostgreSQL database**
2. Click **"Connect"** → Copy the **External Database URL**
3. On your local machine, run:

```bash
# Set the production database URL temporarily
export DATABASE_URL="<paste-the-external-database-url>"

# Run Prisma Studio
npx prisma studio
```

4. In Prisma Studio:
   - Go to **User** model
   - Click **"Add record"**
   - Set:
     - `username`: `admin` (or your preferred username)
     - `password`: Use a bcrypt hash generator like [bcrypt-generator.com](https://bcrypt-generator.com/)
       - Enter your desired password
       - Copy the bcrypt hash
       - Paste it in the password field
   - Click **"Save 1 change"**

## Step 6: Test Your Deployment

1. **Get your app URL** from Render (e.g., `https://kzfan-app.onrender.com`)
2. **Test the frontend**: Visit the URL
3. **Test the API**: Visit `https://kzfan-app.onrender.com/api/health`
4. **Test admin login**: 
   - Click "Admin" in the header
   - Log in with your credentials
   - Try adding an event
5. **Test Telegram bot**:
   - Open Telegram
   - Search for your bot
   - Send `/start`
   - Send `/events`

## Troubleshooting

### Build Fails

Check the build logs in Render dashboard. Common issues:
- Missing environment variables
- Database connection issues
- npm install errors

### Database Connection Issues

Make sure:
- PostgreSQL database is created
- `DATABASE_URL` is set correctly in environment variables
- Database migrations ran during build (`npx prisma migrate deploy`)

### Telegram Bot Not Responding

- Verify `TELEGRAM_BOT_TOKEN` is set correctly
- Check the service logs for bot startup messages
- Make sure the bot is not running elsewhere

### App Shows "Cannot GET /"

This usually means:
- Frontend build didn't complete
- Static files aren't being served
- Check that `NODE_ENV=production` is set

## Updating Your App

After making changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

Render will automatically redeploy! 🚀

## Free Tier Limitations

Render's free tier:
- ✅ 750 hours/month (enough for 1 app running 24/7)
- ✅ Automatic HTTPS
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes ~30 seconds

For production use, consider upgrading to a paid plan.
