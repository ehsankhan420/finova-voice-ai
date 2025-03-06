### FINOVA Voice AI

A full-stack voice-to-text-to-voice application powered by Gemini 1.5 Flash and ElevenLabs. This application allows users to upload or record audio, process it with AI to generate text responses, and convert those responses back to natural-sounding speech.

## ✨ Features

- **Voice Upload & Recording**: Upload audio files or record directly in the browser  
- **AI Processing**: Powered by Google's Gemini 1.5 Flash for accurate voice-to-text conversion  
- **Voice Synthesis**: Convert AI responses back to natural-sounding speech with ElevenLabs  
- **Responsive Design**: Works seamlessly across all device sizes  
- **Dark/Light Mode**: Toggle between dark and light themes  
- **Animated UI**: Smooth animations and transitions for a modern user experience  
- **MongoDB Integration**: Store and retrieve voice processing history  

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher  
- MongoDB (local or Atlas)  
- Gemini API key  
- ElevenLabs API key  

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/finova-voice-ai.git
cd finova-voice-ai
```

2. Install frontend dependencies:

```sh
npm install
```

3. Install backend dependencies:

```sh
cd backend
npm install
cd ..
```

4. Set up environment variables:

Create a `.env.local` file in the root directory:

```sh
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Create a `.env` file in the `backend` directory:

```sh
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finova-voice-ai
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Create a `.env.local` file in the root directory with:

```sh
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

1. Start the backend server:

```sh
cd backend
npm run dev
```

2. In a new terminal, start the frontend:

```sh
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

#### Production Mode

1. Build the frontend:

```sh
npm run build
```

2. Start the frontend:

```sh
npm start
```

3. Start the backend:

```sh
cd backend
npm start
```

## 📁 Project Structure

```plaintext
finova-voice-ai/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── backend/              # Express.js backend
│   ├── models/           # MongoDB models
│   ├── server.js         # Server entry point
│   └── package.json      # Backend dependencies
├── components/           # React components
│   ├── ui/               # UI components
│   ├── header.tsx        # Header component
│   ├── features.tsx      # Features section
│   ├── upload-form.tsx   # Main form component
│   └── theme-provider.tsx # Theme provider
├── lib/                  # Utility functions
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── .env.local            # Environment variables (frontend)
├── .env.example          # Example environment variables
├── package.json          # Frontend dependencies
└── README.md             # Project documentation
```

## 🔄 API Endpoints

### Backend API

- `POST /api/process-voice`: Process voice with Gemini AI  
  - Accepts: `file` (audio file) and `prompt` (text)  
  - Returns: `text` (AI response) and `requestId`  

- `POST /api/synthesize-speech`: Convert text to speech  
  - Accepts: `text` and optional `requestId`  
  - Returns: `audioUrl`  

- `GET /api/history`: Get processing history  
  - Returns: Array of past voice requests  

### Frontend API Routes

- `POST /api/process-voice`: Process voice with Gemini AI  
- `POST /api/synthesize-speech`: Convert text to speech  
- `GET /api/audio/[filename]`: Serve audio files  

## 🛠️ Technologies Used

### Frontend

- Next.js 14  
- React 18  
- Tailwind CSS  
- Framer Motion  
- Lucide React (icons)  
- shadcn/ui components  

### Backend

- Express.js  
- MongoDB with Mongoose  
- Multer (file uploads)  
- Node.js  

### AI & Voice

- Google Gemini 1.5 Flash API  
- ElevenLabs API  

## 🧩 Additional Commands

### Linting

```sh
npm run lint
```

### Type Checking

```sh
npm run type-check
```

### Database Management

Start a local MongoDB instance (if using Docker):

```sh
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Deployment

Deploy to Vercel:

```sh
vercel
```

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/)  
- [ElevenLabs](https://elevenlabs.io/)  
- [Next.js](https://nextjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [shadcn/ui](https://ui.shadcn.com/)  
- [Framer Motion](https://www.framer.com/motion/)  

---

Made with ❤️ by [Your Name]
