This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL to store workflow runs, logs, and artifacts.

### Configuration

Ensure you have a `DATABASE_URL` in your `.env.local` or `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mama
```

### Database Scripts

- `npm run db:generate`: Generate migrations based on the schema.
- `npm run db:push`: Push the schema changes directly to the database (useful for development).
- `npm run db:migrate`: Run the generated migrations against the database.
- `npm run db:studio`: Open Drizzle Studio to browse your data.

## Docker

You can run the application using Docker.

### Using Docker Compose (Recommended)

1. Create a `.env` file with your `OPENAI_API_KEY`:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

2. Build and run the container:
   ```bash
   docker compose up --build
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker directly

1. Build the image:
   ```bash
   docker build -t multi-agent-marketing .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env multi-agent-marketing
   ```
