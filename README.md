<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;">
  <h1 style="margin: 0;">Ledger</h1>
</div>

## Introduction

Welcome to **Ledger**! 📊

Ledger is a modern financial tracking application built with the O2 Stack - a powerful and versatile Next.js starter kit designed to accelerate your development workflow. Inspired by the T3 Stack, it integrates a suite of modern technologies and best practices, allowing you to focus on building outstanding applications without the hassle of initial setup.

## Features

- **Next.js 15**: The latest version of the React framework for production.
- **TypeScript**: Strongly-typed JavaScript for safer and more robust code.
- **Prisma**: Next-generation ORM for database access.
- **Clerk Authentication**: Secure and easy-to-implement user authentication.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn UI**: A set of beautifully designed, accessible, and customizable UI components built with Radix UI.
- **React Query**: Powerful data-fetching and state management.
- **Environment Management**: Streamlined environment variable handling with `@t3-oss/env-nextjs`.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)

## Getting Started

Follow these steps to get your Ledger project up and running quickly.

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [Bun](https://bun.sh/)

### Installation

1. **Install Dependencies**

   You can choose your preferred package manager:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Configure Environment Variables**

Create a `.env` file in the root directory and add the necessary environment variables. You can refer to `.env.example` for guidance.

3. **Set Up the Database**

   Run Prisma migrations to set up your database schema.

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server**

   Launch the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Access the Application**

   Open [http://localhost:3000](http://localhost:3000) in your browser to see your Ledger application in action.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Starts the development server                |
| `npm run build` | Builds the application for production        |
| `npm run start` | Starts the production server                 |
| `npm run lint`  | Runs ESLint for code linting                 |
| `npm run turbo` | Starts the development server with Turbopack |

## Project Structure

```plaintext
ledger/
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  ├─ (private)/
│  │  ├─ (public)/
│  │  ├─ components/
│  │  └─ ...
│  ├─ components/
│  ├─ providers/
│  ├─ lib/
│  ├─ types/
│  └─ ...
├─ prisma/
├─ public/
├─ styles/
├─ .env
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ ...
```

### Key Directories and Files

- **`src/app/`**: Contains the main application components and pages.
  - **`(auth)/`**: Authentication-related pages like sign-in and sign-up.
  - **`(private)/`**: Protected routes accessible only to authenticated users.
  - **`(public)/`**: Publicly accessible pages.
  - **`components/`**: Shared components across the application.
- **`src/components/`**: Reusable UI components, including Shadcn UI components.
- **`src/providers/`**: Context providers for theming, state management, etc.
- **`src/lib/`**: Utility functions and configurations.
- **`prisma/`**: Prisma schema and migration files.
- **`styles/`**: Global and component-specific styles.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

Happy Coding! 🎉
