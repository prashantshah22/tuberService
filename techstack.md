# Tech Stack

## Frontend (Client)
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Library**: React 19
*   **Styling**: 
    *   [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS)
    *   [Ant Design](https://ant.design/) (UI Component Library)
*   **State Management & Data Fetching**: 
    *   [SWR](https://swr.vercel.app/) (Stale-While-Revalidate)
    *   React Hooks
*   **Authentication**: NextAuth.js (Custom provider implied)
*   **Media Player**: Video.js (with HLS quality selector)
*   **HTTP Client**: Axios
*   **Utilities**: `universal-cookie`, `animate.css`

## Backend (Server)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Language**: TypeScript
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Architecture**: Microservices
*   **API Gateway**: Express with `http-proxy-middleware`
*   **Process Management**: `concurrently` (for local development)

### core Libraries
*   **Validation**: `class-validator`, `class-transformer`
*   **Security**: `bcrypt` (Hashing), `jsonwebtoken` (JWT), `cors`
*   **Database ODM**: [Mongoose](https://mongoosejs.com/)
*   **Utilities**: `moment` (Date/Time), `uuid` (ID generation), `dotenv`

## Database & Storage
*   **Primary Database**: [MongoDB](https://www.mongodb.com/) (Document Store)
*   **Object Storage**: [AWS S3](https://aws.amazon.com/s3/) (Video files, Thumbnails, HLS playlists)

## Infrastructure & Tools
*   **Version Control**: Git
*   **Package Manager**: NPM
*   **External APIs**: AWS SDK (S3 integration)
