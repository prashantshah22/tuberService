# Functionalities

## 1. User Authentication & Profile
*   **Sign Up**: Users can create a new account with Channel Name, Full Name, Email, and Password.
*   **Login**: Secure login using Email and Password.
*   **Token Management**: 
    *   Access Token (Short-lived, JWT)
    *   Refresh Token (Long-lived, UUID)
    *   Silent token refresh mechanism.

## 2. Video Management (Creators/Admin)
*   **Upload Video**: 
    *   Metadata creation (Title, Description).
    *   Direct-to-cloud upload (S3) via Pre-signed URLs.
*   **Update Video**: Edit video details (Title, Description).
*   **Delete Video**: Remove videos from the platform.
*   **Upload Thumbnail**: Custom thumbnail upload support.
*   **View Statistics**: Track view counts for uploaded videos.
*   **Dashboard**: Admin interface to manage own uploaded content.

## 3. Video Playback & Discovery
*   **Home Feed**: Browse a list of latest public videos.
*   **Recommended Feed**: Get a list of recommended videos.
*   **Watch Page**: 
    *   Adaptive Bitrate Streaming (HLS).
    *   Video Player with quality selection.
    *   View count display.
    *   Channel details display.

## 4. User Engagement
*   **Likes/Dislikes**: 
    *   Toggle Like or Dislike on videos.
    *   View total like/dislike counts.
    *   Real-time status reflection.
*   **Comments**: 
    *   Post comments on videos.
    *   View list of comments for a video.
    *   Update existing comments.

## 5. System Features
*   **Video Processing Pipeline**:
    *   Asynchronous video processing.
    *   Webhook integration for "Ready to Watch" status updates.
*   **Security**:
    *   Protected API routes via Middleware Guards.
    *   Server-to-Server communication protection (`ServerGuardMiddleware`).
