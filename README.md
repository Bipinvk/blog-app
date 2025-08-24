# Next.js Blog Application

This is a Next.js project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), featuring a blog system with user authentication, profile management, post creation, updates, deletion, and a like functionality. It uses MongoDB for data storage and NextAuth.js for authentication.

## Features
- User authentication with email and password using NextAuth.js.
- Profile management (view and update user details).
- Post creation, viewing, updating, and deletion with author permissions.
- Like/unlike functionality for posts.
- Responsive design with auto-optimized fonts using `next/font`.

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun
- MongoDB Atlas account (for remote database) or local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>

Install dependencies:
bashnpm install
# or
yarn install
# or
pnpm install
# or
bun install

Create a .env.local file in the root directory and add the following environment variables:
textNEXTAUTH_SECRET=<your-generated-secret> # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=<your-mongodb-connection-string> # e.g., mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
NODE_ENV=development

Replace <your-generated-secret> with a secure random string.
Replace <your-mongodb-connection-string> with your MongoDB Atlas or local URI.


Seed the database with initial data (optional):
bashnode -r esbuild-register src/lib/seed.ts

This creates sample users and posts (e.g., admin@example.com with password Admin@123).


Run the development server:
bashnpm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 in your browser to see the application.

Usage

Login: Visit /login, enter admin@example.com and Admin@123 (or a seeded user) to log in.
Profile: Navigate to /profile to view and update your profile.
Posts:

Create a new post at /posts/new.
View all posts at /.
View a specific post at /posts/[id].
Update a post with PUT /api/posts/[id] (author or admin only).
Delete a post with DELETE /api/posts/[id] (author or admin only).
Like/unlike a post with PUT /api/posts/[id] ({ "action": "like" } or { "action": "unlike" }) or DELETE /api/posts/[id]/unlike.


The page auto-updates as you edit files like app/page.tsx.

Project Structure

app/: Next.js App Router pages and API routes.

api/: API endpoints (e.g., auth/[...nextauth]/route.ts, posts/[id]/route.ts, profile/route.ts).
page.tsx: Homepage component.
profile/page.tsx: Profile page component.


components/: Reusable React components (e.g., BlogCard, ProfileForm).
lib/: Utility functions and database connections (e.g., db.ts, seed.ts).
models/: Mongoose models (e.g., User.ts, Post.ts).
.env.local: Environment variables.

Learn More
To learn more about the technologies used:

Next.js Documentation - Learn about Next.js features and API.
NextAuth.js Documentation - Authentication setup.
Mongoose Documentation - MongoDB ORM.
Learn Next.js - Interactive tutorial.

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
Deployment Steps

Install Vercel CLI:
bashnpm install -g vercel

Deploy:
bashvercel

Set environment variables in the Vercel dashboard:

NEXTAUTH_SECRET
NEXTAUTH_URL (e.g., https://your-vercel-app.vercel.app)
MONGODB_URI
NODE_ENV (set to production)


Check the deployment URL provided by Vercel.

For more details, see the Next.js deployment documentation.
Contributing
Contributions are welcome! Please fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Troubleshooting

401 Unauthorized: Ensure .env.local variables are correct, clear browser cookies, and restart the server.
Build Errors: Check import paths (e.g., authOptions) and ensure all dependencies are installed.
Database Issues: Verify MONGODB_URI and test with mongosh or a MongoDB client.