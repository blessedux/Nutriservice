# Video Bandwidth Optimization Test Results

**Date:** July 17, 2026  
**Branch:** `fix/video-bandwidth-fallbacks`  
**Test Scenario:** Slow 3G network throttling (50 kbps, 2000ms latency)

## Test Summary

Both branches display backgrounds under low bandwidth, but the **fix branch reduces initial payload by ~13 MB** and provides instant visual feedback via poster images.

## Detailed Comparison

### Main Branch (Before Optimization)

**Network Behavior:**
- Aggressive prefetch: ~13 MB of division videos during preloader
- All 4 division videos mount with `preload="auto"` on productos page
- Stats video loads immediately on homepage mount
- No capability detection for slow connections
- No explicit poster fallbacks

**Visual Result:**
- Videos eventually load and display
- Blank/dark backgrounds until video decodes
- Long initial load time

**Bandwidth Impact:**
- First visit: ~16-18 MB of video requests
- No distinction between high/low bandwidth scenarios

### Fix Branch (After Optimization)

**Network Behavior:**
- ✅ No aggressive prefetch (removed 13 MB preloader warming)
- ✅ Lazy loading via IntersectionObserver (160px rootMargin)
- ✅ Only active division video mounts
- ✅ Capability detection (`saveData`, slow-2g/2g, low memory/CPU)
- ✅ WebP poster fallbacks for all bg videos

**Visual Result:**
- ✅ Instant poster visibility (no blank backgrounds)
- ✅ Smooth fade to video when loaded
- ✅ Stable fallback if video fails/times out (3s mobile, 5s desktop)
- ✅ Videos skipped entirely on saveData/slow connections

**Bandwidth Impact:**
- First visit: Only videos near viewport (~2-3 MB initially)
- Stats video waits for scroll into view
- Industries video lazy loads when scrolled near
- Subsequent visits: `Cache-Control: immutable` headers

## Key Improvements

### 1. Removed Aggressive Prefetch
**Before:** `site-experience.tsx` warmed all division videos (~13 MB)  
**After:** Removed blanket preload; videos load on-demand

### 2. Lazy Loading Everywhere
- Hero: Loads clip 1 first (clips 2-3 deferred)
- Stats section: IntersectionObserver (was immediate)
- Industries: IntersectionObserver (was already good, now shared primitive)
- Division videos: Only active division mounts

### 3. Poster Fallbacks
- Extracted WebP posters for all videos
- Wired into `public-assets.ts`, `hero-video-sequence.ts`, `productos-division-media.ts`
- Visible instantly while video loads/fails

### 4. Capability Detection
New `lib/video-capabilities.ts`:
- `prefers-reduced-motion`
- `navigator.connection.saveData`
- Slow connections (2g, slow-2g)
- Low device memory (≤4 GB)
- Low CPU threads (≤4)

### 5. Browser Caching
`next.config.ts` headers:
```
Cache-Control: public, max-age=31536000, immutable
```
For all `.webm`, `.mp4`, `.webp` assets.

### 6. Cleanup
- Removed 7.5 MB orphan videos (`mascotas.webm`, `aves-chickens.webm`)

## Files Changed

**New Infrastructure:**
- `lib/video-capabilities.ts`
- `hooks/use-resilient-bg-video.ts`
- `components/resilient-bg-video.tsx`

**Modified Components:**
- `components/division-video-bg.tsx` (capability check + poster support)
- `components/division-videos-bg.tsx` (single active video)
- `components/home-stats-section.tsx` (lazy load via ResilientBgVideo)
- `components/industries-section.tsx` (refactored to shared primitive)
- `components/site-experience.tsx` (removed prefetch)
- 3 industry page components (poster props)

**Updated Config/Assets:**
- `lib/public-assets.ts` (poster paths)
- `lib/hero-video-sequence.ts` (poster per clip)
- `lib/productos-division-media.ts` (poster per division)
- `next.config.ts` (cache headers)

## Build Status

✅ Production build passes (`bun run build`)

## Recommendation

**Merge `fix/video-bandwidth-fallbacks` into main.**

The optimizations are non-breaking, preserve all visual quality under good connections, and provide significant bandwidth savings + reliability improvements for users with poor network conditions or older devices.
