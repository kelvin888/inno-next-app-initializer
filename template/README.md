## Getting Started

This is a Next.js admin dashboard application created with [create-ko-next-app](https://www.npmjs.com/package/create-ko-next-app).

### Prerequisites

- Node.js 18+
- npm or yarn

### Environment Setup

1. Copy the environment template:

   ```bash
   cp .env.template .env.local
   ```

2. Update the backend URL in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
   ```

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Authentication

The application includes a complete authentication system:

- **Login Page**: `/login`
- **Dashboard**: `/dashboard` (protected)
- **Auto-redirect**: Unauthenticated users are redirected to login

#### Demo Credentials

For testing purposes, you can use:

- Email: `admin@example.com`
- Password: `password`

### Features

- ✅ **Authentication System**: Complete login/logout with JWT tokens
- ✅ **Admin Dashboard**: Responsive dashboard layout with sidebar navigation
- ✅ **UI Components**: Pre-built Radix UI components with Tailwind CSS
- ✅ **State Management**: Zustand for authentication and global state
- ✅ **API Client**: Axios-based HTTP client with interceptors
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Error Handling**: Comprehensive error handling and user feedback

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── dashboard/       # Protected dashboard pages
│   ├── login/          # Login page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── services/          # API services
├── store/             # State management
└── types/             # TypeScript type definitions
```

### Customization

#### Backend Configuration

Update the API base URL in your environment file:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

#### Authentication Endpoints

The authentication system expects these API endpoints:

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh token
- `GET /auth/validate` - Validate token

#### Navigation Menu

Edit `src/components/layout/Sidebar.tsx` to customize the navigation menu:

```tsx
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Your Feature",
    href: "/dashboard/your-feature",
    icon: YourIcon,
  },
  // Add more menu items...
];
```

#### Styling

- **Colors**: Modify `tailwind.config.ts` for custom color schemes
- **Components**: Update `src/app/globals.css` for global styles
- **Layout**: Customize `src/components/layout/` components

### Deployment

Build the application:

```bash
npm run build
# or
yarn build
```

The app is ready to be deployed to any platform that supports Next.js.

### Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
