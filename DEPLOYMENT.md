# Deployment Guide

This document provides step-by-step instructions for deploying the JobTrack application to Vercel (frontend) and Render (backend).

## Prerequisites

1. GitHub account
2. Vercel account
3. Render account
4. MongoDB Atlas account

## Backend Deployment (Render)

1. Create a MongoDB Atlas cluster:
   - Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is sufficient for basic use)
   - Create a database user with read/write privileges
   - Under "Network Access", add an IP address of 0.0.0.0/0 to allow access from anywhere
   - Copy your MongoDB connection string

2. Deploy the backend to Render:
   - Sign up or log in to [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `jobtrack-api`
     - Runtime: `Node`
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
   - Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Deploy the frontend to Vercel:
   - Sign up or log in to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: `Create React App`
     - Root Directory: `client`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy"

2. After deployment, go to Settings > Environment Variables and verify your environment variables are set correctly.

## Connecting Frontend and Backend

1. Update the `CLIENT_URL` in your backend environment variables on Render to match your Vercel deployment URL.
2. Update the `REACT_APP_API_URL` in your frontend environment variables on Vercel to match your Render deployment URL.

## Testing the Deployment

1. Navigate to your deployed frontend URL
2. Test registration and login functionality
3. Test creating, updating, and deleting job applications
4. Verify that real-time notifications work properly

## Troubleshooting

- If the frontend cannot connect to the backend, check that your environment variables are set correctly
- If you encounter CORS errors, verify that your backend is correctly configured to accept requests from your frontend domain
- Check Render logs for any backend errors
- For MongoDB connection issues, ensure your MongoDB Atlas IP whitelist includes 0.0.0.0/0

## Monitoring

- Use Render's built-in logs and metrics to monitor backend performance
- Consider setting up logging with a service like Sentry or LogRocket for more comprehensive monitoring
