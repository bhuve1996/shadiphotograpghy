# Wedding Photography & Cinema Showcase Website — Readme

## 🌟 Overview
A bespoke, luxury-tier wedding photography and cinematography showcase web platform tailored for grand destination weddings (palaces, forts, lake villas). Designed for fine-art presentation with seamless support for local assets (`/public` folder or direct drag-and-drop local uploads) and architectural readiness for remote cloud storage (AWS S3 + CloudFront).

---

## 📽️ Key Features Built & Tested

1. **Luxury Editorial Atelier Design:**
   - Dark onyx / champagne gold color palette, Cormorant Garamond serif and Plus Jakarta Sans typography.
   - Smooth hover interactions, glowing ambient backlights, and responsive masonry layout.

2. **High-End 4K Cinema Player (`HighEndVideoPlayer.tsx`):**
   - Custom-crafted HTML5 luxury cinema player controls.
   - Ambient cinema back-glow, 4K Ultra HD badge, play/pause, instant replay, volume slider with mute toggle, progress seekbar, and fullscreen toggle.
   - Dedicated Cinema Theatre mode and side playlist vault.

3. **Event Categorization & Archive Exploration:**
   - Categorized by event milestones:
     - **Pre-Wedding**
     - **Haldi** (marigold showers & candid moments)
     - **Mehendi** (henna & boho celebrations)
     - **Sangeet** (stage performances & dance revelries)
     - **Wedding Ceremony (Phere)** (sacred rituals & Sindoor moments)
     - **Reception** (grand ballroom gala & cake-cutting)
     - **Portraits** (regal bridal & groom close-ups)
   - Dynamic counter badge for each event category.
   - Format toggles: **All**, **Photos**, or **Cinema Films**.
   - Live search by couple name, location, and keywords.

4. **Signature Wedding Collections:**
   - Highlight cards for royal couple collections (e.g., *Aarav & Meera @ Taj Lake Palace, Udaipur*; *Dev & Natasha @ Six Senses Fort Barwara*; *Kabir & Rhea @ Villa Balbiano, Lake Como*).
   - Instant "Play Film" and "View Story" filters.

5. **Interactive Fullscreen Lightbox (`MediaLightbox.tsx`):**
   - High-res image & video viewing with keyboard shortcuts (`Esc`, `ArrowLeft`, `ArrowRight`).
   - Download asset button, couple tags, location pins, and pagination counter.

6. **Local Upload & Cloud-Ready Engine (`UploadModal.tsx` & `mediaService.ts`):**
   - **Local File Uploads:** Drag-and-drop or file picker for images and videos with instant local preview and categorization.
   - **Public / Cloud URLs:** Direct support for `/public` filenames or remote S3/CloudFront URLs.
   - **Persistent Storage:** Browser storage with factory-reset restoration options.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

---

## ☁️ Migrating to AWS S3 / Cloudflare R2 / CloudFront (Future Roadmap)
The schema in `src/types/media.ts` and `src/services/mediaService.ts` was engineered for cloud storage:
- Simply update `mediaService.ts` to connect to an AWS S3 Presigned URL endpoint or fetch the media catalog JSON from an S3 bucket / API.
- All media components (`MediaCard`, `HighEndVideoPlayer`, `MediaLightbox`) accept any standard URL or CDN endpoint without UI modification.
