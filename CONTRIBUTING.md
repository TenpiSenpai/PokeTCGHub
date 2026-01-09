# Contributing to Poké TCG Hub

Thank you for your interest in contributing to Poké TCG Hub! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- Git
- A GitHub account
- Familiarity with TypeScript, Vue 3, and Nuxt

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PokeTCGHub.git
   cd PokeTCGHub
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/NandaScott/PokeTCGHub.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Setup git hooks**:
   ```bash
   npm run prepare
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, maintainable code
- Follow the established patterns and architecture
- Add/update tests for your changes
- Update documentation as needed

### 3. Run Quality Checks

Before committing, run:

```bash
# Format code
npm run format

# Lint code
npm run lint:fix

# Type check
npm run typecheck

# Run tests
npm run test

# Run all checks
npm run validate
```

### 4. Commit Your Changes

We use semantic commit messages:

```bash
git add .
git commit -m "feat: add new card filtering feature"
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Build process or auxiliary tool changes

**Examples**:
```
feat(cards): add support for Stadium cards
fix(validation): correct HP validation logic
docs(readme): update installation instructions
test(services): add unit tests for CardService
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎨 Code Standards

### TypeScript

- Use **strict mode** TypeScript
- **No `any` types** without justification
- Provide explicit return types for functions
- Use proper type definitions from `app/types/`

```typescript
// ✅ Good
function getCard(id: string): Card | null {
  // ...
}

// ❌ Bad
function getCard(id: any): any {
  // ...
}
```

### Vue Components

- Use **`<script setup>` syntax**
- Define **proper TypeScript interfaces** for props
- Use **composables** for reusable logic
- Follow **accessibility guidelines** (ARIA labels, semantic HTML)

```vue
<script setup lang="ts">
// ✅ Good
interface Props {
  card: Card;
  showImage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showImage: true,
});
</script>
```

### Testing

- Write tests for new features
- Maintain **80%+ code coverage**
- Test edge cases and error scenarios
- Use descriptive test names

```typescript
// ✅ Good
describe('CardService', () => {
  describe('getCardSet', () => {
    it('should return card set when it exists', async () => {
      // ...
    });

    it('should return error when set does not exist', async () => {
      // ...
    });
  });
});
```

### Security

- **Never use `v-html`** without sanitization
- Validate all user input
- Use DOMPurify for HTML sanitization
- Follow security best practices

## 📝 Adding Cards

### Adding New Card Sets

1. Create YAML file in `content/sets/[locale]/[set_code].yaml`
2. Add card images to `public/images/sets/[locale]/[set_code]/`
3. Follow the card schema (see README.md)
4. Validate YAML syntax
5. Test locally before submitting

### Card Data Guidelines

- Use **3-digit card numbers** (e.g., `001`, `047`)
- Include all required fields
- Provide **accurate descriptions**
- Reference official card text when possible
- Optimize images to **< 60KB**

## 🧪 Testing Guidelines

### Unit Tests

- Test individual functions and utilities
- Mock external dependencies
- Focus on business logic

### Component Tests

- Test component behavior
- Test user interactions
- Test accessibility

### E2E Tests

- Test critical user flows
- Test navigation
- Test error scenarios

## 📚 Documentation

When adding features:

1. Update relevant documentation
2. Add JSDoc comments to functions
3. Update type definitions
4. Add examples where helpful

```typescript
/**
 * Fetches a card set by its code
 * @param setCode - The set code to fetch (e.g., "en_por", "jp_m3")
 * @returns Result containing the card set or error
 * @example
 * const result = await cardService.getCardSet("en_por");
 * if (result.success) {
 *   console.log(result.data);
 * }
 */
async function getCardSet(setCode: string): Promise<Result<CardSet>> {
  // ...
}
```

## 🐛 Reporting Issues

When reporting bugs:

1. **Check existing issues** first
2. **Use the issue template**
3. Provide **clear reproduction steps**
4. Include **environment details**
5. Add **screenshots** if applicable

## 💡 Suggesting Features

When suggesting features:

1. **Search existing feature requests**
2. **Explain the use case**
3. Describe the **expected behavior**
4. Consider **implementation complexity**
5. Be open to discussion

## 🔍 Code Review Process

Pull requests will be reviewed for:

- **Code quality** and adherence to standards
- **Test coverage** and passing tests
- **Documentation** completeness
- **Security** considerations
- **Performance** implications
- **Accessibility** compliance

### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Accessibility requirements met
- [ ] Performance is acceptable
- [ ] CI/CD checks pass

## 📞 Getting Help

- **Questions**: Open a [Discussion](https://github.com/NandaScott/PokeTCGHub/discussions)
- **Bugs**: Open an [Issue](https://github.com/NandaScott/PokeTCGHub/issues)
- **Security**: See [SECURITY.md](SECURITY.md)

## 🎉 Recognition

Contributors will be:

- Listed in the project README
- Credited in release notes
- Appreciated by the community!

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to Poké TCG Hub! 🙏
