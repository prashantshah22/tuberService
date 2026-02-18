# Tuber Service - System Design (Code-Based)

This document is derived from the current codebase. The README files were explicitly ignored because they are not fully accurate.

## 1. Overview
Tuber Service is a microservices-based video platform. It has:
- A Next.js frontend
- An API Gateway
- Four backend services: auth, video, like, comment
- MongoDB for data persistence
- Redis for caching and view aggregation
- AWS S3 for video and thumbnail storage

### Core user flows
- Public browsing: list videos, watch a video, view likes and comments
- Authentication: signup, login, refresh token
- Creator admin: upload video, update thumbnail, delete video

## 2. High-Level Architecture
- **Frontend**: Next.js 15 App Router
- **Gateway**: Express proxy to services
- **Services**: Express + TypeScript
- **Storage**: MongoDB
- **Cache**: Redis
- **Media**: S3 (HLS playback)

## 3. Components

### 3.1 Frontend
Location: `tuber-service-frontend`

Key points:
- Uses `NEXT_PUBLIC_SERVER` for API (gateway)
- Uses `NEXT_PUBLIC_STREAMING_SERVER` for media URLs
- Auth tokens stored in cookies (`accessToken`, `refreshToken`)
- Axios interceptor attaches `X-Auth-Token`
- Admin routes guarded by middleware (`/admin`)

Pages:
- `/` - public home list
- `/videos/[slug]` - watch page
- `/login` - login
- `/signup` - signup (Google OAuth prefill)
- `/admin` - admin dashboard
- `/admin/videos` - upload/manage

### 3.2 API Gateway
Location: `tuber-service-backend/gateway`

Routes:
- `/video` -> `http://localhost:4000`
- `/auth` -> `http://localhost:4001`
- `/like` -> `http://localhost:4002`
- `/comment` -> `http://localhost:4003`

CORS:
- Allows `process.env.CLIENT` and `https://devui.rohitshahi.info.np/`

### 3.3 Auth Service
Location: `tuber-service-backend/services/auth-service`

Endpoints:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/verify-token`
- `POST /auth/populate` (server-to-server)

Tokens:
- Access token: JWT, 15 minutes
- Refresh token: UUID, 30 days

Model:
- `channelName`, `fullname`, `email`, `password`, `refreshToken`, `expiredAt`

### 3.4 Video Service
Location: `tuber-service-backend/services/video-service`

Endpoints:
- `GET /video` - list public
- `GET /video/recommended` - random 5
- `GET /video/admin` - list by user (auth)
- `GET /video/:id` - single + likes + owner
- `POST /video` - metadata + signed S3 upload URL (auth)
- `POST /video/thumbnail` - signed thumbnail upload URL (auth)
- `PUT /video/:id` - update metadata (auth)
- `DELETE /video/:id` - delete video (auth)
- `POST /video/count/views` - increment views
- `POST /video/webhook` - mark video public after encoding

Storage paths:
- Input: `videos/{uuid}.mp4`
- Output: `stream/{uuid}/{uuid}.m3u8`
- Thumbnails: `thumbnails/{uuid}.png`

Caching:
- Redis key `videos` for public list
- Redis key `{videoId}` for single video
- Redis key `{userId}` for admin list

Views:
- Redis key `video-{videoId}-views`
- Writes to DB when count exceeds 5

### 3.5 Like Service
Location: `tuber-service-backend/services/like-service`

Endpoints:
- `POST /like` - create/toggle like/dislike (auth)
- `GET /like/:videoId` - counts

Model:
- `user`, `videoId`, `status`

### 3.6 Comment Service
Location: `tuber-service-backend/services/comment-service`

Endpoints:
- `POST /comment` - create (auth)
- `GET /comment/:videoId` - list (with user populated)
- `PUT /comment/:id` - update (auth)

Model:
- `user`, `videoId`, `comment`

## 4. Inter-Service Communication
- Services call auth endpoints for:
  - Token verification
  - User population
- Auth service uses `x-server-secret` for server-to-server calls
- Base URL for service-to-service calls is `process.env.HOST`

## 5. Upload and Playback Flow

### Upload
1. Admin uploads video from UI
2. UI posts metadata to `/video`
3. Video service returns S3 signed URL
4. UI uploads file directly to S3
5. External transcoder (not in repo) generates HLS
6. Transcoder hits `/video/webhook`
7. Video marked public

### Playback
1. UI fetches `/video/:id`
2. Video service fetches likes and owner profile
3. UI plays `NEXT_PUBLIC_STREAMING_SERVER/{path}`

## 6. Configuration
Frontend (`tuber-service-frontend/.env.local`):
- `NEXT_PUBLIC_SERVER`
- `NEXT_PUBLIC_STREAMING_SERVER`
- `NEXTAUTH_SECRET`
- Google OAuth client credentials

Backend (expected but not fully documented in repo):
- `PORT`
- `DB` (Mongo URI)
- `AUTH_SECRET`
- `SERVER_SECRET`
- `S3_ACCESS_KEY`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET_NAME`
- `HOST` (service-to-service base URL)

## 7. Known Notes (from user)
- `docker-compose.yml` includes Kafka/Zookeeper but was only for development and is no longer used. Kafka code has been removed; the compose file was not updated.

## 8. Risks / Gaps
- No Docker definitions for MongoDB/Redis despite required dependencies.
- Transcoding workflow is implied but not implemented in repo.
- `video-service` axios calls rely on `HOST` env and may fail if not set.
- Refresh token endpoint is guarded by access token; refresh flow depends on access token availability.

## 9. Scaling Notes
- Services are stateless and can scale horizontally.
- Redis can be clustered for caching and view aggregation.
- MongoDB needs indexes on `video.user`, `comment.videoId`, `like.videoId`.
- S3 handles direct upload and HLS streaming at scale.
