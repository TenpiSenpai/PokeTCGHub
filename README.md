# Poké TCG Hub

> Enterprise-grade, community-driven resource for the Pokémon Trading Card Game

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00DC82.svg)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

Poké TCG Hub is a comprehensive web application for viewing and managing Pokémon Trading Card Game information. Built with enterprise-level architecture, it supports both English and Japanese card sets with a focus on type safety, security, and maintainability.

## ✨ Features

- **🔍 Comprehensive Card Database**: Browse English and Japanese TCG sets
- **🎨 Type-Safe Architecture**: Full TypeScript with strict mode
- **🔒 Security First**: XSS prevention with DOMPurify, CSP headers
- **🎯 Enterprise Patterns**: Service layer, repository pattern, state management
- **🧪 Tested**: Unit, integration, and E2E tests with Vitest and Playwright
- **♿ Accessible**: ARIA labels, semantic HTML, keyboard navigation
- **🚀 Performance**: Lazy loading, code splitting, optimized assets
- **📱 Responsive**: Mobile-first design with Tailwind CSS

## 🏗️ Architecture

### Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: [@nuxt/content](https://content.nuxt.com/) (YAML)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **Code Quality**: ESLint + Prettier + Husky

### Project Structure

```
app/
├── classes/           # Legacy compatibility layer
├── components/        # Vue components (refactored)
├── composables/       # Reusable composition functions
├── pages/            # Route pages
├── plugins/          # Nuxt plugins
├── providers/        # Custom providers (fonts)
├── repositories/     # Data access layer
├── schemas/          # Zod validation schemas
├── services/         # Business logic layer
├── stores/           # Pinia state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

content/sets/         # YAML card database
├── en/              # English card sets
└── jp/              # Japanese card sets

tests/
├── unit/            # Unit tests
├── e2e/             # End-to-end tests
└── setup.ts         # Test configuration

public/images/sets/  # Card images
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm (with corepack enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/NandaScott/PokeTCGHub.git
cd PokeTCGHub

# Install dependencies
npm install

# Setup git hooks
npm run prepare
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

### Quality Checks

```bash
# Run all quality checks (lint + typecheck + test + build)
npm run validate

# Format code
npm run format

# Run tests with coverage
npm run test:coverage
```

## 📝 Adding Cards

### Adding Card Images

1. Place images in `public/images/sets/[locale]/[set]/`
   - Locale: `en` (English) or `jp` (Japanese)
   - Set: Set code (e.g., `m3`, `por`)
2. Use 3-digit card numbers (e.g., `001.jpg`, `047.jpg`)
3. Optimize images to < 60KB

### Adding Card Data

Create or update YAML files in `content/sets/[locale]/[set].yaml`

#### Card Schema

```yaml
set: set_code # e.g., en_por, jp_m3
desc: Set Name # e.g., Perfect Order, Nihil Zero
cards:
  - num: '001' # Card number (string)
    name: Card Name # e.g., Pikachu
    type: G # Energy type code (G, R, W, L, P, F, D, M, N, C, T, E)
    subtype: Item # For trainers: Supporter, Item, Pokémon Tool, Stadium
    hp: 60 # Hit points (number)
    stage: 0 # Evolution stage (0=Basic, 1=Stage 1, 2=Stage 2, 3=Mega)
    evolve-from: Previous Stage # Leave empty for Basic Pokémon
    ability:
      name: Ability Name
      desc: Ability description
    attack:
      - energy: LLC # Energy cost (L=Lightning, C=Colorless)
        name: Attack Name
        damage: 30+ # Can be: 30, 30+, 30x, 30-
        desc: Attack description
    trainer:
      - Line 1 of trainer text
      - Line 2 of trainer text
    weak: R # Weakness type code
    resist: M # Resistance type code
    retreat: 1 # Retreat cost (number)
    img:
      en: /en/por/001.jpg # English image path
      jp: /jp/m3/001.jpg # Japanese image path
    ref: # For reprints/references
      set: other_set_code
      num: '046'
      from: From JP Nihil Zero
```

#### Energy Type Codes

- `G` - Grass
- `R` - Fire
- `W` - Water
- `L` - Lightning
- `P` - Psychic
- `F` - Fighting
- `D` - Darkness
- `M` - Metal
- `N` - Dragon
- `C` - Colorless
- `T` - Trainer
- `E` - Special Energy

### Card References

To reference cards from other sets (reprints):

```yaml
cards:
  - num: '047'
    ref:
      set: jp_m3 # Source set code
      num: '046' # Card number in source set
      from: From JP Nihil Zero # Description
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui
```

## 🔒 Security

- **XSS Prevention**: All user content sanitized with DOMPurify
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **Type Safety**: Strict TypeScript with runtime validation
- **No `v-html`**: Replaced with safe sanitization utilities
- **Input Validation**: Zod schemas for all data

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch
2. Make changes
3. Run quality checks: `npm run validate`
4. Create a pull request
5. Ensure CI passes

### Code Standards

- TypeScript strict mode
- ESLint + Prettier formatting
- 80%+ test coverage
- Semantic commit messages

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](docs/API.md)
- [Security Policy](SECURITY.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Community contributors
- Pokémon Company International
- Creatures Inc.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/NandaScott/PokeTCGHub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NandaScott/PokeTCGHub/discussions)

---

Made with ❤️ by the community for the community
