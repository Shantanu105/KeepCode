# KeepCode - Project Description

## Overview
KeepCode is a Google Keep alike note taking app tailored for developers, emphasizing code syntax highlighting and a clean, masonry-style layout. It provides a familiar note-taking experience with added capabilities for storing and viewing code snippets effectively.

## Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) with a custom dark/light theme system.
- **State Management:** Local Component State (useState, useEffect).
- **Editor:** Tiptap (Headless wrapper for ProseMirror)
  - `extension-code-block-lowlight`: For syntax highlighting using `lowlight`.
  - `extension-image`: For image support.
  - `extension-placeholder`: For "Take a note..." placeholder.
- **Layout:** `react-masonry-css` for the dashboard grid.
- **Icons:** `react-icons` (Material Design & FontAwesome).

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** NeDB (Lightweight, file-based MongoDB-compatible database).
- **File Handling:** Multer (for handling image uploads to local storage).

## Key Features

### 1. Note Management
- **CRUD Operations:** Create, Read, Update, and Delete notes.
- **Organization:** 
  - **Pinning:** Pin important notes to the top.
  - **Archive:** Move notes out of the main view without deleting them.
  - **Trash:** Soft delete notes (functionality to permanently delete exists).
- **Search:** Real-time filtering by title and content.

### 2. Rich Text Editor (Tiptap)
- **Formatting:** H1, H2, Bold, Italic, Underline.
- **Code Blocks:** Specialized code blocks with syntax highlighting and a "Copy" button.
- **Images:** Upload and embed images directly into notes.
- **Dynamic Input:** The editor creates a seamless "Title + Content" input flow similar to Google Keep.

### 3. UI/UX
- **Theme:** Toggles between Dark Mode and Light Mode (persisted in localStorage).
- **Layout:** Responsive Masonry grid that adjusts column count based on screen width.
- **Sidebar:** Collapsible sidebar for navigation (Notes, Archive, Trash).

## API Endpoints
- `GET /api/notes`: Fetch notes (supports filtering by `isArchived` and `isTrashed`).
- `POST /api/notes`: Create a new note.
- `PUT /api/notes/:id`: Update an existing note.
- `DELETE /api/notes/:id`: Permanently delete a note.
- `POST /api/upload`: Upload an image file.

## Project Structure
- **client/**: React frontend application.
- **server/**: Node.js backend server.
  - `data/`: Stores the NeDB database file (`notes.db`).
  - `uploads/`: Stores uploaded images.
