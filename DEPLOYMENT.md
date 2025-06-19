# Deployment Guide

This document provides step-by-step instructions for deploying the JobTrack application to Vercel (frontend) and Render (backend). Last updated: June 2025.

## Prerequisites

1. GitHub account
2. Vercel account
3. Render account
4. MongoDB Atlas account

## Backend Deployment (Render)

### Method 1: Using Blueprint (Recommended)

1. Create a MongoDB Atlas cluster:
   - Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is sufficient for basic use)
   - Create a database user with read/write privileges
   - Under "Network Access", add an IP address of 0.0.0.0/0 to allow access from anywhere
   - Copy your MongoDB connection string

2. Deploy using Render Blueprint:
   - Fork this repository to your GitHub account
   - Sign up or log in to [Render](https://render.com/)
   - From the Render dashboard, click "New" and select "Blueprint"
   - Connect your forked GitHub repository
   - Enter a Blueprint Name (e.g., "JobTrack App")
   - Configure the required environment variables:
     ```
     JWT_SECRET=your_secret_key_here
     MONGODB_URI=your_mongodb_connection_string
     CLIENT_URL=https://your-frontend-url.vercel.app
     ADMIN_INVITE_SECRET=your_strong_admin_secret_key_here
     ```
   - Click "Apply" to deploy the backend using the render.yaml configuration

### Method 2: Manual Setup

1. Create a MongoDB Atlas cluster (same as above)

2. Deploy the backend to Render manually:
   - Sign up or log in to [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `jobtrack-api`
     - Runtime: `Node`
     - Region: Choose the closest to your users
     - Branch: `main` (or your default branch)
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && node server.js`
   - Add environment variables:
     ```
     PORT=10000
     NODE_ENV=production
     JWT_SECRET=your_secret_key_here
     MONGODB_URI=your_mongodb_connection_string
     CLIENT_URL=https://your-frontend-url.vercel.app
     ADMIN_INVITE_SECRET=your_strong_admin_secret_key_here
     ```
   - Under "Advanced" settings, add a Health Check Path: `/api/health`
   - Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Deploy the frontend to Vercel:
   - Sign up or log in to [Vercel](https://vercel.com/)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: `Create React App`
     - Root Directory: `client`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy"

2. After deployment:
   - Go to Settings > Environment Variables and verify your environment variables are set correctly
   - If needed, trigger a redeploy from the Deployments tab to ensure the latest environment variables are used

## Connecting Frontend and Backend

1. Update the `CLIENT_URL` in your backend environment variables on Render to match your Vercel deployment URL:
   - Go to your Render dashboard > select your web service
   - Go to "Environment" tab
   - Update the `CLIENT_URL` variable to your Vercel URL (e.g., `https://jobtrack-app.vercel.app`)
   - Click "Save Changes" and wait for the service to redeploy

2. Update the `REACT_APP_API_URL` in your frontend environment variables on Vercel:
   - Go to your Vercel project dashboard
   - Go to "Settings" > "Environment Variables"
   - Update the `REACT_APP_API_URL` to your Render URL with `/api` appended (e.g., `https://jobtrack-api.onrender.com/api`)
   - Redeploy your frontend application

## Testing the Deployment

1. Navigate to your deployed frontend URL
2. Test registration and login functionality
3. Test creating, updating, and deleting job applications
4. Verify that real-time notifications work properly
5. Test the admin functionality if applicable

## Troubleshooting

### CORS Issues
- If you encounter CORS errors, verify the `CLIENT_URL` in your backend environment variables exactly matches your frontend URL
- Check the browser console for detailed error messages

### Connection Issues
- If the frontend cannot connect to the backend, ensure your environment variables are set correctly
- Check that your backend service is running (check Render dashboard)
- For Socket.io connection issues, check that the backend URL is correct in the frontend code

### Database Issues
- For MongoDB connection issues, ensure your MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check your MongoDB user has the correct permissions
- Verify your connection string is correct and includes database name, username and password

### Performance Issues
- If your Render free tier service is slow to respond after periods of inactivity, this is normal ("spin-up" delay)
- Consider upgrading to a paid tier for production use

## Common Deployment Errors and Solutions

### Error: "No such file or directory, stat '/opt/render/project/src/client/build/index.html'"

This error occurs because the server is trying to serve the frontend static files, but the client build directory doesn't exist on Render.

**Solution:**
- This application is designed with separate deployments for frontend and backend
- The backend server.js has been updated to handle this case and no longer attempts to serve frontend files
- Make sure you're deploying the frontend separately to Vercel

### Error: "Environment Variable 'REACT_APP_API_URL' references Secret, which does not exist"

This error occurs when you try to use a secret reference in Vercel instead of directly setting the environment variable.

**Solution:**
1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add a new variable with:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-render-app-name.onrender.com/api` (replace with your actual Render URL)
   - Do NOT use the secret reference syntax (e.g., `@react_app_api_url`)
4. Make sure to select the environments where this should apply (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application

## Monitoring and Maintenance

- Use Render's built-in logs and metrics to monitor backend performance
- Set up automatic database backups in MongoDB Atlas
- Consider setting up logging with a service like Sentry or LogRocket for more comprehensive monitoring
- Set up Render health checks to ensure your service remains available

## CI/CD Setup

Both Vercel and Render support continuous deployment from your GitHub repository.

### Vercel CI/CD
- By default, Vercel will automatically deploy when you push changes to your repository
- You can configure branch deployments in the Vercel dashboard under "Settings" > "Git"
- Set up preview deployments for pull requests to test changes before merging to main

### Render CI/CD
- Render can automatically deploy when changes are pushed to your repository
- Configure auto-deploy settings in the Render dashboard under your web service
- You can set up services to deploy only when specific paths change (e.g., changes in the server directory)

## Security Best Practices

1. **Environment Variables**:
   - Never commit sensitive environment variables to your repository
   - Use Render's and Vercel's environment variables features
   - For local development, use .env files that are gitignored

2. **JWT Security**:
   - Use a strong, random JWT secret
   - Set appropriate token expiration times
   - Consider implementing token refresh mechanisms

3. **Database Security**:
   - Use strong, unique passwords for your MongoDB Atlas database
   - Regularly rotate database credentials
   - Only grant necessary permissions to database users

4. **Regular Updates**:
   - Keep all dependencies updated to patch security vulnerabilities
   - Set up Dependabot or similar tools to automatically create PRs for dependency updates

## Scaling Considerations

As your application grows, consider these scaling options:

1. **Database Scaling**:
   - MongoDB Atlas offers various tiers for increased performance
   - Consider implementing database indexing for frequently queried fields

2. **Backend Scaling**:
   - Upgrade your Render plan for increased performance
   - Consider splitting your backend into microservices if appropriate

3. **Frontend Optimizations**:
   - Implement code splitting and lazy loading
   - Consider using a CDN for static assets
   - Optimize images and assets
   
4. **Monitoring and Analytics**:
   - Set up application performance monitoring
   - Implement analytics to understand user behavior and identify bottlenecks
