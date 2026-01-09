# Tailwind CSS Enterprise Guide

## 🎨 Overview

This project uses a comprehensive, enterprise-level Tailwind CSS configuration with custom theme, plugins, utilities, and components specifically designed for the Pokémon TCG Hub application.

## 📦 Installation

All Tailwind plugins and dependencies are already installed:

```bash
npm install  # Installs all dependencies including Tailwind plugins
```

**Included Plugins**:
- `@tailwindcss/forms` - Better form styling
- `@tailwindcss/typography` - Prose styling
- `@tailwindcss/aspect-ratio` - Aspect ratio utilities
- `@tailwindcss/container-queries` - Container query support

## 🎯 Custom Theme

### Energy Type Colors

Custom color palette based on Pokémon TCG energy types:

```vue
<template>
  <!-- Grass type -->
  <div class="bg-energy-grass-100 text-energy-grass-700">Grass Energy</div>

  <!-- Fire type -->
  <div class="bg-energy-fire-100 text-energy-fire-700">Fire Energy</div>

  <!-- Water type -->
  <div class="bg-energy-water-100 text-energy-water-700">Water Energy</div>

  <!-- Lightning type -->
  <div class="bg-energy-lightning-100 text-energy-lightning-700">Lightning Energy</div>

  <!-- Psychic type -->
  <div class="bg-energy-psychic-100 text-energy-psychic-700">Psychic Energy</div>

  <!-- Fighting type -->
  <div class="bg-energy-fighting-100 text-energy-fighting-700">Fighting Energy</div>

  <!-- Darkness type -->
  <div class="bg-energy-darkness-100 text-energy-darkness-700">Darkness Energy</div>

  <!-- Metal type -->
  <div class="bg-energy-metal-100 text-energy-metal-700">Metal Energy</div>

  <!-- Dragon type -->
  <div class="bg-energy-dragon-100 text-energy-dragon-700">Dragon Energy</div>

  <!-- Colorless type -->
  <div class="bg-energy-colorless-100 text-energy-colorless-700">Colorless Energy</div>
</template>
```

### UI Colors

Standard UI color palette:

```vue
<template>
  <button class="bg-primary-600 text-white">Primary Button</button>
  <button class="bg-secondary-600 text-white">Secondary Button</button>
  <div class="bg-success-100 text-success-700">Success Message</div>
  <div class="bg-warning-100 text-warning-700">Warning Message</div>
  <div class="bg-error-100 text-error-700">Error Message</div>
</template>
```

## 🧩 Custom Components

### Pokemon Card

```vue
<template>
  <div class="pokemon-card">
    <div class="pokemon-card-header">
      <h3>Pikachu</h3>
      <span class="badge badge-warning">Basic</span>
    </div>
    <div class="pokemon-card-body">
      <img src="/path/to/image.jpg" alt="Pikachu" class="pokemon-card-image" />
    </div>
    <div class="pokemon-card-footer">
      <span class="energy-icon-lightning">⚡</span>
      <span>Lightning Type</span>
    </div>
  </div>
</template>
```

**Variants**:
- `.pokemon-card` - Base card style
- `.pokemon-card-image` - Proper aspect ratio for card images
- `.pokemon-card-header` - Card header section
- `.pokemon-card-body` - Card body section
- `.pokemon-card-footer` - Card footer section

### Buttons

```vue
<template>
  <!-- Primary button -->
  <button class="btn btn-primary">Primary Button</button>

  <!-- Secondary button -->
  <button class="btn btn-secondary">Secondary Button</button>

  <!-- Outline button -->
  <button class="btn btn-outline">Outline Button</button>

  <!-- Ghost button -->
  <button class="btn btn-ghost">Ghost Button</button>

  <!-- Link button -->
  <button class="btn btn-link">Link Button</button>

  <!-- Size variants -->
  <button class="btn btn-primary btn-sm">Small</button>
  <button class="btn btn-primary">Default</button>
  <button class="btn btn-primary btn-lg">Large</button>
</template>
```

### Badges

```vue
<template>
  <span class="badge badge-primary">Primary</span>
  <span class="badge badge-secondary">Secondary</span>
  <span class="badge badge-success">Success</span>
  <span class="badge badge-warning">Warning</span>
  <span class="badge badge-error">Error</span>
</template>
```

### Alerts

```vue
<template>
  <div class="alert alert-success">✓ Operation successful!</div>
  <div class="alert alert-warning">⚠ Warning message</div>
  <div class="alert alert-error">✗ Error occurred</div>
  <div class="alert alert-info">ℹ Information message</div>
</template>
```

### Loading Spinners

```vue
<template>
  <!-- Default spinner -->
  <div class="spinner"></div>

  <!-- Small spinner -->
  <div class="spinner spinner-sm"></div>

  <!-- Large spinner -->
  <div class="spinner spinner-lg"></div>

  <!-- Colored spinners -->
  <div class="spinner text-primary-600"></div>
  <div class="spinner text-success-600"></div>
</template>
```

### Skeleton Loaders

```vue
<template>
  <div class="space-y-4">
    <div class="skeleton h-12 w-full"></div>
    <div class="skeleton skeleton-text w-3/4"></div>
    <div class="skeleton skeleton-text w-1/2"></div>
    <div class="skeleton skeleton-circle h-16 w-16"></div>
  </div>
</template>
```

## 🎨 Energy Icon Utilities

Custom utilities for energy type styling:

```vue
<template>
  <!-- Energy text colors -->
  <span class="energy-grass">Grass</span>
  <span class="energy-fire">Fire</span>
  <span class="energy-water">Water</span>

  <!-- Energy backgrounds -->
  <div class="energy-grass-bg p-2">Grass Background</div>
  <div class="energy-fire-bg p-2">Fire Background</div>

  <!-- Energy borders -->
  <div class="border-2 energy-grass-border p-4">Grass Border</div>

  <!-- Energy icons -->
  <span class="energy-icon energy-icon-grass">G</span>
  <span class="energy-icon energy-icon-fire">R</span>
  <span class="energy-icon energy-icon-water">W</span>
</template>
```

## 🔧 Custom Utilities

### Glass Morphism

```vue
<template>
  <div class="glass p-6">
    Glass effect with light background
  </div>

  <div class="glass-dark p-6">
    Glass effect with dark background
  </div>

  <!-- Or use the utility -->
  <div class="glass-effect p-6">
    Advanced glass effect
  </div>
</template>
```

### Gradients

```vue
<template>
  <div class="gradient-primary p-6 text-white">Primary Gradient</div>
  <div class="gradient-success p-6 text-white">Success Gradient</div>
  <div class="gradient-warning p-6 text-white">Warning Gradient</div>
  <div class="gradient-rainbow p-6 text-white">Rainbow Gradient</div>

  <!-- Text gradient -->
  <h1 class="text-gradient text-4xl font-bold">Gradient Text</h1>
</template>
```

### Scrollbar Styling

```vue
<template>
  <!-- Thin scrollbar -->
  <div class="h-64 overflow-y-scroll scrollbar-thin">
    Long content here...
  </div>

  <!-- Hidden scrollbar -->
  <div class="h-64 overflow-y-scroll scrollbar-hidden">
    Long content with hidden scrollbar...
  </div>
</template>
```

### Neumorphism

```vue
<template>
  <!-- Raised neumorphic element -->
  <div class="neumorphism rounded-xl p-6">
    Neumorphic card
  </div>

  <!-- Inset neumorphic element -->
  <div class="neumorphism-inset rounded-xl p-6">
    Pressed neumorphic effect
  </div>
</template>
```

### Aspect Ratios

```vue
<template>
  <!-- Card aspect ratio (215:300) -->
  <img src="/card.jpg" alt="Card" class="aspect-card w-full object-cover" />

  <!-- Standard aspect ratios -->
  <img src="/image.jpg" alt="Image" class="aspect-video w-full" />
  <img src="/image.jpg" alt="Image" class="aspect-square w-full" />
</template>
```

## 🎭 Animations

### Built-in Animations

```vue
<template>
  <!-- Fade animations -->
  <div class="animate-fade-in">Fade In</div>
  <div class="animate-fade-out">Fade Out</div>

  <!-- Slide animations -->
  <div class="animate-slide-in">Slide In</div>
  <div class="animate-slide-out">Slide Out</div>

  <!-- Scale animations -->
  <div class="animate-scale-in">Scale In</div>
  <div class="animate-scale-out">Scale Out</div>

  <!-- Other animations -->
  <div class="animate-bounce-slow">Slow Bounce</div>
  <div class="animate-shimmer">Shimmer Effect</div>
  <div class="animate-pulse">Pulse Effect</div>
</template>
```

### Custom Slide Animations

```vue
<template>
  <div class="animate-slide-in-left">Slide from left</div>
  <div class="animate-slide-in-right">Slide from right</div>
  <div class="animate-slide-in-up">Slide from bottom</div>
  <div class="animate-slide-in-down">Slide from top</div>
</template>
```

## 📐 Layout Utilities

### Container

```vue
<template>
  <!-- Standard container -->
  <div class="container-custom">
    Centered content with responsive padding
  </div>
</template>
```

### Grid Layouts

```vue
<template>
  <!-- Card grid (auto-fill) -->
  <div class="grid-card">
    <div class="pokemon-card">Card 1</div>
    <div class="pokemon-card">Card 2</div>
    <div class="pokemon-card">Card 3</div>
  </div>

  <!-- Auto-fill grid -->
  <div class="grid-auto-fill">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</template>
```

## 🌗 Dark Mode

Dark mode is fully supported with the `dark:` modifier:

```vue
<template>
  <div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    Content that adapts to dark mode
  </div>

  <button class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
    Dark mode aware button
  </button>
</template>
```

**Toggle dark mode**:

```typescript
// In your component or composable
const isDark = ref(false);

function toggleDarkMode() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
}
```

## 🎯 CSS Custom Properties (Design Tokens)

All design tokens are available as CSS custom properties:

```vue
<template>
  <div
    :style="{
      color: 'rgb(var(--color-primary))',
      fontSize: 'var(--font-size-lg)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--radius-lg)',
    }"
  >
    Using design tokens
  </div>
</template>
```

**Available Tokens**:

```css
/* Colors */
--color-primary
--color-secondary
--color-success
--color-warning
--color-error

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl

/* Typography */
--font-size-xs through --font-size-4xl

/* Border Radius */
--radius-sm through --radius-full

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

/* Transitions */
--transition-fast (150ms)
--transition-base (300ms)
--transition-slow (500ms)
```

## ♿ Accessibility

### Focus Rings

All interactive elements have visible focus rings:

```vue
<template>
  <!-- Focus ring is applied automatically -->
  <button class="btn btn-primary">I have a focus ring</button>

  <!-- Custom focus ring -->
  <button class="focus:ring-4 focus:ring-success-500">Custom focus</button>
</template>
```

### Screen Reader Only

```vue
<template>
  <span class="sr-only">This text is only for screen readers</span>

  <!-- Toggle visibility -->
  <span :class="{ 'sr-only': !showText, 'not-sr-only': showText }">
    Toggleable text
  </span>
</template>
```

### High Contrast Mode

The theme automatically adapts to high contrast mode when the user has enabled it in their OS.

### Reduced Motion

Animations are automatically disabled when the user has enabled reduced motion in their OS.

## 📱 Responsive Design

All utilities are responsive with standard breakpoints:

```vue
<template>
  <!-- Mobile first approach -->
  <div class="text-sm md:text-base lg:text-lg xl:text-xl">
    Responsive text size
  </div>

  <!-- Grid that changes with screen size -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <!-- Items -->
  </div>

  <!-- Hide/show based on breakpoint -->
  <div class="hidden md:block">Desktop only</div>
  <div class="block md:hidden">Mobile only</div>
</template>
```

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🖨️ Print Styles

Print-specific utilities:

```vue
<template>
  <!-- Hidden when printing -->
  <nav class="no-print">Navigation</nav>

  <!-- Cards break correctly when printing -->
  <div class="pokemon-card">
    Card content (won't break across pages)
  </div>
</template>
```

## 🎨 Tailwind CSS Viewer

The Tailwind CSS viewer is enabled in development mode. Access it at:

```
http://localhost:3000/_tailwind/
```

This shows all available classes, colors, and utilities in an interactive interface.

## 📝 Custom Plugin Examples

### Creating a Custom Plugin

Add to `tailwind.config.ts`:

```typescript
plugins: [
  function ({ addComponents, theme }) {
    addComponents({
      '.my-component': {
        padding: theme('spacing.4'),
        backgroundColor: theme('colors.primary.600'),
        color: theme('colors.white'),
        borderRadius: theme('borderRadius.lg'),
      },
    });
  },
];
```

### Creating Custom Utilities

```typescript
plugins: [
  function ({ addUtilities }) {
    addUtilities({
      '.rotate-y-180': {
        transform: 'rotateY(180deg)',
      },
      '.preserve-3d': {
        'transform-style': 'preserve-3d',
      },
    });
  },
];
```

## 🚀 Performance Tips

1. **Use @apply sparingly** - Prefer utility classes in templates
2. **Purge unused styles** - Already configured automatically
3. **Use component classes** - For repeated patterns
4. **Optimize images** - Use Next-gen formats
5. **Lazy load components** - Use dynamic imports

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Forms Plugin](https://github.com/tailwindlabs/tailwindcss-forms)
- [Tailwind CSS Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

**Last Updated**: 2026-01-09
**Version**: 2.0.0 (Enterprise Configuration)
