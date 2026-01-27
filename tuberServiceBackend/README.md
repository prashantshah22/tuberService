# 🚀 Tuber Service - Backend

A robust, scalable microservices-based backend for a video streaming platform, built with Node.js, Express, and TypeScript.

## 🏗 Architecture

The system follows a Microservices Architecture pattern, orchestrated via an API Gateway.

### Core Services
- **Gateway**: Single entry point for all client requests, routing them to appropriate microservices.
- **Auth Service**: Manages user authentication, registration, and sessions.
- **Video Service**: Handles video uploads, streaming logic, metadata, and cloud storage (AWS S3).
- **Like Service**: Manages likes/dislikes on videos.
- **Comment Service**: Handles user comments on videos.

### Infrastructure & Messaging
- **Redis**: Caching and background job queues (BullMQ).
- **MongoDB**: Primary database for storing application data.
- **AWS S3**: Object storage for video files and assets.

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Validation**: `class-validator` & `class-transformer`
- **Database**: [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Message Broker**: [Apache Kafka](https://kafka.apache.org/)
- **Queue**: [BullMQ](https://docs.bullmq.io/) (Redis)
- **Storage**: AWS S3

## 📋 Prerequisites

Ensure you have the following installed locally:
- **Node.js** (v18+ recommended)
- **Docker** & **Docker Compose** (for Kafka/Zookeeper)
- **MongoDB** (Local or Atlas URI)
- **Redis** (Local or Cloud)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/prashantshah22/tuber-service-backend.git
cd tuber-service-backend
```

### 2. Infrastructure Setup (Kafka)
Start the required infrastructure services (Kafka & Zookeeper) using Docker Compose:
```bash
docker-compose up -d
```

### 3. Environment Configuration
Each service requires its own `.env` file. Navigate to each service directory (`services/*` and `gateway/`) and create a `.env` file based on the required variables.

**Common Variables (Example):**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-db
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket
```

### 4. Install Dependencies
Install dependencies for the root workspace and all services:
```bash
npm install
# Or if you need to install inside each service manually:
# cd services/video-service && npm install
```

### 5. Running the Application
You can start all services simultaneously from the root directory using the simplified command:
```bash
npm start
```
*This uses `concurrently` to launch the Gateway and all microservices.*

## 🧪 Development

### Creating a New Service
Use the included pipeline script to scaffold a new microservice:
```bash
npm run create-service
```

## 📂 Project Structure

```
tuber-service-backend/
├── gateway/             # API Gateway
├── pipeline/            # Service generation scripts
├── services/            # Microservices logic
│   ├── auth-service/
│   ├── comment-service/
│   ├── like-service/
│   └── video-service/
├── docker-compose.yml   # Kafka/Zookeeper config
└── package.json         # Root scripts
```

## 🤝 Contribution

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
