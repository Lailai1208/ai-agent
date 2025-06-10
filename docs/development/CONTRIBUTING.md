# Contributing Guide

Thank you for your interest in contributing to the AI Agent project! This guide will help you get started.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🚀 Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ai-agent.git
cd ai-agent
```

### 2. Setup Development Environment
```bash
# Run the automated setup
./setup.sh

# Or check project health
./health-check.sh
```

### 3. Start Development
```bash
# Start both frontend and backend
./dev-start.sh

# Or start individually
npm run dev:frontend
npm run dev:backend
```

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code standards below
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Frontend tests
   cd frontend-nextjs
   npm run test
   npm run lint
   npm run type-check

   # Backend tests (when available)
   cd backend
   uv run pytest
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Standards

### Frontend (Next.js/TypeScript)
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component names
- Use Tailwind CSS for styling

### Backend (FastAPI/Python)
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write docstrings for all public functions
- Use proper HTTP status codes
- Implement proper error handling
- Use dependency injection where appropriate

### General
- Write clear, descriptive commit messages
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names
- Write tests for new features

## 💬 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples
```bash
feat(ai): add NVIDIA NIM model integration
fix(frontend): resolve dark mode toggle issue
docs: update API documentation
refactor(backend): improve error handling structure
```

## 🔍 Pull Request Process

1. **Before submitting**
   - Ensure all tests pass
   - Run linting and formatting
   - Update documentation if needed
   - Check that your changes don't break existing functionality

2. **PR Description**
   - Clearly describe what your PR does
   - Include screenshots for UI changes
   - Reference any related issues
   - List any breaking changes

3. **Review Process**
   - Address reviewer feedback promptly
   - Keep your PR up to date with the main branch
   - Be responsive to questions and suggestions

## 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (for UI issues)
- Environment details (OS, Node.js version, Python version)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Check existing documentation
- Review the codebase for examples

Thank you for contributing! 🎉
