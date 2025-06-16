# Job Application Tracker

A full-stack web application for tracking job applications with user authentication, real-time notifications, and comprehensive job application management.

## Features

### User Authentication
- JWT-based authentication
- User roles: Applicant and Admin

### Job Application Management
- Create, read, update, and delete job entries
- Track company name, job title, application status, applied date, and notes
- Status tracking: Applied, Interview, Offer, Rejected, Accepted

### List View
- View all job applications
- Filter applications by status
- Sort by applied date (ascending/descending)

### UI Features
- Responsive design for mobile and desktop
- Client-side form validation
- Card or table view for job listings

### Real-time Features
- On-panel notifications for job status updates
- Optional email notification system

## Technology Stack

### Frontend
- React.js
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Socket.io client for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time communication
- Nodemailer for email notifications (optional)

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Installation and Setup

### Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- MongoDB (local or Atlas connection string)

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the client directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Register a new account or login with existing credentials
2. Add new job applications via the "Add Job" form
3. View and manage your job applications in the dashboard
4. Update application status as you progress through the hiring process
5. Use filters and sorting to organize your job search
6. Receive real-time notifications when application statuses change

## Deployment Instructions

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy from the main branch

### Backend (Render)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Configure environment variables

## License
MIT
