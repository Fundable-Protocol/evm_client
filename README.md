# Fundable Frontend

Fundable is a decentralized payment platform built on StarkNet that enables seamless Web3 payments and subscriptions. This repository contains the main frontend application for the Fundable Protocol.

## Features

- 🔒 Secure Web3 payments powered by Starknet
- 💳 Recurring subscription management
- 🌐 Cross-chain payment solutions
- 👥 User-friendly dashboard for payment management
- 💼 Business and creator tools for payment processing

## Tech Stack

- Next.js 14
- TypeScript
- Starknet.js
- Tailwind CSS
- Shadcn/ui
- PNPM as package manager

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PNPM (v8 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Fundable-Protocol/frontend-main.git
cd frontend-main
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
NEXT_PUBLIC_STARKNET_NETWORK=
NEXT_PUBLIC_INFURA_KEY=
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
frontend-main/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   ├── providers/    # React context providers
│   └── store/        # State management
|   └── types/        # TypeScript types
├── public/           # Static assets
├── .env              # Environment variables
└── ...config files
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.




