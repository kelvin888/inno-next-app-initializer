# Inno Next App Initializer

🚀 **A CLI tool for quickly scaffolding Next.js applications with Inno starter template** - featuring authentication, theming, and professional UI components.

[![npm version](https://badge.fury.io/js/inno-next-app-initializer.svg)](https://www.npmjs.com/package/inno-next-app-initializer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ What You Get

- 🔐 **Complete Authentication System** with JWT tokens and session management
- 🎨 **Modern UI Components** built with Radix UI and Tailwind CSS
- 🌈 **Multiple Theme Support** (light, dark, colored variants)
- ⚡ **Performance Optimized** Next.js 15 with App Router
- 🛡️ **TypeScript** with strict configuration
- 🧪 **Testing Setup** with Jest and React Testing Library
- 📱 **Responsive Design** with professional dashboard layout
- 🔧 **Developer Experience** with ESLint, Prettier, and hot reload

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx create-inno-next-app my-awesome-app
```

### Global Installation

```bash
npm install -g inno-next-app-initializer
create-inno-next-app my-awesome-app
```

### Interactive Setup

The CLI will guide you through the setup process:

```bash
npx create-inno-next-app
? What is your project name? my-awesome-app
? Choose a template variant: Admin Dashboard (Full featured)
? Select additional features: Error Reporting, Analytics Integration
? API Base URL: https://api.myapp.com
```

## 📋 Template Options

### 🏢 Admin Dashboard (Default)

Full-featured admin dashboard with all components:

- Collapsible sidebar navigation
- User management interface
- Breadcrumb navigation
- Notification system
- Complete authentication flow

### 📱 Simple App

Minimal setup for lightweight applications:

- Basic authentication
- Clean, simple layout
- Essential components only
- Faster development start

### 🏢 Enterprise

Security-focused setup for enterprise applications:

- Enhanced security features
- OTP authentication support
- Error reporting enabled
- Analytics integration
- Comprehensive monitoring

## 🎯 Usage Options

### Default Setup (Recommended)

```bash
npx create-ko-next-app my-app
```

### Skip Interactive Prompts

```bash
npx create-ko-next-app my-app --yes
```

### Specify Template

```bash
npx create-ko-next-app my-app --template enterprise
```

## 🛠️ After Creation

1. **Navigate to your project:**

   ```bash
   cd my-awesome-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Follow the setup checklist:**
   - Check `CHECKLIST.md` for configuration steps
   - Review `TEMPLATE_SETUP.md` for advanced customization
   - Update `src/lib/templateConfig.ts` for your specific needs

## 📦 What's Included

### **Core Features**

- ✅ Next.js 15 with App Router and TypeScript
- ✅ Tailwind CSS with custom design system
- ✅ Radix UI components for accessibility
- ✅ Zustand for state management
- ✅ TanStack Query for server state
- ✅ React Hook Form with Zod validation

### **Authentication & Security**

- ✅ JWT token management with auto-refresh
- ✅ Session timeout with user warnings
- ✅ Inactivity detection and auto-logout
- ✅ Protected routes and auth guards
- ✅ OTP validation support

### **UI & Experience**

- ✅ Professional dashboard layout
- ✅ Dark/light theme switching
- ✅ Responsive sidebar navigation
- ✅ Loading states and error boundaries
- ✅ Toast notifications
- ✅ Modal dialogs and forms

### **Developer Tools**

- ✅ TypeScript with strict configuration
- ✅ ESLint and Prettier setup
- ✅ Jest testing with coverage reports
- ✅ Custom hooks for common patterns
- ✅ Comprehensive documentation

## 🔧 Customization

After creating your project, customize it by:

1. **Environment Configuration:**

   ```env
   NEXT_PUBLIC_APP_NAME="Your App Name"
   NEXT_PUBLIC_BASE_URL="https://your-api.com"
   ```

2. **Template Configuration:**
   Edit `src/lib/templateConfig.ts` to modify:
   - API endpoints and timeouts
   - Authentication settings
   - Theme preferences
   - Feature flags

3. **Styling:**
   - Update `src/styles/theme.css` for custom colors
   - Modify Tailwind config in `tailwind.config.ts`

## 📚 Documentation

- **[Setup Guide](https://github.com/your-github-username/create-ko-next-app/blob/main/SETUP.md)** - Detailed configuration instructions
- **[API Reference](https://github.com/your-github-username/create-ko-next-app/blob/main/API.md)** - Component and hook documentation
- **[Contributing](https://github.com/your-github-username/create-ko-next-app/blob/main/CONTRIBUTING.md)** - Development guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Kelvin Orhungul](https://github.com/your-github-username)

---

## 🆚 Comparison with Other Tools

| Feature               | create-ko-next-app       | create-next-app   | create-react-app  |
| --------------------- | ------------------------ | ----------------- | ----------------- |
| Authentication System | ✅ Built-in              | ❌ Manual setup   | ❌ Manual setup   |
| UI Components         | ✅ Radix UI + Tailwind   | ❌ Bring your own | ❌ Bring your own |
| Theme System          | ✅ Multi-theme support   | ❌ Manual setup   | ❌ Manual setup   |
| TypeScript            | ✅ Strict config         | ✅ Basic setup    | ✅ Basic setup    |
| Testing Setup         | ✅ Jest + RTL configured | ❌ Manual setup   | ✅ Basic setup    |
| Dashboard Layout      | ✅ Professional ready    | ❌ Manual setup   | ❌ Manual setup   |

## 🏆 Why Choose KO Next.js Starter?

- **⚡ Instant Productivity:** Start building features immediately, not boilerplate
- **🔒 Enterprise Ready:** Production-grade authentication and security
- **🎨 Beautiful UI:** Professional design system out of the box
- **📱 Mobile First:** Responsive design that works everywhere
- **🧪 Quality Assured:** Comprehensive testing setup included
- **📚 Well Documented:** Extensive guides and examples
- **🔧 Highly Configurable:** Easy to customize for your needs

---

**Happy coding! 🚀**
