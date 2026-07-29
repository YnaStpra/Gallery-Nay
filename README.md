# Yan Saputra Photography

A minimalist photography portfolio built with Next.js App Router, React 19, TypeScript, Prisma, PostgreSQL, Cloudinary, and Tailwind CSS.

The project is designed around the image itself: clean gallery browsing, immersive photo preview, stories, collections, and a small set of editorial tools for admin upload and photo management.

## Overview

This repository powers a personal photography website with:

- A gallery-first homepage
- Masonry photo browsing
- Photo preview / lightbox
- EXIF metadata
- RGB histogram
- Color palette extraction
- Editing preset support
- Before / After comparison
- Collections and albums
- Stories
- Search
- Favorites
- Download requests
- Admin upload and admin request management

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma
- PostgreSQL
- Cloudinary
- exifr
- node-vibrant
- lucide-react
- Leaflet / React Leaflet
- Recharts

## Key Features

### Public Site

- Responsive gallery homepage
- Masonry photo layout
- Photo preview / lightbox
- Previous and next navigation
- Zoom controls
- Keyboard shortcuts
- Search
- Collections pages
- Story pages
- Favorites
- Download request form
- Photo metadata sidebar
- RGB histogram
- Color palette extraction
- Editing preset display
- Before / After comparison modal
- Google Maps location link

### Admin

- Upload edited image to Cloudinary
- Optional original image upload for compare mode
- Optional LUT / preset upload
- Auto title generation from filename
- Auto slug generation
- EXIF auto-fill
- Admin photo manager
- Admin stories manager
- Admin download request review

## Project Structure

Important folders and files:

- `app/`
  - App Router pages, route handlers, and UI components
- `components/`
  - Shared photo components such as compare and histogram UI
- `src/lib/`
  - Data access, Cloudinary helpers, metadata parsing, and utilities
- `src/hooks/`
  - Reusable client hooks
- `prisma/`
  - Prisma schema and migrations

## Main Pages

- `/` gallery homepage
- `/admin` upload dashboard
- `/admin/stories` manage stories
- `/admin/requests` manage download requests
- `/stories` stories list
- `/stories/[slug]` story detail
- `/collections` collections list
- `/collections/[slug]` collection detail
- `/favorites` saved photos
- `/gear` gear page
- `/about` about page
- `/journal` journal page

## Photo Preview Capabilities

The photo preview includes:

- Metadata
- Histogram
- Color palette
- Editing preset details
- Download request panel
- Favorite toggle
- Share actions
- Zoom in / out / reset
- Before / After comparison, if original image is available

## Database

The app uses PostgreSQL through Prisma.

Primary models include:

- `Photo`
- `Collection`
- `Story`
- `Gear`
- `DownloadRequest`
- `PhotoOfTheDay`

The `Photo` model stores gallery metadata, Cloudinary references, EXIF data, preset data, and original-image fields for before/after comparison.

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
ADMIN_UPLOAD_KEY="..."
```

Optional:

```env
DATABASE_URL_UNPOOLED="postgresql://..."
```

## Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate deploy
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Notes

- The site is optimized for a gallery-first browsing experience.
- Admin features are intentionally separated from the public-facing experience.
- Photo uploads, LUT uploads, and original-image uploads are all stored through Cloudinary and persisted with Prisma.
- Keyboard shortcuts are centralized and reusable.

## License

Private repository. All rights reserved unless stated otherwise.
