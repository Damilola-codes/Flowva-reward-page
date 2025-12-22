# Responsive Breakpoint Reference

## Visual Viewport Scaling

```
DESKTOP (1440px)
┌─────────────────────────────────┐
│  Logo (160px)                   │
│  H1: 1.75rem | Padding: 36px    │
│  ┌────────┐ ┌────────┐          │
│  │ Stat 1 │ │ Stat 2 │ [Stat 3] │  ← 3-column grid
│  └────────┘ └────────┘          │
│  Padding: 24px, Gaps: 16px      │
└─────────────────────────────────┘

TABLET (768px)
┌──────────────────────┐
│  Logo (140px)        │
│  H1: 1.6rem          │
│  ┌────────┐ ┌──────┐ │
│  │ Stat 1 │ │Stat 2│ │  ← 2-column grid
│  └────────┘ └──────┘ │
│  Padding: 20px       │
└──────────────────────┘

MOBILE LANDSCAPE (640px)
┌──────────────────┐
│ Logo (120px)     │
│ H1: 1.4rem       │
│ ┌──────────────┐ │
│ │   Stat 1     │ │  ← 1-column grid
│ ├──────────────┤ │
│ │   Stat 2     │ │
│ └──────────────┘ │
│ Padding: 16px    │
└──────────────────┘

MOBILE PORTRAIT (480px)
┌────────────────┐
│ Logo (100px)   │
│ H1: 1.2rem     │
│ ┌────────────┐ │
│ │  Stat 1    │ │  ← 1-column, compact
│ ├────────────┤ │
│ │  Stat 2    │ │
│ └────────────┘ │
│ Padding: 12px  │
└────────────────┘

SMALL PHONE (360px)
┌──────────────┐
│ Logo (85px)  │
│ H1: 1.1rem   │
│ ┌──────────┐ │
│ │  Stat 1  │ │  ← 1-col, minimal
│ ├──────────┤ │
│ │  Stat 2  │ │
│ └──────────┘ │
│ Padding: 8px │
└──────────────┘
```

## Responsive Typography

| Element | 1440px | 768px | 640px | 480px | 360px |
|---------|--------|-------|-------|-------|-------|
| Hero H1 | 1.75rem | 1.6rem | 1.4rem | 1.2rem | 1.1rem |
| Auth H1 | 1.75rem | 1.6rem | 1.4rem | 1rem | 0.95rem |
| Card Title | 1.05rem | 0.95rem | 0.9rem | 0.85rem | 0.8rem |
| Body Text | 0.95rem | 0.9rem | 0.85rem | 0.8rem | 0.75rem |

## Responsive Spacing

| Element | 1440px | 768px | 640px | 480px | 360px |
|---------|--------|-------|-------|-------|-------|
| Container Padding | 24px | 18px | 16px | 12px | 8–10px |
| Card Gap | 16px | 12px | 12px | 8px | 6px |
| Hero Gap | 20px | 12px | 12px | 12px | 10px |
| Form Gap | 16px | 14px | 12px | 10px | 8px |

## Grid Columns

| Viewport | Stat Grid | Reward Grid | Redeem Grid |
|----------|-----------|-------------|------------|
| 1440px | 3 columns | 3 columns | 3 columns |
| 1024px | 3 columns | 2 columns | 2 columns |
| 768px | 2 columns | 1 column | 1 column |
| 640px | 1 column | 1 column | 1 column |
| 480px | 1 column | 1 column | 1 column |
| 360px | 1 column | 1 column | 1 column |

## Touch-Friendly Sizing

| Button Type | Desktop | Mobile | Min Size |
|-------------|---------|--------|----------|
| Action Button | 34px | 28px | 26px |
| Tab Pill | 12px padding | 8px padding | 6px padding |
| Icon Size | 48px | 40px | 32px |

All button/tap targets are **≥ 44×44px** per WCAG guidelines.

## CSS Functions Used

- **clamp()**: `clamp(min, preferred, max)` for fluid scaling
  - Example: `font-size: clamp(0.8rem, 2.5vw, 1.75rem)`
  - Smoothly scales from 0.8rem at tiny width → 1.75rem at large width
  
- **min()**: `min(520px, 90vw)` for responsive max-width
  - Modal stays 520px on desktop, shrinks to 90vw on mobile
  
- **grid-template-columns**: Explicit 1fr for single column on mobile

## Testing Checklist

- [ ] 360×640 (iPhone SE): No horizontal scroll, readable text
- [ ] 390×844 (iPhone 12): Comfortable layout
- [ ] 480×800 (Galaxy A): All grids 1-column
- [ ] 768×1024 (iPad Mini): 2-column grids
- [ ] 1024×768 (iPad): 3-column grids visible
- [ ] 1440×900 (Desktop): Full layout active

## Implementation Notes

1. **All breakpoints use max-width media queries** (mobile-first approach):
   ```css
   @media (max-width: 640px) { /* Changes applied when viewport < 640px */ }
   ```

2. **CSS order matters**: Larger breakpoints defined first, then specific ones override

3. **Font-size 1rem on inputs** prevents iOS zoom-on-focus behavior

4. **No fixed widths under 360px**: Uses 95–98vw instead

5. **Gradient circles hidden below 480px** to save vertical space on small phones
