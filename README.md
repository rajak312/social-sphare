## SocialSphere

SocialSphere is a dynamic social media application built with React and TypeScript, leveraging Firebase and Supabase for backend services. It offers users the ability to create profiles, share posts, upload media, and interact seamlessly within a secure and responsive environment.
Table of Contents

    Features
    Technology Stack
    Directory Structure
    Installation
    Usage
    Deployment
    Contributing
    License

## Features

    User Authentication: Secure login with Google OAuth.
    Profile Management: Edit and update user profiles with profile pictures.
    Post Creation: Create, edit, and delete posts with text and media uploads.
    Real-time Feed: View a live feed of posts from all users.
    Responsive Design: Optimized for various devices and screen sizes.
    File Uploads: Upload images and videos seamlessly.
    Interactive UI Components: Reusable components like buttons, cards, and popups.

## Technology Stack

    Frontend: React, TypeScript, Vite
    State Management: Redux Toolkit
    Authentication & Backend: Firebase, Supabase
    Styling: CSS, SVG Assets
    Deployment: Vercel

## Installation

To get started with SocialSphere locally, follow these steps:

    Clone the Repository

git clone https://github.com/yourusername/socialsphere.git
cd socialsphere

Install Dependencies

Ensure you have Node.js installed. Then, install the necessary dependencies:

npm install

Configure Environment Variables

Create a .env file in the root directory and add the required environment variables for Firebase and Supabase. Example:

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

## Run the Project

Start the development server:

    npm run dev

    The application will be available at http://localhost:5173 (or another port if specified).

## Usage

Once the development server is running:

    Access the Application

    Open your browser and navigate to http://localhost:5173.

    Authentication
        Click on the Login button.
        Choose to sign in with Google using the GoogleLogin component.

    Navigating the App
        Home: View the feed of posts from all users.
        Profile: Access and edit your profile information.
        Create Post: Use the FileUpload component to add new posts with media.
        Camera: Capture photos directly within the app.

    Managing Posts
        AddUser: Add new users to the platform.
        EditButton: Modify existing posts.
        BackButton: Navigate back to previous pages.
        SharePopup: Share posts with other users.

## Deployment

SocialSphere is deployed on Vercel and can be accessed live at https://socialsphare.vercel.app/.