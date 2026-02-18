# Concurrency & Data Integrity

## Concurrency Control

### 1. Stateless Services
All microservices (`Auth`, `Video`, `Like`, `Comment`) are designed to be **stateless**. This allows:
*   **Horizontal Scaling**: Multiple instances of any service can run simultaneously.
*   **Load Balancing**: Traffic can be distributed across instances without worrying about session affinity (Sticky Sessions), as state is managed explicitly via tokens and database persistence.

### 2. Database Level
*   **MongoDB Locking**: MongoDB handles document-level locking automatically for atomic updates.
*   **Atomic Operations**: Operations like incrementing view counts (`$inc`) are atomic, ensuring that concurrent read/writes do not result in lost updates.

### 3. Asynchronous Processing
*   **Video Processing**: The transcoding pipeline is decoupled from the user upload flow.
    *   User uploads to S3 -> S3 triggers event/webhook -> Video Service updates status.
    *   This prevents long-running HTTP requests and allows the system to handle multiple uploads concurrently without blocking the main thread.

## Data Integrity

### 1. Schema Validation
**Mongoose Schemas** enforce data structure at the application level before it reaches the database:
*   **Type Checking**: Ensures fields like `views` are numbers and `channelName` is a string.
*   **Required Fields**: Prevents incomplete records (e.g., a video must have a title and owner).
*   **Enums**: Restricts values for status fields (e.g., Video Status must be `public` or `private`).

### 2. Validation DTOs (Data Transfer Objects)
The backend uses `class-validator` and `class-transformer` middleware:
*   Incoming API requests are validated against DTO classes.
*   Invalid requests are rejected with `400 Bad Request` before reaching the business logic/controller, protecting the database from corrupt data.

### 3. Referential Integrity (Soft)
*   Services store references (`ObjectId`) to related documents (e.g., `Video` stores `user: ObjectId`).
*   While MongoDB does not enforce foreign keys like SQL, the application logic ensures these links are valid during creation.
*   The `Auth Service`'s `/populate` endpoint ensures that when fetching resources (like comments), the latest user profile data is fetched dynamically.
