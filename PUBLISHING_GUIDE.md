# Publishing Guide for create-ko-next-app

## 📋 Pre-Publishing Checklist

- [x] Package renamed to `create-ko-next-app`
- [x] CLI script working correctly
- [x] Template builds successfully
- [x] Test project creation works
- [x] README updated with correct package name
- [x] All references to ISW/create-isw-next-app updated

## 🚀 Publishing Steps

### 1. **Update Package Information**

Before publishing, update these fields in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_GITHUB_USERNAME/create-ko-next-app.git"
  },
  "homepage": "https://github.com/YOUR_GITHUB_USERNAME/create-ko-next-app#readme",
  "bugs": {
    "url": "https://github.com/YOUR_GITHUB_USERNAME/create-ko-next-app/issues"
  },
  "author": "Kelvin Orhungul <YOUR_EMAIL@interswitch.com>"
}
```

### 2. **Set up Git Repository**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial release of create-ko-next-app v1.0.0"

# Create GitHub repository (on GitHub.com) and add remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/create-ko-next-app.git

# Push to GitHub
git push -u origin main
```

### 3. **Create npm Account**

If you don't have an npm account:

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email

### 4. **Login to npm**

```bash
npm login
```

### 5. **Publish to npm**

```bash
# Build the template one final time
npm run build

# Publish to npm
npm publish
```

### 6. **Test the Published Package**

```bash
# Test the published package
npx create-ko-next-app my-test-app
```

## 📊 Usage Analytics

After publishing, you can track usage:

- npm downloads: https://npmjs.com/package/create-ko-next-app
- GitHub stars and forks
- Issues and feedback

## 🔄 Updating the Package

For future updates:

```bash
# Update version in package.json
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Rebuild template
npm run build

# Publish update
npm publish
```

## 📚 Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/getting-started/publishing-npm-packages)
- [Semantic Versioning](https://semver.org/)
- [GitHub Repository Best Practices](https://docs.github.com/en/repositories)

## 🎯 Marketing Your Package

1. **Share on Social Media**

   - LinkedIn post about the tool
   - Twitter announcement
   - Internal Interswitch channels

2. **Documentation**

   - Create detailed GitHub Wiki
   - Add examples and tutorials
   - Record demo videos

3. **Community**
   - Share in Next.js communities
   - Post on dev.to or Medium
   - Present to your team

## ✅ Success Metrics

Track these metrics to measure success:

- Weekly npm downloads
- GitHub stars/forks
- Issues and PRs
- Community feedback
- Internal adoption at Interswitch

---

**Ready to share your awesome CLI tool with the world! 🚀**
