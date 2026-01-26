# DeepTech Wheel Component - Implementation Guide

## Overview
The DeepTech Wheel is a 3D animated visual element representing the 5 civilizational pillars: Life, Matter, Motion, Intelligence, and Energy.

## File Structure

```
public/
└── deeptech/
    └── wheel/
        ├── README.md          # This file
        ├── fallback.html      # Pure HTML/CSS fallback version
        ├── life.jpg           # Sector 1 image (800x800px)
        ├── matter.jpg         # Sector 2 image (800x800px)
        ├── motion.jpg         # Sector 3 image (800x800px)
        ├── intelligence.jpg   # Sector 4 image (800x800px)
        ├── energy.jpg         # Sector 5 image (800x800px)
        └── sphere.jpg         # Central sphere image (400x400px)

src/
└── components/
    ├── DeeptechWheel.jsx      # React component
    └── DeeptechWheel.css      # Component styles
```

## Image Requirements

### Sector Images (5 required)
- **Dimensions:** 800x800px minimum (square aspect ratio)
- **Format:** JPG or PNG (JPG recommended for file size)
- **Style:** High contrast, visually striking, thematically appropriate
- **Processing:** Images are automatically filtered with `brightness(0.7) saturate(1.3)`

| Sector | Theme | Suggested Imagery |
|--------|-------|-------------------|
| Life | Biotech, DNA, Biology | DNA helix, cells, organic patterns |
| Matter | Materials, Hardware | Circuits, nanomaterials, crystals |
| Motion | Space, Aerospace | Rockets, satellites, nebulae |
| Intelligence | AI, Computing | Neural networks, data visualization |
| Energy | Power, Sustainability | Solar panels, fusion, lightning |

### Central Sphere Image
- **Dimensions:** 400x400px minimum (square aspect ratio)
- **Style:** Globe, Earth, or cosmic imagery
- **Processing:** Filtered with `brightness(0.8) saturate(1.2)`

## Replacing Placeholder Images

### Option 1: Using Local Images
1. Place your images in `public/deeptech/wheel/`
2. Update `src/components/DeeptechWheel.jsx`:

```jsx
const SECTOR_IMAGES = {
  life: '/deeptech/wheel/life.jpg',
  matter: '/deeptech/wheel/matter.jpg',
  motion: '/deeptech/wheel/motion.jpg',
  intelligence: '/deeptech/wheel/intelligence.jpg',
  energy: '/deeptech/wheel/energy.jpg',
}

const SPHERE_IMAGE = '/deeptech/wheel/sphere.jpg'
```

### Option 2: Using External URLs
Update the URLs in `DeeptechWheel.jsx` to point to your hosted images.

## Component Props

Currently the component has no props, but you can easily extend it:

```jsx
function DeeptechWheel({
  autoRotate = true,    // Enable/disable 3D sway animation
  showStars = true,     // Show/hide starfield particles
  starCount = 50,       // Number of stars
  hoverScale = 1.02,    // Scale on hover
}) {
  // ...
}
```

## CSS Customization

### Key CSS Variables (in DeeptechWheel.css)

```css
:root {
  --wheel-size: clamp(300px, 50vw, 900px);  /* Wheel diameter */
  --sphere-size: calc(var(--wheel-size) * 0.22);  /* Central sphere size */
  --glow-purple: rgba(168, 85, 247, 0.6);  /* Primary glow color */
  --glow-pink: rgba(236, 72, 153, 0.4);    /* Secondary glow */
  --glow-blue: rgba(99, 102, 241, 0.5);    /* Tertiary glow */
  --rotation-speed: 60s;  /* Full rotation speed */
  --sway-speed: 8s;       /* 3D sway animation duration */
}
```

### Adjusting Sector Positions
Each sector uses a `clip-path` polygon. The current layout divides the wheel into 5 equal 72° slices starting from the top-right (0°) and going clockwise.

## Animation Details

| Animation | Element | Duration | Description |
|-----------|---------|----------|-------------|
| wheelSway | Wheel wrapper | 8s | Subtle 3D rotation sway |
| glowPulse | Outer glow | 6s | Glow intensity pulse |
| sphereGlowPulse | Sphere glow | 4s | Inner glow pulse |
| spherePulse | Central sphere | 4s | Subtle scale pulse |
| starTwinkle | Stars | 3s | Opacity/scale twinkle |
| orbitSpin | Orbital rings | 20s/30s | Ring rotation |
| sectorPan1-5 | Sector images | 26-32s | Ken Burns pan effect |
| colorRotate | Color overlay | 40s | Slow color rotation |

## Responsive Breakpoints

| Breakpoint | Wheel Size | Notes |
|------------|------------|-------|
| > 1200px | 50vw (max 900px) | Full animations |
| 768-1200px | 60vw (max 700px) | Full animations |
| 480-768px | 80vw (max 500px) | Reduced animations, no starfield |
| < 480px | 90vw (max 380px) | Minimal animations |

## Accessibility

- `prefers-reduced-motion: reduce` disables all animations
- All images have alt text
- Component is decorative and doesn't affect page content flow

## Performance Considerations

1. **Image Optimization:** Compress sector images to ~50-100KB each
2. **Star Count:** Reduce `starCount` on lower-end devices
3. **Animation:** CSS animations are GPU-accelerated
4. **Mobile:** Animations are disabled on mobile for battery savings

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

Note: `clip-path` polygon and CSS perspective require modern browsers.

## Troubleshooting

### Images not displaying
- Check file paths are correct
- Ensure images are in the `public` folder
- Verify image format is supported

### Animations stuttering
- Reduce star count
- Disable Ken Burns effect on sectors
- Check browser hardware acceleration

### Wheel looks flat
- Verify `transform-style: preserve-3d` is not being overridden
- Check parent containers don't have `overflow: hidden`
- Ensure `perspective` is set on container
