# KeepCode - Google Authentication Setup Guide

This document provides step-by-step instructions for setting up Google OAuth 2.0 authentication for the KeepCode application.

## Overview

We will implement Google Sign-In using OAuth 2.0. This allows users to authenticate with their Google accounts and have their own separate notes.

## Architecture After Auth Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Login Page  │  │  Google Auth │  │  Authenticated App   │   │
│  │  (New)       │  │  Popup/Flow  │  │  (Current App.tsx)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                           │                                      │
│                    JWT Token (Stored in                          │
│                    localStorage/cookie)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ API Requests (with JWT)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js/Express)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Auth Routes │  │  JWT Verify  │  │  Protected Routes    │   │
│  │  /auth/*     │  │  Middleware  │  │  /api/notes/*        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select **"New Project"**
3. Enter a project name: `KeepCode`
4. Click **"Create"**

### 1.2 Configure OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services" > "OAuth consent screen"**
2. Select **"External"** (for testing with any Google account) or **"Internal"** (if using Google Workspace)
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: `KeepCode`
   - **User support email**: Your email
   - **App logo** (optional): Upload your app logo
   - **App domain**: 
     - Application home page: `http://localhost:5173` (for development)
     - Authorized domains: `localhost`
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Add or Remove Scopes"**
   - Select: `openid`, `email`, `profile`
   - Click **"Update"** then **"Save and Continue"**
7. On the **Test Users** page, add your email as a test user
8. Click **"Save and Continue"** then **"Back to Dashboard"**

### 1.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Select Application type: **"Web application"**
4. Configure the OAuth client:
   - **Name**: `KeepCode Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (Vite dev server)
     - `http://localhost:3000` (Alternative)
     - Add production URL when deployed (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/auth/google/callback` (Backend callback URL)
     - Add production callback when deployed
5. Click **"Create"**
6. **IMPORTANT**: You will see a popup with your credentials:
   - **Client ID** (looks like: `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`)
   
   ⚠️ **Copy both values immediately** - the Client Secret will only be shown once!

---

## Step 2: Where to Add Your Credentials

After obtaining your Google OAuth credentials, you need to add them to the following files:

### 2.1 Server-side Environment Variables

Create or update the file: `server/.env`

```env
# Server Configuration
PORT=5000

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

# JWT Secret (Generate a random string for signing tokens)
# You can generate one by running: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_random_jwt_secret_key_here

# Frontend URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173
```

### 2.2 Client-side Environment Variables

Create or update the file: `client/.env`

```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Google OAuth Client ID (same as server, but only the client ID)
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

---

## Step 3: After Adding Credentials - Call Kimi to Implement Auth

Once you have:
1. ✅ Created the Google Cloud Project
2. ✅ Set up the OAuth consent screen
3. ✅ Created OAuth 2.0 credentials
4. ✅ Added `GOOGLE_CLIENT_ID` to `client/.env`
5. ✅ Added `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `JWT_SECRET` to `server/.env`

**Call Kimi and say:**

> "I've set up Google Auth and added the credentials to the .env files. Please implement the authentication system with:
> 1. Backend routes for Google OAuth (/auth/google, /auth/google/callback, /auth/logout)
> 2. JWT middleware for protecting API routes
> 3. Frontend login page with Google Sign-In button
> 4. Auth context for managing user state
> 5. Update notes API to be user-specific (each user sees only their notes)"

---

## Step 4: Required NPM Packages (Kimi will install)

### Server Packages:
```bash
cd server
npm install passport passport-google-oauth20 passport-jwt jsonwebtoken express-session
npm install --save-dev @types/passport @types/passport-google-oauth20 @types/passport-jwt
```

### Client Packages:
```bash
cd client
npm install @react-oauth/google jwt-decode
npm install --save-dev @types/jwt-decode
```

---

## Step 5: Database Schema Changes (Kimi will implement)

The notes database will be updated to include a `userId` field:

```javascript
// notes.db schema update
{
  "_id": "...",
  "userId": "google_user_id_here",  // NEW FIELD
  "title": "Note Title",
  "content": {...},
  "isPinned": false,
  "isArchived": false,
  "isTrashed": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

New user collection will be added:
```javascript
// users.db
{
  "_id": "...",
  "googleId": "google_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "createdAt": "..."
}
```

---

## Step 6: API Changes Summary

### Protected Routes (will require JWT token):
- `GET /api/notes` - Fetch user's notes
- `POST /api/notes` - Create note for user
- `PUT /api/notes/:id` - Update user's note
- `DELETE /api/notes/:id` - Delete user's note
- `POST /api/upload` - Upload image (user-specific folder)

### New Auth Routes:
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

---

## Security Notes

1. **Never commit `.env` files to Git** - They contain sensitive credentials
2. **JWT Secret** should be a long, random string (minimum 32 characters)
3. **Client Secret** should only be used server-side, never exposed in frontend code
4. **CORS** will be configured to only accept requests from your frontend URL
5. **Cookie/Token Security**:
   - HTTPOnly cookies recommended for production
   - Secure flag for HTTPS
   - SameSite attribute to prevent CSRF

---

## Testing Checklist

After Kimi implements the auth:

- [ ] Can click "Sign in with Google" button
- [ ] Google OAuth popup opens correctly
- [ ] After granting permission, user is logged in
- [ ] User's profile picture and name appear in UI
- [ ] Creating a note associates it with the logged-in user
- [ ] User can only see their own notes
- [ ] Different Google accounts see different notes
- [ ] Logout works correctly
- [ ] Trying to access notes without login redirects to login page

---

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console matches exactly
- Check for trailing slashes, http vs https, etc.

### "Invalid Client"
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Ensure no extra spaces in .env file

### CORS Errors
- Make sure CLIENT_URL in server .env matches your frontend URL exactly

### JWT Errors
- Ensure JWT_SECRET is set and consistent
- Check that Authorization header is being sent with requests

---

## Production Deployment

When deploying to production:

1. Add production URLs to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://your-api-domain.com/auth/google/callback`

2. Update environment variables:
   - `server/.env`: `CLIENT_URL=https://yourdomain.com`
   - `client/.env`: `VITE_API_URL=https://your-api-domain.com`

3. Set `NODE_ENV=production` in server

4. Use secure, HTTPOnly cookies instead of localStorage for JWT tokens

---

## Files That Will Be Modified/Created

### New Files:
- `server/routes/auth.js` - Auth routes
- `server/middleware/auth.js` - JWT verification middleware
- `server/models/user.js` - User model
- `client/src/pages/Login.tsx` - Login page
- `client/src/context/AuthContext.tsx` - Auth state management
- `client/src/components/ProtectedRoute.tsx` - Route protection

### Modified Files:
- `server/index.js` - Add auth routes and middleware
- `server/routes/notes.js` - Add user-specific filtering
- `client/src/App.tsx` - Add auth routing
- `client/src/components/Header.tsx` - Add user profile menu
- `client/src/main.tsx` - Wrap with AuthProvider and GoogleOAuthProvider

---

**Last Updated**: 2026-02-03  
**Next Step**: Add credentials to .env files and call Kimi to implement!
