# Deployment Guide for Render

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database (MongoDB Atlas recommended)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Environment Variables

### Backend Environment Variables (set in Render dashboard)

1. Go to your backend service in Render dashboard
2. Navigate to Environment tab
3. Add these variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend Environment Variables (set in Render dashboard)

1. Go to your frontend service in Render dashboard
2. Navigate to Environment tab
3. Add this variable:

```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

## Deployment Steps

1. **Push your code to Git repository**
2. **Connect your repository to Render**
3. **Create two services using the render.yaml file**:
   - Backend service (Node.js)
   - Frontend service (Static Site)

## render.yaml Configuration

The `render.yaml` file in this project configures:

- **Backend Service**: Node.js API server
- **Frontend Service**: React static site
- **Environment Variables**: Basic configuration
- **Health Checks**: API endpoint for monitoring

## Important Notes

1. **MongoDB URI**: You must set your MongoDB connection string in the backend environment variables
2. **CORS**: The backend is configured to allow requests from the frontend domain
3. **API URLs**: The frontend will automatically use the correct API URL based on environment

## Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **API Connection Issues**: Verify the VITE_API_URL is correct
3. **Database Connection**: Ensure MongoDB URI is properly formatted
4. **CORS Errors**: Check that the backend allows requests from your frontend domain

## Local Development

For local development, create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:4000
```

## Services URLs

After deployment, you'll have:
- Frontend: `https://your-frontend-service.onrender.com`
- Backend: `https://your-backend-service.onrender.com` 