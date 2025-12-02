# KZ Fan - Sports Event Tracker

A full-stack web application for tracking Kazakhstan national team sports events worldwide, with a Telegram bot integration.

## Features

- 🌍 **Bilingual Support**: Kazakh (default) and English
- 📅 **Event Management**: Admin panel for adding, editing, and deleting events
- 🔍 **Smart Search**: Search events by country or city
- 🤖 **Telegram Bot**: Get event updates via Telegram
- 🔐 **Secure Admin**: JWT-based authentication

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, i18next
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: Prisma
- **Bot**: Telegraf (Telegram Bot Framework)

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production-like setup) or SQLite (default)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kzfan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   - `DATABASE_URL`: Database connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token (optional for local dev)
   - `NODE_ENV`: Set to `development`

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Create an admin user**
   ```bash
   npx prisma studio
   ```
   Then manually create a user with a bcrypt-hashed password.

### Running the Application

**Development mode** (frontend + backend separately):

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server:dev
```

**Production mode** (single server):
```bash
npm run build
NODE_ENV=production npm run server
```

The app will be available at `http://localhost:3000`

## Deployment to Render

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and set up:
     - PostgreSQL database
     - Web service with the app
     - Environment variables

3. **Set Telegram Bot Token**
   - In Render dashboard, go to your web service
   - Navigate to "Environment"
   - Add `TELEGRAM_BOT_TOKEN` with your bot token value

### Option 2: Manual Deployment

1. **Create PostgreSQL Database**
   - In Render: New → PostgreSQL
   - Note the connection string

2. **Create Web Service**
   - In Render: New → Web Service
   - Connect your GitHub repo
   - Configure:
     - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
     - **Start Command**: `npm run server`
     - **Environment Variables**:
       - `NODE_ENV=production`
       - `DATABASE_URL=<your-postgres-connection-string>`
       - `JWT_SECRET=<generate-a-random-secret>`
       - `TELEGRAM_BOT_TOKEN=<your-bot-token>`

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT authentication | Yes |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from @BotFather | Yes (for bot) |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 3000) | No |

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/events` - Get all events
- `POST /api/login` - Admin login

### Protected Endpoints (require JWT)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Telegram Bot Commands

- `/start` - Welcome message
- `/events` - Show upcoming events

## Project Structure

```
kzfan/
├── server/           # Backend code
│   ├── index.ts     # Express server
│   └── bot.ts       # Telegram bot
├── src/             # Frontend code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── i18n.ts      # Internationalization
│   └── App.tsx      # Main app component
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── dist/            # Production build (generated)
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
