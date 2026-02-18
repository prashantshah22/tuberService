# Database Design

The system uses **MongoDB** as the primary datastore. Although it is a NoSQL database, the application enforces a structured schema using **Mongoose**.

## Schemas

### 1. Auth (User) Service
**Collection**: `auths`

| Field | Type | Required | Unique | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Yes | Auto-generated ID. |
| `channelName` | String | Yes | Yes | Unique identifier for the user's channel. |
| `fullname` | String | Yes | No | User's display name. |
| `email` | String | Yes | Yes | Register email address. |
| `password` | String | Yes | No | Bcrypt hashed password. |
| `refreshToken` | String | No | Yes | UUID for session management. |
| `expiredAt` | Date | No | No | Expiration for refresh token (Default: 30 days). |
| `createdAt` | Date | - | - | Timestamp. |
| `updatedAt` | Date | - | - | Timestamp. |

### 2. Video Service
**Collection**: `videos`

| Field | Type | Required | Ref | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | - | Auto-generated ID. |
| `user` | ObjectId | Yes | Auth | The creator/owner of the video. |
| `title` | String | Yes | - | Video title. |
| `description` | String | Yes | - | Video description. |
| `thumbnail` | String | No | - | URL/Path to thumbnail. |
| `duration` | Number | Yes | - | Duration in seconds. |
| `size` | Number | Yes | - | File size in bytes. |
| `path` | String | Yes | - | S3 Path/Key for the video file. |
| `views` | Number | No | - | View counter (Default: 0). |
| `status` | String | Yes | - | Enum: `private`, `public`. |
| `createdAt` | Date | - | - | Timestamp. |
| `updatedAt` | Date | - | - | Timestamp. |

### 3. Like Service
**Collection**: `likes`

| Field | Type | Required | Ref | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | - | Auto-generated ID. |
| `user` | ObjectId | Yes | Auth | User who performed the action. |
| `videoId` | ObjectId | Yes | Video | Target video. |
| `status` | String | Yes | - | Enum: `Like`, `Dislike`. |
| `createdAt` | Date | - | - | Timestamp. |
| `updatedAt` | Date | - | - | Timestamp. |

### 4. Comment Service
**Collection**: `comments`

| Field | Type | Required | Ref | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | - | Auto-generated ID. |
| `user` | ObjectId | Yes | Auth | User who commented. |
| `videoId` | ObjectId | Yes | Video | Target video. |
| `comment` | String | Yes | - | The comment text. |
| `createdAt` | Date | - | - | Timestamp. |
| `updatedAt` | Date | - | - | Timestamp. |

## Relationships
*   **One-to-Many**: `Auth` (User) -> `Video` (One user can upload multiple videos).
*   **One-to-Many**: `Video` -> `Comment` (One video can have multiple comments).
*   **One-to-Many**: `Video` -> `Like` (One video can have multiple likes).
*   **Many-to-One**: `Comment`/`Like` -> `Auth` (Comments and likes belong to a user).
