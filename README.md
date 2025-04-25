# Flowva - Authentication & Onboarding

A modern authentication and onboarding flow built with Next.js, MongoDB, and JWT authentication.

## Features

- User authentication (sign in, sign up, password reset)
- Multi-step onboarding process
- MongoDB integration for data storage
- JWT-based authentication
- Responsive design
- Form validation with Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB running locally or a MongoDB Atlas account

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/your-username/flowva-auth-onboarding.git
cd flowva-auth-onboarding
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Create a `.env.local` file in the root directory:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/flowva
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Flow

1. Users start at the login/signup page (root route)
2. After authentication, they're directed to the onboarding process
3. After completing onboarding, they're redirected to the dashboard

## Pushing to GitHub

1. Create a new repository on GitHub

2. Initialize Git in your project (if not already done):

\`\`\`bash
git init
\`\`\`

3. Add all files to Git:

\`\`\`bash
git add .
\`\`\`

4. Commit your changes:

\`\`\`bash
git commit -m "Initial commit: Authentication and onboarding flow"
\`\`\`

5. Add your GitHub repository as a remote:

\`\`\`bash
git remote add origin https://github.com/your-username/your-repo-name.git
\`\`\`

6. Push to GitHub:

\`\`\`bash
git push -u origin main
\`\`\`

## Deployment

This project can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

Make sure to set the environment variables in your deployment platform:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong, unique secret key for JWT

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's also remove the old auth page since we've moved it to the root:

```typescriptreact file="app/auth/page.tsx" isDeleted="true"
...deleted...
