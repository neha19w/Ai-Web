# AI Doc Assistant - Monorepo

A modern monorepo application featuring a React.js frontend and Node.js backend for AI-powered document assistance.

## Project Structure

```
ai-doc-assistant/
├── packages/
│   ├── frontend/          # React.js application
│   └── backend/           # Node.js Express server
├── package.json           # Root workspace configuration
└── README.md             # This file
```

## Prerequisites

- Node.js 18+ 
- npm 9+

## Getting Started

### Installation

```bash
# Install dependencies for all packages
npm install
```

### Development

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run them separately
npm run frontend    # Start React dev server (port 3000)
npm run backend     # Start Node.js server (port 5000)
```

### Building

```bash
# Build all packages
npm run build

# Or build individually
npm run frontend:build
npm run backend:build
```

## Frontend

React.js application with TypeScript, Vite, and modern tooling.

- **Location:** `packages/frontend/`
- **Port:** 3000 (development)
- **Build tool:** Vite

### Frontend Scripts

```bash
cd packages/frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

## Backend

Node.js Express server with TypeScript.

- **Location:** `packages/backend/`
- **Port:** 5000 (development)
- **Framework:** Express

### Backend Scripts

```bash
cd packages/backend
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linter
```

## Environment Variables

### Frontend
Create `packages/frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000
```

### Backend
Create `packages/backend/.env`:
```
PORT=5000
NODE_ENV=development
```

## Development Workflow

1. Install dependencies: `npm install`
2. Start frontend: `npm run frontend`
3. Start backend: `npm run backend`
4. Frontend will be available at `http://localhost:3000`
5. Backend API will be available at `http://localhost:5000`

## License

MIT

## Author

Your Name
