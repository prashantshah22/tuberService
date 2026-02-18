# Tuber Service - Scalable Video Streaming Platform

Welcome to the **Tuber Service** repository! This project is a robust, microservices-based video streaming platform inspired by YouTube, built to demonstrate modern backend architecture, scalability, and cloud integration.

## 📚 Documentation & Architecture

For a deep dive into specific aspects of the system, please refer to the documentation below:

| Document | Description |
| :--- | :--- |
| **[System Architecture](system_Architecture.md)** | High-level overview of the microservices, data flow, and component diagrams. |
| **[Tech Stack](techstack.md)** | Detailed list of technologies used in Frontend, Backend, Database, and DevOps. |
| **[Functionalities](Functionilities.md)** | Comprehensive list of user and admin features (Upload, Playback, Auth, etc.). |
| **[Database Design](Database_Design.md)** | MongoDB schema definitions and data relationships. |
| **[API Design](API_Design.md)** | RESTful API endpoints, request/response structures, and authentication requirements. |
| **[Concurrency & Data](Concurrency%20&%20Data%20Integrity.md)** | How the system handles concurrent requests, data integrity, and atomic operations. |
| **[Security Architecture](Security.md)** | details on JWT authentication, secure S3 uploads, and network security. |
| **[Future Plans](Plan.md)** | Roadmap for future enhancements and features. |

## 🚀 Key Highlights

*   **Microservices Architecture**: Independently scalable services for Auth, Video, Likes, and Comments, orchestrated via an API Gateway.
*   **Scalable Media Handling**: Direct-to-S3 uploads using pre-signed URLs to offload heavy traffic from the backend.
*   **Adaptive Streaming**: HLS (HTTP Live Streaming) support for smooth playback across different network conditions.
*   **Modern Frontend**: Built with **Next.js 15**, **React 19**, and **Tailwind CSS** for a responsive and performant user experience.
*   **Event-Driven**: Asynchronous processing pipeline for video transcoding (simulated via webhooks).

## 🛠️ Quick Start

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Redis
*   AWS S3 Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd tuberservice
    ```

2.  **Install Dependencies**
    ```bash
    # Backend
    cd tuber-service-backend
    npm install
    
    # Frontend
    cd ../tuber-service-frontend
    npm install
    ```

3.  **Environment Setup**
    *   Create `.env` files in `tuber-service-backend` and `tuber-service-frontend` based on the provided examples.

4.  **Run the Application**
    ```bash
    # Start Backend Services
    cd tuber-service-backend && npm start
    
    # Start Frontend
    cd tuber-service-frontend && npm run dev
    ```
