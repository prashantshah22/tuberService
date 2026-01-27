# 📺 Tuber Service - Frontend

A modern, responsive video streaming interface built with Next.js 15, TypeScript, and Ant Design.

## ✨ Features

- **Modern Tech Stack**: Built on Next.js 15 (App Router) for hybrid rendering and optimal performance.
- **Video Playback**: Custom video player integration using `video.js` with HLS support and quality selection.
- **User Authentication**: Secure login and signup flows powered by `next-auth`.
- **Responsive UI**: Polished interface using functional CSS (Tailwind) and enterprise-grade components (Ant Design).
- **Type Safety**: Fully typed with TypeScript for robust development.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Ant Design](https://ant.design/)
- **State Management & Fetching**: [SWR](https://swr.vercel.app/) & [Axios](https://axios-http.com/)
- **Video**: [Video.js](https://videojs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/prashantshah22/tuber-service-frontend.git
cd tuber-service-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory to configure environment variables.

**Example `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
tuber-service-frontend/
├── app/                 # App Router pages and layouts
├── component/           # Reusable React components
├── lib/                 # Utility functions and shared logic
├── public/              # Static assets
└── styles/              # Global styles
```

## 🐛 Debugging
- **Linting**: Run `npm run lint` to check for code issues.
- **Build**: Run `npm run build` to verify the production build process.

## 🤝 Contribution

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
