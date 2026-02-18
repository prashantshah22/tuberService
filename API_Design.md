# API Design

The API is structured around RESTful principles. All requests are routed through the API Gateway.
**Base URL**: `http://<gateway-host>/<service-route>`

## Authentication Service
**Base Path**: `/auth`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user account. | No |
| `POST` | `/login` | Authenticate user and receive tokens. | No |
| `POST` | `/refresh-token` | specific endpoint to rotate access tokens using refresh token. | Yes (Partial) |
| `POST` | `/verify-token` | Verify if an access token is valid. | Yes |
| `POST` | `/populate` | Internal endpoint to fetch user details (Server-to-Server). | Yes (Server Secret) |

## Video Service
**Base Path**: `/video`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch a list of public videos. | No |
| `GET` | `/recommended` | Fetch recommended videos. | No |
| `GET` | `/:id` | Get details of a single video by ID. | No |
| `POST` | `/` | Create video metadata & get upload URL. | Yes |
| `PUT` | `/:id` | Update video details. | Yes |
| `DELETE` | `/:id` | Delete a video. | Yes |
| `POST` | `/thumbnail` | Get signed URL for thumbnail upload. | Yes |
| `GET` | `/admin` | Fetch all videos uploaded by the logged-in user. | Yes |
| `POST` | `/count/views` | Increment view count for a video. | No |
| `POST` | `/webhook` | Webhook for transcoder to update video status. | No (Internal/Secured) |

## Like Service
**Base Path**: `/like`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Toggle Like or Dislike status on a video. | Yes |
| `GET` | `/:videoId` | Get like/dislike counts for a video. | No |

## Comment Service
**Base Path**: `/comment`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Post a new comment. | Yes |
| `GET` | `/:videoId` | Get all comments for a specific video. | No |
| `PUT` | `/:id` | Update a specific comment. | Yes |
