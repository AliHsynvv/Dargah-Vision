# FloorPlan AI

An ultra-minimal, black & white premium UI platform that transforms 2D floor plans into 3D models and stunning interior designs using AI.

## 🎨 Design Philosophy

- **Pure Black & White**: Only `#000000` and `#FFFFFF` colors
- **Ultra-Minimal**: Clean, spacious, Apple-like aesthetic
- **High Contrast**: Sharp, readable, accessible design
- **Premium Feel**: Soft shadows, smooth micro-animations
- **Symmetrical Layout**: Perfectly balanced grid system

## ✨ Features

### Landing Page
- Hero section with animated CTAs
- Feature cards with hover effects
- Three-step process showcase
- Premium CTA section

### Dashboard
- Project management grid
- Search and filter functionality
- Status tracking (Completed, In Progress, Draft)
- Statistics overview
- Responsive card layout

### Workspace
- **3-Step Process**:
  1. Upload - Drag & drop floor plan upload
  2. Convert - AI-powered 2D to 3D conversion
  3. Interior - AI interior design generation
  
- **View Modes**: Toggle between 2D, 3D, and Interior views
- **Style Selection**: Multiple interior design styles
- **Customization**: Lighting and color scheme options
- **Progress Tracking**: Visual step indicators

### Component Library
- **Buttons**: Multiple variants (primary, secondary, outline) with icons
- **Cards**: Hoverable cards with smooth animations
- **Modal**: Backdrop blur with smooth transitions
- **Before/After Slider**: Interactive comparison slider
- **Upload Zone**: Drag & drop file upload with validation
- **Toggle**: Animated switch component

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
.
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard
│   ├── workspace/
│   │   └── page.tsx          # Workspace (3-step process)
│   ├── demo/
│   │   └── page.tsx          # Component demo
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Button.tsx            # Button component
│   ├── Card.tsx              # Card component
│   ├── Modal.tsx             # Modal component
│   ├── BeforeAfterSlider.tsx # Comparison slider
│   ├── UploadZone.tsx        # File upload
│   └── Toggle.tsx            # Toggle switch
├── public/                   # Static assets
└── package.json
```

## 🎯 Key Pages

- `/` - Landing page with hero and features
- `/dashboard` - Project management dashboard
- `/workspace` - Main workspace with 3-step process
- `/demo` - Component library showcase

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎨 Design System

### Colors
- **Black**: `#000000` - Primary background
- **White**: `#FFFFFF` - Primary foreground
- **White/10**: `rgba(255,255,255,0.1)` - Subtle backgrounds
- **White/20**: `rgba(255,255,255,0.2)` - Borders
- **White/60**: `rgba(255,255,255,0.6)` - Secondary text

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Sizes**: 
  - Headings: 6xl, 5xl, 3xl, 2xl
  - Body: xl, base, sm, xs

### Spacing
- Grid: Max-width containers (1600px, 1200px)
- Padding: 4, 6, 8, 12, 16 units
- Gaps: 4, 6, 8 units

### Animations
- **Duration**: 300ms standard, 600ms smooth
- **Easing**: ease-out, ease-in-out
- **Types**: fade-in, slide-up, scale-in, float

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are fully responsive with mobile-first approach.

## 🔧 Customization

### Adding New Components

Create new components in the `components/` directory:

```typescript
'use client'

import { motion } from 'framer-motion'

export default function NewComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-white/10 p-6"
    >
      {/* Your component */}
    </motion.div>
  )
}
```

### Modifying Colors

Update `tailwind.config.js` to adjust the color palette.

### Adding Animations

Use Framer Motion for smooth animations:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any questions or issues, please contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

