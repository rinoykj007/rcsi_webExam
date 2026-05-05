# Animation Components Usage Guide

All animation components are optimized for **mobile performance** using Framer Motion.

## Import
```tsx
import { 
  PageEnter, 
  StaggerContainer, 
  StaggerItem, 
  FadeIn, 
  ScaleIn, 
  LoadingSpinner 
} from "@/components/animations";
```

---

## 1. **PageEnter** — Page entrance animation
Wrap entire page content for smooth fade-in entrance.

```tsx
<PageEnter delay={0}>
  <div>Your page content</div>
</PageEnter>
```

**Props:**
- `delay` (optional): Delay in seconds (default: 0)

---

## 2. **FadeIn** — Directional fade animation
Fade in from any direction.

```tsx
<FadeIn direction="up" delay={0.2} duration={0.5}>
  <div>Content fades in from bottom</div>
</FadeIn>
```

**Props:**
- `direction`: "up" | "down" | "left" | "right" (default: "up")
- `delay` (optional): Delay in seconds
- `duration` (optional): Animation duration (default: 0.5s)

---

## 3. **ScaleIn** — Scale animation
Grow from small to full size.

```tsx
<ScaleIn delay={0.1}>
  <button>Click me</button>
</ScaleIn>
```

**Props:**
- `delay` (optional): Delay in seconds
- `duration` (optional): Animation duration (default: 0.4s)

---

## 4. **StaggerContainer + StaggerItem** — List/Card animations
Animate multiple items with staggered timing.

```tsx
<StaggerContainer staggerDelay={0.1} delay={0.2}>
  <div className="space-y-4">
    {items.map((item) => (
      <StaggerItem key={item.id}>
        <Card>{item.title}</Card>
      </StaggerItem>
    ))}
  </div>
</StaggerContainer>
```

**Container Props:**
- `staggerDelay`: Delay between each item (default: 0.1s)
- `delay`: Initial delay before animation starts (default: 0)

**Item Props:**
- `index` (optional): For manual control

---

## 5. **LoadingSpinner** — Animated loader
Rotating spinner for loading states.

```tsx
<LoadingSpinner />
```

No props needed.

---

## Usage Examples

### Quiz Loading
```tsx
import { LoadingSpinner } from "@/components/animations";

{isLoading && (
  <div className="flex justify-center">
    <LoadingSpinner />
  </div>
)}
```

### Flashcard Animation
```tsx
import { ScaleIn } from "@/components/animations";

<ScaleIn>
  <div className="flashcard">{content}</div>
</ScaleIn>
```

### Quiz Options List
```tsx
import { StaggerContainer, StaggerItem } from "@/components/animations";

<StaggerContainer staggerDelay={0.05}>
  <div className="space-y-2">
    {options.map((option, i) => (
      <StaggerItem key={i}>
        <button className="option">{option}</button>
      </StaggerItem>
    ))}
  </div>
</StaggerContainer>
```

---

## Performance Notes

✅ **Optimized for mobile** — All animations use GPU acceleration  
✅ **Lightweight** — Framer Motion adds ~40KB to bundle  
✅ **Battery-friendly** — No continuous animations, only on interaction/mount  
✅ **Responsive** — Works great on all screen sizes

---

## Customization

You can extend these by editing the files:
- `PageEnter.tsx`
- `FadeIn.tsx`
- `ScaleIn.tsx`
- `StaggerContainer.tsx`
- `LoadingSpinner.tsx`
