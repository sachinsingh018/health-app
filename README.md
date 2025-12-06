# Health Intelligence App

A modern, Gen-Z friendly health application powered by AI that provides comprehensive cardiology insights from your health documents.

## Features

- 📤 **Document Upload**: Upload health documents (PDF, TXT, DOCX) for AI-powered analysis
- 📅 **Health Timeline**: Visualize your health events, labs, vitals, and medications chronologically
- 👨‍⚕️ **Doctor Snapshot**: Generate a doctor-ready clinical overview of your health status
- ❤️ **Cardiology Insights**: Get AI-powered cardiovascular health analysis with risk profiles and recommendations
- 💬 **AI Assistant**: Chat with an AI assistant about your health data

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash
- **Charts**: Chart.js & React Chart.js 2
- **Icons**: React Icons (Material, Heroicons, FontAwesome, Tabler, Phosphor)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd health-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
health-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── cardiology/        # Cardiology insights page
│   ├── doctor/            # Doctor snapshot page
│   ├── timeline/          # Health timeline page
│   ├── upload/            # Document upload page
│   └── assistant/         # AI assistant chat page
├── components/             # React components
│   └── ui/                # UI components (AppIcon, Navigation, etc.)
├── contexts/              # React contexts (HealthDataContext)
├── lib/                   # Utility functions and services
│   └── geminiService.ts   # Gemini AI service
└── public/                # Static assets
```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable in Vercel project settings
4. Deploy!

The app will be automatically deployed on every push to the main branch.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

