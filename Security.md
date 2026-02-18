# Security Architecture

## 1. Authentication & Authorization

### JWT (JSON Web Tokens)
*   **Mechanism**: The system uses JWTs for stateless authentication.
*   **Access Token**: Short-lived (15 minutes). Used to authorize API requests.
*   **Refresh Token**: Long-lived (30 days/UUID). Used to obtain new access tokens without user re-login. stored securely in the database.

### Middleware Guards
*   **AuthGuard**: Verifies the presence and validity of the Access Token in the `Authorization` header. Decodes the user payload and attaches it to the request object.
*   **ServiceGuard / ServerGuard**: Protects inter-service communication. Specific endpoints (like `/populate`) require a private `x-server-secret` key to ensure they can only be called by trusted internal services, not external clients.

## 2. Network Security

### API Gateway
*   **Single Entry Point**: All external traffic must pass through the Gateway. This hides the internal topology of the microservices (ports 4000-4003 are not exposed directly).
*   **CORS (Cross-Origin Resource Sharing)**: Configured to allow requests only from trusted client origins (e.g., the Next.js frontend).

### Data Transport
*   **HTTPS**: In production, all traffic should be encrypted via SSL/TLS (implied requirement for secure cookie handling and S3 signed URLs).

## 3. Data Protection

### Password Security
*   **Hashing**: User passwords are never stored in plain text.
*   **Bcrypt**: Uses `bcrypt` with a salt round of 12 to hash passwords before saving to the DB.

### Secure Uploads
*   **Pre-signed URLs**: Clients upload directly to S3 using time-limited pre-signed URLs. This ensures:
    *   The backend never handles large file streams (preventing DoS).
    *   Only authenticated users with valid intent can upload files.

## 4. Input Sanitization
*   **DTO Validation**: Strict validation logic (`class-validator`) prevents Injection attacks by rejecting malformed payloads.
*   **ORM Security**: Using Mongoose helps prevent standard SQL Injection attacks (though NoSQL injection is still a consideration handled by sanitizing inputs).
