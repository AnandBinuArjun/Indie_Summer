# INDIE SUMMER — ONE DESIGN. ONE PIECE. NEVER AGAIN.

> *"We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again.*  
> *Some carry intricate handwork. Some carry faded colours. Some show the marks of another time. And that’s exactly what makes them beautiful.*  
> *Slow batches. Singular pieces. Zero waste. A second life for beautiful things."*

---

## Overview

**INDIE SUMMER** is a high-end luxury e-commerce platform built on **Next.js 16 (App Router)** with **React Server Components (RSC)**.

Inspired by premier minimalist fashion labels (such as [azarthelabel.com](https://azarthelabel.com/)), the experience emphasizes slow intentional craftsmanship, authentic Indian textile provenance (Varanasi Banarasi silk, Tamil Nadu brocades, Rajasthan handloom, and Bagru natural indigo), and sustainable zero-waste silhouettes.

---

## Key Features

- **Full Server-Side Rendering (SSR)**: Complete pre-rendering and dynamic SEO metadata (`generateStaticParams`, `generateMetadata`) across all routes:
  - `/` — Editorial Hero & Inaugural Drop (Vol. 001)
  - `/shop` — Atelier Collection with live category and auction filtering
  - `/product/[id]` — 1-of-1 Relic Details, textile specs, and 6-digit Indian PIN code air express delivery check
  - `/about` — The Atelier Philosophy & Zero-Waste Manifesto
  - `/lookbook` — Museum archive of past claimed pieces
  - `/journal` — 35mm coastal dispatches from Varanasi and Goa
  - `/faq` — Client care, vintage silk care, and courier logistics
- **Atelier Live Bidding & Auctions (Min ₹500 Increment)**:
  - Select archival relics feature live auction bidding with real-time countdown timers.
  - Strict minimum increment enforcement (`minBidIncrementINR: 500`).
  - Interactive quick increments (`+₹500`, `+₹1,000`, `+₹2,500`, `+₹5,000`) and custom bid validation.
  - Chronological **Live Archival Bid History Feed** with high-bid badges and patron locations.
- **Universal Multi-Currency Switcher**:
  - Native default in Indian Rupees (`INR ₹`).
  - Dynamic currency conversion for international patrons: `USD ($)`, `EUR (€)`, `GBP (£)`, and `AED`.
- **Slide-out Cart & Wishlist Drawers**:
  - Real-time cart calculations, coupon code discount engine (`INDIE10` for 10% off), and free Pan-India air shipping progress bar.
- **Encrypted Checkout Modal**:
  - Full Indian payment suite: UPI / QR Code (GPay, PhonePe, Paytm, BHIM), RuPay / Visa / Mastercard / Amex, and NetBanking.

---

## Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **Core**: React 19, JavaScript ESNext
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations
- **Typography**: Anton, Fraunces Serif, Space Grotesk, Plus Jakarta Sans
- **Icons**: Lucide React
- **Celebration Effects**: Canvas-Confetti

---

## Getting Started

### Prerequisites

- Node.js `v18.17` or later (tested on `v21.7.2`)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AnandBinuArjun/Indie_Summer.git
cd Indie_Summer

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Building for Production

```bash
# Compile and prerender SSR pages
npm run build

# Start production server
npm start
```

---

## License

© INDIE SUMMER ATELIER. All rights reserved. One Design. One Piece. Never Again.
