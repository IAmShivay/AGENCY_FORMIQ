# FormiqStudio Theme Guide

## Current Default Theme
The website is now set to use **Cyberpunk** theme as the default, which features:
- **Primary Color**: Neon Purple (`270 100% 70%`)
- **Accent Color**: Neon Orange (`30 100% 60%`)
- **Background**: Deep Dark Blue (`222 84% 5%`)
- **Foreground**: Almost White (`210 40% 98%`)

## How to Change the Default Theme

### Method 1: Update Layout Configuration
To change the default theme for all users, edit `app/layout.tsx`:

```typescript
<ThemeProvider
  attribute="data-theme"
  defaultTheme="cyberpunk"  // Change this value
  enableSystem={false}
  themes={[
    'light', 'dark',
    'light-agency', 'light-creative', 'light-modern', 'light-tech', 'light-premium',
    'light-neon-cyan', 'light-neon-purple', 'light-neon-green', 'light-neon-pink',
    'neon-agency', 'cyberpunk', 'matrix', 'electric'
  ]}
  disableTransitionOnChange
>
```

### Available Themes

#### Light Themes
- `light` - Professional Blue
- `light-agency` - Agency Blue
- `light-creative` - Creative Teal
- `light-modern` - Modern Purple
- `light-tech` - Tech Green
- `light-premium` - Premium Blue

#### Light Neon Themes
- `light-neon-cyan` - Light with Neon Cyan
- `light-neon-purple` - Light with Neon Purple
- `light-neon-green` - Light with Neon Green
- `light-neon-pink` - Light with Neon Pink

#### Dark Themes
- `dark` - Professional Dark with Cyan
- `neon-agency` - Dark with Cyan/Pink Neon
- `cyberpunk` - Dark with Purple/Orange Neon ⭐ **Current Default**
- `matrix` - Dark with Green/Cyan Neon
- `electric` - Dark with Blue Neon

### Method 2: Programmatic Theme Change
Users can change themes using the theme switcher in the header or programmatically:

```typescript
import { useTheme } from 'next-themes';

const { setTheme } = useTheme();
setTheme('matrix'); // Change to any available theme
```

## Theme Color Variables
Each theme uses CSS custom properties that automatically adapt:

```css
--primary: /* Main brand color */
--accent: /* Secondary accent color */
--background: /* Page background */
--foreground: /* Text color */
--card: /* Card backgrounds */
--border: /* Border colors */
--muted: /* Muted text and backgrounds */
```

## Best Practices for Theme Consistency

### Use Theme Variables
Always use theme variables instead of hardcoded colors:
```css
/* ✅ Good */
className="bg-primary text-primary-foreground"
className="border-border text-muted-foreground"

/* ❌ Avoid */
className="bg-blue-500 text-white"
className="border-gray-200 text-gray-600"
```

### Component Classes
Use these utility classes for consistent theming:
- `.neon-glow-primary` - Neon glow effect
- `.premium-text-gradient` - Gradient text effect
- `.glass-effect` - Glassmorphism background
- `.neon-border` - Neon border effect

## Testing Themes
1. Use the theme switcher in the header
2. Visit `/theme-showcase` to see all themes
3. Test all pages with different themes
4. Ensure proper contrast and readability

## Customizing Themes
To create new themes, add them to `app/globals.css`:

```css
[data-theme="custom-theme"] {
  --background: /* your values */;
  --foreground: /* your values */;
  --primary: /* your values */;
  --accent: /* your values */;
  /* ... other variables */
}
```

Then add the theme to the provider in `app/layout.tsx`.
