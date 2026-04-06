# GlobalScore Live

A real-time live sports dashboard featuring cricket and football scores, schedules, and news. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Live Scores**: Real-time cricket and football match updates
- **Match Schedules**: Upcoming fixtures for the next 7 days
- **Sport-Specific Branding**: Green for cricket (🏏), blue for football (⚽)
- **News Section**: Latest sports news from NewsAPI
- **Multiple Tabs**: Live, Upcoming, Trending, and Finished matches
- **Responsive Design**: Mobile-friendly with bottom navigation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **APIs**: AllSportsAPI, CricAPI, NewsAPI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globalscore-live.git
cd globalscore-live
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
ALLSPORTS_API_KEY=your_allsports_api_key_here
CRICAPI_KEY=your_cricapi_key_here
NEWSAPI_KEY=your_newsapi_key_here
```

Get your API keys from:
- [AllSportsAPI](https://allsportsapi.com/)
- [CricAPI](https://www.cricapi.com/)
- [NewsAPI](https://newsapi.org/)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Security

This project uses a Next.js Route Handler (`/api/sports`) to proxy API requests. API keys are stored server-side in `.env.local` and never exposed to the client. The `.env.local` file is automatically ignored by Git.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

MIT License

