# Movie Streaming Web Application
## Full Agent Implementation Specification

> Build a production-quality, highly interactive movie and TV discovery/streaming web application using **TMDB as the metadata/catalog API** and **Vidking as the playback provider**.
>
> The experience should feel comparable in polish and responsiveness to modern streaming platforms such as Netflix, Disney+, Prime Video, Apple TV+, and especially the browsing simplicity and fluid UX of Cineby.
>
> Do **not** make a cheap Netflix clone. Build an original interface inspired by modern streaming UX patterns.

---

# 1. Primary Goal

Build a responsive web application where users can:

- Browse trending movies and TV shows.
- Browse popular content.
- Browse Top 10 content.
- Browse top-rated content.
- Browse movies and shows by genre.
- Search movies and TV shows instantly.
- Open rich movie/show detail views.
- View casts, ratings, descriptions, trailers and related titles.
- Browse TV seasons and episodes.
- Play movies.
- Play individual TV episodes.
- Automatically remember playback position.
- Continue watching unfinished content.
- Maintain a personal watchlist.
- Maintain recent watch history.
- Navigate comfortably on:
  - desktop
  - laptops
  - tablets
  - phones
- Experience smooth animations and transitions.
- Use keyboard controls where appropriate.
- Resume watching content from the exact previous timestamp.

The product should feel like an actual streaming product rather than a database UI displaying TMDB cards.

---

# 2. API Responsibilities

There are two main external data sources.

## TMDB

TMDB is the **catalog and metadata layer**.

Use TMDB for:

- Movie metadata
- TV metadata
- Posters
- Backdrops
- Logos
- Cast
- Crew
- Genres
- Ratings
- Trending data
- Popular movies
- Popular TV
- Top-rated movies
- Top-rated TV
- Search
- Recommendations
- Similar titles
- Seasons
- Episodes
- Release information
- Trailers/videos
- Provider availability
- Content discovery

TMDB IDs must be treated as the application's canonical media IDs.

Do not invent a second movie ID system.

---

## Vidking

Vidking is the **playback provider adapter**.

Movies:

```text
https://www.vidking.net/embed/movie/{tmdbId}
```

TV:

```text
https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}
```

Supported player parameters currently include:

```text
color
autoPlay
nextEpisode
episodeSelector
progress
```

Example:

```text
/embed/movie/27205?color=e50914&autoPlay=true
```

TV:

```text
/embed/tv/1396/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true
```

Resume:

```text
/embed/movie/27205?progress=1275
```

`progress` here represents the starting playback time in seconds.

---

# 3. Important Provider Architecture

DO NOT scatter Vidking URLs throughout components.

Create a playback provider abstraction.

Structure:

```text
lib/
└── playback/
    ├── types.ts
    ├── provider.ts
    └── providers/
        └── vidking.ts
```

Example concept:

```ts
interface PlaybackRequest {
  tmdbId: number
  mediaType: "movie" | "tv"
  season?: number
  episode?: number
  startTime?: number
  autoplay?: boolean
}

interface PlaybackProvider {
  buildPlayerUrl(request: PlaybackRequest): string
}
```

Vidking implements this interface.

The rest of the application must NOT know how Vidking constructs URLs.

This allows another licensed player/provider to replace Vidking later without rebuilding the application.

---

# 4. Content Rights Rule

The playback system must remain independent from the catalog.

Do not implement:

- DRM bypassing
- M3U8 extraction
- video scraping
- stream extraction
- media downloading
- anti-adblock circumvention
- player security bypassing

Only embed playback sources the application is legally permitted to use.

If Vidking cannot be used for a particular deployment, replacing it must only require replacing:

```text
lib/playback/providers/vidking.ts
```

The TMDB browsing application should continue working independently.

---

# 5. Recommended Technology

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
Framer Motion / Motion
Lucide Icons
Zod
```

Optional:

```text
TanStack Query
Zustand
```

Use Next.js App Router.

Prefer:

- React Server Components for initial content retrieval.
- Client Components only for interactive behavior.
- Server-side TMDB requests.
- Route Handlers for client-triggered requests such as live search.

Do not turn the entire application into client components.

---

# 6. Project Structure

Recommended structure:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── movies/
│   │   └── page.tsx
│   │
│   ├── tv/
│   │   └── page.tsx
│   │
│   ├── discover/
│   │   └── page.tsx
│   │
│   ├── search/
│   │   └── page.tsx
│   │
│   ├── my-list/
│   │   └── page.tsx
│   │
│   ├── history/
│   │   └── page.tsx
│   │
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── tv/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── watch/
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── tv/
│   │       └── [id]/
│   │           └── [season]/
│   │               └── [episode]/
│   │                   └── page.tsx
│   │
│   └── api/
│       ├── search/
│       │   └── route.ts
│       └── discover/
│           └── route.ts
│
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   │
│   ├── hero/
│   │   ├── hero.tsx
│   │   └── hero-actions.tsx
│   │
│   ├── media/
│   │   ├── media-card.tsx
│   │   ├── media-row.tsx
│   │   ├── top-ten-card.tsx
│   │   ├── media-grid.tsx
│   │   └── media-skeleton.tsx
│   │
│   ├── details/
│   │   ├── media-details.tsx
│   │   ├── cast-row.tsx
│   │   ├── recommendation-row.tsx
│   │   └── metadata.tsx
│   │
│   ├── tv/
│   │   ├── season-selector.tsx
│   │   ├── episode-card.tsx
│   │   └── episode-list.tsx
│   │
│   ├── player/
│   │   ├── player.tsx
│   │   ├── player-shell.tsx
│   │   └── next-episode.tsx
│   │
│   └── search/
│       ├── search-dialog.tsx
│       └── search-results.tsx
│
├── lib/
│   ├── tmdb/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── images.ts
│   │   ├── normalize.ts
│   │   └── types.ts
│   │
│   ├── playback/
│   │   ├── provider.ts
│   │   └── providers/
│   │       └── vidking.ts
│   │
│   ├── progress/
│   │   ├── storage.ts
│   │   └── types.ts
│   │
│   ├── watchlist/
│   │   └── storage.ts
│   │
│   └── utils/
│
├── hooks/
│   ├── use-player-progress.ts
│   ├── use-watchlist.ts
│   └── use-search.ts
│
└── types/
```

Keep responsibilities separated.

---

# 7. Environment Variables

Create:

```env
TMDB_API_READ_TOKEN=
NEXT_PUBLIC_DEFAULT_REGION=
NEXT_PUBLIC_VIDKING_BASE_URL=https://www.vidking.net
NEXT_PUBLIC_PLAYER_COLOR=
```

The TMDB token is SECRET.

Never expose:

```text
TMDB_API_READ_TOKEN
```

inside a Client Component.

Never use:

```text
NEXT_PUBLIC_TMDB_API_READ_TOKEN
```

TMDB requests containing authentication should be performed server-side.

---

# 8. TMDB Client

Create one reusable client:

```text
lib/tmdb/client.ts
```

Concept:

```ts
const BASE_URL = "https://api.themoviedb.org/3"

export async function tmdb<T>(
  path: string,
  params?: Record<string, string | number | boolean>,
  options?: {
    revalidate?: number
  }
): Promise<T> {
  // build URL
  // attach Authorization Bearer token
  // fetch
  // validate response
  // throw typed error on failure
  // return parsed response
}
```

Do not duplicate fetch code in individual components.

---

# 9. TMDB Endpoints

## Trending

```http
GET /trending/movie/day
GET /trending/movie/week
GET /trending/tv/day
GET /trending/tv/week
GET /trending/all/day
```

Use these for:

- hero
- Trending Today
- Top 10
- Trending This Week

---

# 10. Popular

Movies:

```http
GET /movie/popular
```

TV:

```http
GET /tv/popular
```

Use these for major homepage rows.

---

# 11. Top Rated

```http
GET /movie/top_rated
GET /tv/top_rated
```

---

# 12. Search

Use:

```http
GET /search/multi
```

Example:

```text
/search/multi?query=batman&include_adult=false
```

Multi-search can contain:

```text
movie
tv
person
```

The streaming search UI should primarily show:

```text
movie
tv
```

People may optionally appear in a secondary search category.

---

# 13. Discover

Use:

```http
GET /discover/movie
GET /discover/tv
```

Support filters such as:

- genre
- year
- rating
- language
- provider
- popularity
- release date

Example conceptual query:

```text
/discover/movie
?with_genres=28
&sort_by=popularity.desc
&include_adult=false
```

This is how genre pages should be built.

Do NOT manually download the complete TMDB catalog.

---

# 14. Genres

Load genres dynamically:

```http
GET /genre/movie/list
GET /genre/tv/list
```

Use them for:

- navigation
- discover filters
- genre rails
- metadata chips

---

# 15. Movie Details

Use:

```http
GET /movie/{id}
```

Prefer using TMDB's `append_to_response` feature.

Example concept:

```text
/movie/{id}
?append_to_response=
videos,
credits,
recommendations,
images,
release_dates,
watch/providers
```

If an appended endpoint creates problems, request that piece separately rather than breaking the entire details page.

---

# 16. TV Details

Use:

```http
GET /tv/{id}
```

Request related data such as:

```text
videos
images
recommendations
aggregate_credits
content_ratings
watch/providers
```

TV detail pages must also display:

- number of seasons
- number of episodes
- status
- first air date
- latest season
- genres
- cast

---

# 17. TV Seasons

When the user selects a season:

```http
GET /tv/{seriesId}/season/{seasonNumber}
```

The response should be used to construct episode cards.

Each episode card should include:

- episode number
- episode name
- still image
- overview
- runtime
- air date
- rating
- watch progress if previously watched

---

# 18. TMDB Image Handling

Create:

```text
lib/tmdb/images.ts
```

Do not concatenate image URLs throughout the UI.

Example API:

```ts
tmdbImage.poster(path, "w500")
tmdbImage.backdrop(path, "w1280")
tmdbImage.profile(path, "w185")
tmdbImage.original(path)
```

Use sensible image sizes.

### Poster

Cards:

```text
w342
w500
```

### Backdrop

Hero:

```text
w1280
original
```

depending on screen size.

### Profile

Cast:

```text
w185
```

Do not load original 4K assets for every thumbnail.

---

# 19. Normalized Media Model

TMDB movies and TV shows use different field names.

Movies:

```text
title
release_date
```

TV:

```text
name
first_air_date
```

Normalize them.

Example:

```ts
interface MediaItem {
  id: number
  mediaType: "movie" | "tv"

  title: string
  originalTitle?: string

  overview: string

  posterPath?: string
  backdropPath?: string

  year?: number

  voteAverage: number
  voteCount: number

  genreIds: number[]

  popularity?: number
}
```

Components should consume `MediaItem`.

They should not repeatedly check:

```ts
movie.title ?? tv.name
```

---

# 20. Homepage UX

The homepage is extremely important.

It should feel cinematic immediately.

Structure:

```text
Header

Featured Hero

Continue Watching        <- only when progress exists

Top 10 Today

Trending Today

Popular Movies

Popular TV Shows

Top Rated Movies

Action

Comedy

Sci-Fi

Horror

Drama

Recently Added / Discover

Footer
```

Do not render every possible section simultaneously if there is no useful content.

---

# 21. Featured Hero

The hero should occupy approximately:

Desktop:

```text
68–78vh
```

Mobile:

```text
55–65vh
```

Use:

```text
backdrop image
```

NOT poster art.

Overlay the image using layered gradients.

Example visual hierarchy:

```text
                background artwork

          title / logo

          2026     8.2     TV-MA     3 Seasons

          Short overview text spanning 2–3 lines.

          [ ▶ Play ] [ + My List ] [ More Info ]
```

Use:

```text
linear gradient bottom -> page background
linear gradient left -> transparent
subtle top gradient
```

The transition from hero into page content should feel seamless.

Avoid a visible rectangle around the hero.

---

# 22. Hero Content Rotation

Optionally rotate between approximately:

```text
3–5 featured titles
```

Do not rotate rapidly.

Recommended interval:

```text
8–12 seconds
```

Pause rotation while:

- tab is hidden
- user is interacting with hero
- reduced-motion is enabled

Provide subtle indicators.

Do not use a loud traditional carousel.

---

# 23. Movie/TV Content Rows

Rows should behave like professional streaming rails.

Desktop:

```text
[ < ]  card card card card card card  [ > ]
```

Mobile:

```text
horizontal touch scrolling
```

Support:

- smooth scroll
- drag
- mouse wheel where sensible
- touch
- arrow buttons
- keyboard focus

Cards must partially indicate that additional content exists beyond the viewport.

---

# 24. Media Card

Poster card ratio:

```text
2:3
```

Desktop hover behavior:

1. Slight scale increase.
2. Poster becomes brighter.
3. Shadow appears.
4. Information overlay fades in.
5. Play button appears.
6. My List control appears.
7. Rating/year/type appear.

Keep hover animation around:

```text
150–220ms
```

Do not use massive card expansion that pushes surrounding content.

Mobile has no hover.

On mobile:

- tap opens details
- secondary controls should remain accessible

---

# 25. Top 10 Cards

Create a special component:

```text
TopTenCard
```

Visual concept:

```text
1 [POSTER]
2 [POSTER]
3 [POSTER]
```

The number should be huge and partially behind the poster.

Numbers should feel like typography rather than simple badges.

This row is intentionally more visually dramatic than regular rails.

---

# 26. Detail Experience

Clicking a card should open a deeply designed details experience.

Desktop can initially use a cinematic modal/drawer.

The canonical URL must still exist:

```text
/movie/{id}
```

or:

```text
/tv/{id}
```

This permits:

- sharing
- refreshing
- deep links
- browser navigation

Advanced Next.js implementation may use route interception to achieve:

```text
card click -> modal
direct URL -> full details page
```

---

# 27. Detail Page Layout

Top:

```text
large backdrop

gradient overlays

movie logo/title

Play

My List

metadata
```

Below:

```text
overview

genres

release year

runtime

rating

cast

director / creator

trailers

seasons if TV

recommendations

similar content
```

Do not show the data as a boring table.

Metadata should be visually integrated into the page.

---

# 28. TV Detail UX

For TV:

```text
Season 1 ▼
```

Opening the season selector should show available seasons.

Episode cards:

```text
--------------------------------------------------
[ Episode Still ]   Episode 1 · 52 min

                     Episode Name

                     Description...
--------------------------------------------------
```

Show watch progress beneath partially watched episodes.

Example:

```text
███████████░░░░░░░ 63%
```

Clicking an episode begins playback.

---

# 29. Search UX

Search needs to feel instant.

Desktop:

Clicking search opens a large search interface.

Keyboard shortcut:

```text
/
```

Escape:

```text
ESC
```

closes it.

Input:

```text
Search movies and TV shows...
```

Debounce:

```text
250–350ms
```

Do not call TMDB on every keystroke without debounce.

Requirements:

- minimum query length: 2
- loading skeleton
- empty state
- error state
- clear button
- keyboard navigation
- arrow key navigation where reasonable

---

# 30. Search Results

Results should use poster cards rather than plain text.

Example:

```text
BATMAN

Movies

[poster] [poster] [poster] [poster]

TV Shows

[poster] [poster]
```

Optionally show:

```text
Movies
TV Shows
People
```

filters.

---

# 31. Discover Page

Build a full discovery screen.

Filters:

```text
Type
Genre
Year
Rating
Language
Sort
```

Desktop filters can appear as chips or dropdowns.

Mobile filters should open a bottom sheet.

Example:

```text
Movies   TV
Action   Comedy   Drama
2026
Rating 7+
Popularity ↓
```

Changing filters should update the URL.

Example conceptual URL:

```text
/discover?type=movie&genre=28&year=2026
```

This makes discovery shareable and browser-navigation friendly.

---

# 32. Vidking Player Component

Create:

```text
components/player/player.tsx
```

The page should pass:

```ts
<Player
  tmdbId={27205}
  mediaType="movie"
/>
```

or:

```ts
<Player
  tmdbId={1396}
  mediaType="tv"
  season={2}
  episode={5}
/>
```

The component calls the playback provider internally.

Never generate player URLs from page components.

---

# 33. Player URL Builder

Example conceptual implementation:

```ts
function buildVidkingUrl(request: PlaybackRequest) {
  const base = process.env.NEXT_PUBLIC_VIDKING_BASE_URL

  let path: string

  if (request.mediaType === "movie") {
    path = `/embed/movie/${request.tmdbId}`
  } else {
    path =
      `/embed/tv/${request.tmdbId}` +
      `/${request.season}` +
      `/${request.episode}`
  }

  const params = new URLSearchParams()

  params.set("color", PLAYER_COLOR)
  params.set("autoPlay", String(request.autoplay ?? true))

  if (request.mediaType === "tv") {
    params.set("nextEpisode", "true")
    params.set("episodeSelector", "true")
  }

  if (request.startTime) {
    params.set("progress", String(Math.floor(request.startTime)))
  }

  return `${base}${path}?${params}`
}
```

---

# 34. Player Layout

The watch page should be dramatically simpler than browsing pages.

Use:

```text
black background
minimal navigation
maximum player area
```

Desktop:

```text
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│                PLAYER                      │
│                                            │
│                                            │
└────────────────────────────────────────────┘

Movie / Episode Name

Episode controls

Recommendations
```

Allow theater-style viewing.

Do not surround the player with unnecessary cards or bright backgrounds.

---

# 35. Player iframe

Use responsive aspect ratio:

```text
16:9
```

Example:

```tsx
<div className="aspect-video w-full">
  <iframe
    src={playerUrl}
    className="h-full w-full"
    allowFullScreen
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
  />
</div>
```

Make sure:

- fullscreen works
- mobile fullscreen works where browser permits
- iframe does not remount unnecessarily

---

# 36. Critical Player Rule

DO NOT regenerate the iframe every time progress state changes.

This will restart the video.

Only recreate the player when the actual media identity changes:

```text
tmdbId
season
episode
```

Use stable component keys.

Bad:

```tsx
key={Math.random()}
```

Good:

```tsx
key={`${tmdbId}-${season ?? 0}-${episode ?? 0}`}
```

---

# 37. Playback Progress

Vidking sends player messages to the parent window.

Implement:

```ts
window.addEventListener("message", ...)
```

Handle player events such as:

```text
timeupdate
play
pause
ended
seeked
```

Expected data conceptually contains:

```ts
{
  type: "PLAYER_EVENT",
  data: {
    event: "timeupdate",
    currentTime: 120,
    duration: 7200,
    progress: 1.6,
    id: "299534",
    mediaType: "movie",
    season: 1,
    episode: 1,
    timestamp: 123456789
  }
}
```

---

# 38. Secure postMessage Handling

DO NOT blindly trust messages coming from any window.

Validate origin.

Concept:

```ts
if (event.origin !== "https://www.vidking.net") {
  return
}
```

Then validate the payload.

Use Zod or manual validation.

Do not execute arbitrary values received from iframe messages.

---

# 39. Watch Progress Data Model

Store:

```ts
interface WatchProgress {
  mediaType: "movie" | "tv"

  tmdbId: number

  season?: number
  episode?: number

  currentTime: number
  duration: number
  percentage: number

  updatedAt: number
}
```

Storage key:

Movie:

```text
movie:27205
```

TV:

```text
tv:1396:2:5
```

---

# 40. Local-First Progress Storage

Version 1 should work without an account.

Use:

```text
localStorage
```

Suggested structure:

```text
stream_progress
```

Value:

```json
{
  "movie:27205": {},
  "tv:1396:1:1": {}
}
```

Create a storage service.

Do NOT directly access localStorage from random components.

Use:

```text
lib/progress/storage.ts
```

---

# 41. Progress Write Strategy

`timeupdate` may occur frequently.

Do NOT write localStorage dozens of times per second.

Throttle saves.

Recommended:

```text
every 5–10 seconds
```

Always immediately save on:

```text
pause
seeked
page unload
```

On:

```text
ended
```

mark as completed.

---

# 42. Continue Watching

Show content when:

```text
progress > 2%
AND
progress < 95%
```

Items above approximately 95% can be considered completed.

Display:

```text
Continue Watching

[ POSTER           ]
[██████████░░░░░░░ ]
```

For TV:

```text
Breaking Bad
S2 E5
```

Sort by:

```text
updatedAt DESC
```

---

# 43. Resume Playback

Before opening player:

```text
load progress
```

If progress exists:

```text
currentTime = 1245
```

construct:

```text
?progress=1245
```

The user should continue approximately where they stopped.

---

# 44. TV Next Episode

When an episode finishes:

1. Mark current episode complete.
2. Determine next episode.
3. Display:

```text
Next Episode
```

4. If it is the final episode of a season:
   - move to the first episode of the next valid season.

5. Never invent episodes.

Use TMDB season data.

---

# 45. Watchlist

Implement a local watchlist.

Model:

```ts
interface WatchlistItem {
  tmdbId: number
  mediaType: "movie" | "tv"
  addedAt: number
}
```

UI:

```text
+ My List
```

After addition:

```text
✓ In My List
```

Optimistic interaction should feel instant.

---

# 46. Optional Account System

Do NOT block initial development on authentication.

Version 1:

```text
localStorage
```

Phase 2 may introduce:

```text
Supabase
```

or another database/auth service.

Then synchronize:

```text
watch progress
watchlist
history
settings
```

across devices.

Keep storage interfaces abstract enough that local storage can later be replaced by cloud storage.

---

# 47. Header

Desktop header:

```text
LOGO

Home
Movies
TV Shows
Discover
My List

                         Search
                         Profile
```

Header starts transparent above hero.

After scrolling:

```text
dark translucent background
backdrop blur
subtle border
```

Transition smoothly.

---

# 48. Mobile Navigation

Do not squeeze the desktop navbar into a phone.

Use bottom navigation:

```text
Home
Movies
TV
Search
My List
```

Use icons and concise labels.

The header can contain only:

```text
logo
profile
```

where appropriate.

---

# 49. Visual Direction

Dark cinematic theme.

Suggested foundation:

```text
Background:
#090909 / near black

Surface:
#111111
#161616

Primary text:
#FFFFFF

Secondary text:
rgba(255,255,255,.65)

Muted text:
rgba(255,255,255,.45)

Border:
rgba(255,255,255,.08)
```

Pick ONE brand accent.

Do not blindly use Netflix red unless that becomes the application's own branding.

The application should have an identity.

---

# 50. Typography

Use a modern sans-serif.

Good options include:

```text
Inter
Geist
Manrope
```

Use bold typography sparingly.

Hierarchy:

```text
Hero title        very large
Section title     medium
Card title        small
Metadata          small/muted
```

Do not make every text element bold.

---

# 51. UI Radius

Avoid excessive rounded cards.

Streaming artwork should remain visually dominant.

Use approximately:

```text
poster: 6–10px
buttons: 8–12px
dialogs: 16–24px
```

Do not turn the entire UI into giant bubbly SaaS cards.

This is an entertainment interface.

---

# 52. Motion

Motion should feel premium, not gimmicky.

Use motion for:

- card hover
- dialog appearance
- header transition
- button feedback
- image fade
- content loading
- row navigation
- page transitions where appropriate

Typical transition:

```text
150–250ms
```

Large modal:

```text
250–350ms
```

Respect:

```css
prefers-reduced-motion
```

---

# 53. Skeleton Loading

Never display:

```text
Loading...
```

across the whole screen.

Use skeletons matching real layout.

Examples:

```text
hero skeleton
poster skeleton
episode skeleton
cast skeleton
```

Avoid large layout shifts after loading.

---

# 54. Image Loading

Use:

```text
Next/Image
```

where practical.

Hero:

```text
priority
```

First visible row:

```text
priority selectively
```

Everything else:

```text
lazy loading
```

Use blur/placeholder behavior where reasonable.

Never load hundreds of full-resolution posters immediately.

---

# 55. Data Caching

TMDB metadata does not need to be fetched every second.

Recommended approximate caching:

Trending:

```text
5–15 minutes
```

Popular:

```text
30–60 minutes
```

Details:

```text
1–6 hours
```

Genres/configuration:

```text
24 hours
```

Search:

```text
short-lived / dynamic
```

Use Next.js fetch caching/revalidation appropriately.

---

# 56. Parallel Requests

Independent homepage sections should load concurrently.

Use:

```ts
Promise.all()
```

where appropriate.

Do NOT:

```text
fetch trending
wait
fetch popular
wait
fetch top rated
wait
```

when they are independent.

---

# 57. append_to_response

Use TMDB's `append_to_response` where useful.

Instead of:

```text
details request
videos request
credits request
images request
recommendation request
```

prefer an appropriately composed details request.

Do not over-append twenty unnecessary datasets either.

Fetch only what that page needs.

---

# 58. Error Handling

Every major surface must have:

- loading state
- empty state
- error state
- retry behavior

Examples:

If poster is missing:

```text
use branded placeholder
```

If backdrop is missing:

```text
fall back to poster or gradient
```

If player provider fails:

```text
show playback unavailable message
```

Do not let one missing image crash a content rail.

---

# 59. Player Failure

If the embedded player fails:

Display something like:

```text
Playback is currently unavailable for this title.
```

Provide:

```text
Back to details
Retry
```

Do not create infinite retry loops.

---

# 60. Browser Back Behavior

Navigation must feel native.

Example:

```text
Home
→ Movie
→ Player
→ Back
→ Movie
→ Back
→ Home at approximately previous scroll position
```

Avoid destroying page state unnecessarily.

---

# 61. URL State

Filters and navigation state should use URLs when it benefits the user.

Examples:

```text
/search?q=batman

/discover?genre=28&type=movie

/tv/1396?season=2
```

This makes the site shareable.

---

# 62. Keyboard UX

Desktop enhancements:

```text
/       focus/open search
ESC     close dialog
← →     navigate relevant rails/dialogs
Enter   activate focused result
```

Do not override browser controls unnecessarily.

---

# 63. Accessibility

Minimum requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- alt text
- aria labels for icon buttons
- usable contrast
- focus trapping inside dialogs
- Escape closes modal
- reduced motion support

Interactive poster cards must not only work with a mouse.

---

# 64. Mobile Requirements

The mobile version must NOT look like shrunk desktop.

Cards:

Approximately:

```text
2–2.4 posters visible horizontally
```

Hero text should shorten.

Hide long descriptions if required.

Important controls should be reachable with a thumb.

Filter dialogs become bottom sheets.

Horizontal rows should support touch naturally.

Avoid hover-dependent information.

---

# 65. Desktop Requirements

Typical row should display approximately:

```text
5–7 cards
```

depending on viewport.

Content width should remain generous.

Do not constrain everything to a narrow:

```text
max-width: 1200px
```

Streaming interfaces benefit from near-full-width rails.

Use responsive horizontal page padding.

---

# 66. Tablet Requirements

Tablet needs dedicated testing.

Do not assume desktop CSS automatically works.

Verify:

```text
768px
820px
1024px
```

particularly:

- navigation
- poster sizes
- hero copy
- dialogs
- player
- horizontal rails

---

# 67. UX Inspiration from Cineby

Take inspiration from its simplicity and browsing density:

- prominent featured content
- Top 10 ranking
- Trending sections
- provider/platform collections
- top-rated rows
- genre-focused rows
- fast transition from browsing to content

However:

DO NOT copy:

- source code
- branding
- logo
- assets
- exact CSS
- exact layout measurements

The goal is:

```text
Cineby-quality UX
+
our own visual identity
+
stronger technical architecture
```

---

# 68. Provider-Based Rows

TMDB provides watch-provider information.

This can eventually support rows like:

```text
Popular on Netflix
Popular on Disney+
Popular on Prime Video
```

Retrieve provider IDs dynamically rather than assuming permanent IDs.

Be aware that availability is regional.

The user's configured region must be considered.

---

# 69. Regional Settings

Support:

```text
region
language
```

as application settings.

For example:

```text
region=KH
language=en-US
```

if targeting Cambodia, but do not hardcode this globally.

Create defaults through configuration.

Future settings screen:

```text
Language
Region
Autoplay
Reduced Motion
Player Preferences
```

---

# 70. Adult Content

Default:

```text
include_adult=false
```

Do not automatically enable adult content.

---

# 71. API Security

TMDB:

```text
Server-side only.
```

Vidking base URL:

```text
public
```

because it is loaded inside the browser iframe.

Never send the TMDB bearer token into browser HTML.

---

# 72. Content Security Policy

Configure CSP intentionally.

At minimum evaluate:

```text
frame-src
img-src
connect-src
media-src
```

Allow only domains actually required by the application.

Do not use:

```text
*
```

for everything.

Playback iframe needs the playback provider domain.

TMDB images need the TMDB image CDN.

---

# 73. postMessage Security

Since an external iframe sends progress events:

```ts
window.addEventListener("message", handleMessage)
```

must validate:

```text
origin
type
payload shape
```

Never trust arbitrary iframe messages.

---

# 74. Search Route

Recommended:

```text
GET /api/search?q=batman
```

Server route:

```text
Browser
  ↓
Next.js /api/search
  ↓
TMDB
```

This keeps TMDB credentials off the client.

Normalize results before returning them to UI if useful.

---

# 75. Performance Budget

Target:

- no obvious page jank
- smooth horizontal scrolling
- quick first meaningful content
- no unnecessary API waterfalls
- no gigantic JavaScript bundle
- no loading hundreds of posters
- no iframe loaded before playback is requested

Do NOT render hidden Vidking players on cards.

Only instantiate playback iframe on a watch surface.

---

# 76. SEO

Browse/detail pages should include metadata.

Movie:

```text
Movie Title (2026) — App Name
```

TV:

```text
Series Name — App Name
```

Include:

- description
- OpenGraph image
- canonical URL where appropriate

Do not attempt to SEO-index player URLs themselves.

---

# 77. Footer

Keep minimal.

Include:

```text
About
Privacy
Terms
Credits
TMDB Attribution
```

TMDB attribution must be included according to their current requirements.

Do not imply TMDB endorses the application.

---

# 78. Phase 1 — Foundation

Build:

- Next.js project
- TypeScript
- Tailwind
- base theme
- fonts
- layout
- header
- mobile nav
- loading primitives
- reusable buttons
- media-card skeleton

No fake streaming UI should remain after the real data layer is available.

---

# 79. Phase 2 — TMDB Layer

Build:

```text
tmdb/client.ts
tmdb/types.ts
tmdb/images.ts
tmdb/normalize.ts
```

Implement:

- trending
- popular
- top-rated
- movie details
- TV details
- season details
- genre lists
- search
- discover

Test this independently from the UI.

---

# 80. Phase 3 — Homepage

Implement:

```text
Hero
Continue Watching
Top 10
Trending
Popular Movies
Popular TV
Top Rated
Genre Rails
```

Focus heavily on polish.

This is the first surface users judge.

---

# 81. Phase 4 — Details

Implement:

```text
movie details
TV details
cast
recommendations
trailers
seasons
episodes
watchlist
```

Ensure deep linking works.

---

# 82. Phase 5 — Search & Discover

Implement:

```text
global search
keyboard shortcut
debounced requests
discover page
filters
URL state
```

---

# 83. Phase 6 — Playback

Implement provider abstraction.

Then implement Vidking.

Build:

```text
Player
PlayerShell
watch routes
progress listener
resume system
```

Do not mix playback provider logic into TMDB utilities.

---

# 84. Phase 7 — Continue Watching

Implement:

```text
watch progress
history
resume
continue watching
episode progress
completion logic
```

Test refresh scenarios carefully.

---

# 85. Phase 8 — Responsive Polish

Explicitly test:

```text
375px
390px
430px

768px
820px

1024px
1280px
1440px
1920px
```

Fix each class of layout separately.

Do not stop after testing desktop.

---

# 86. Phase 9 — Performance

Audit:

- image sizes
- client bundles
- API waterfalls
- rerenders
- iframe remounts
- layout shifts
- lazy loading
- server caching
- row rendering

Use browser performance tooling where appropriate.

---

# 87. Phase 10 — Optional Cloud Sync

Only after the local-first version is stable.

Possible architecture:

```text
Supabase Auth

users

watch_progress

watchlist

watch_history

preferences
```

Guest users must continue working without login.

Account creation should upgrade the experience rather than unlock basic browsing.

---

# 88. Important Code Quality Rules

The agent MUST:

- use TypeScript strictly
- avoid `any`
- centralize TMDB communication
- centralize image generation
- normalize movie/TV objects
- keep playback providers abstract
- create reusable rail components
- create reusable cards
- separate server/client responsibilities
- handle errors explicitly
- build responsive UI from the beginning
- keep components reasonably small

---

# 89. Things the Agent Must NOT Do

Do not:

- hardcode sample movies as the final implementation
- expose TMDB token
- fetch TMDB directly from every component
- make every component `"use client"`
- call APIs inside loops
- download the entire TMDB catalog
- load original-size images everywhere
- create an iframe for every media card
- save progress every animation frame
- copy Cineby's code
- copy Netflix branding
- create giant SaaS-style rounded cards
- use intrusive animations
- sacrifice mobile UX
- depend entirely on hover states
- trust arbitrary `postMessage` payloads
- embed playback implementation directly inside details components

---

# 90. Initial Homepage Data Flow

Conceptually:

```text
Homepage Request
      │
      ├── Trending Movies
      ├── Trending TV
      ├── Popular Movies
      ├── Popular TV
      ├── Top Rated Movies
      └── Genres
             │
             ↓
      normalize responses
             │
             ↓
       Server-render page
             │
             ↓
 Interactive client rails
```

Independent TMDB requests should execute concurrently.

---

# 91. Playback Data Flow

```text
User clicks Play

       ↓

Media identity

tmdbId
mediaType
season?
episode?

       ↓

Load saved progress

       ↓

PlaybackProvider

       ↓

VidkingProvider

       ↓

generate iframe URL

       ↓

Player

       ↓

PLAYER_EVENT

       ↓

validate origin

       ↓

validate payload

       ↓

throttle progress

       ↓

ProgressStore

       ↓

Continue Watching
```

This separation is non-negotiable.

---

# 92. Movie User Journey

Target flow:

```text
Homepage

↓ click movie

Beautiful details experience

↓ Play

Theater-style player

↓ Watch 37 minutes

Close tab

↓ Return later

Homepage

Continue Watching

↓ click

Resume around previous timestamp
```

This journey must feel seamless.

---

# 93. TV User Journey

Target:

```text
Homepage

↓ TV show

Show Details

↓ Season 2

Episode list

↓ Episode 5

Play

↓ completes episode

Next Episode

↓ episode 6

Progress automatically updated
```

Returning to the TV page should visibly show which episodes have been watched.

---

# 94. Design Quality Requirement

Do not consider the feature finished merely because:

```text
API returns data
```

A feature is complete only if:

```text
data works
+
loading works
+
errors work
+
desktop works
+
mobile works
+
animations feel correct
+
keyboard/accessibility works
+
visual hierarchy feels polished
```

---

# 95. Definition of Done

The application is considered MVP-complete when all of the following work:

- [ ] Homepage uses real TMDB data
- [ ] Hero is responsive
- [ ] Top 10 works
- [ ] Trending works
- [ ] Movie rails work
- [ ] TV rails work
- [ ] Genre rails work
- [ ] Search works
- [ ] Search is debounced
- [ ] Discover filters work
- [ ] Movie details work
- [ ] TV details work
- [ ] Seasons work
- [ ] Episodes work
- [ ] Movie playback works through provider abstraction
- [ ] TV playback works through provider abstraction
- [ ] Vidking player is implemented as one provider
- [ ] Player events are handled safely
- [ ] Watch progress persists
- [ ] Resume playback works
- [ ] Continue Watching works
- [ ] TV episode progress works
- [ ] Watchlist works
- [ ] Browser navigation behaves correctly
- [ ] Mobile navigation works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Skeleton loading exists
- [ ] Missing images are handled
- [ ] Player errors are handled
- [ ] TMDB credentials never reach browser code
- [ ] TMDB attribution is present
- [ ] Reduced-motion users are respected
- [ ] No major layout shifts occur
- [ ] Player iframe does not remount due to progress updates

---

# 96. Final Agent Instruction

Treat this project as a real consumer streaming interface rather than a quick API demo.

Prioritize, in order:

```text
1. Architecture
2. Browsing UX
3. Playback reliability
4. Responsive behavior
5. Performance
6. Visual polish
```

TMDB should be the single source of truth for media identity and metadata.

The playback provider must remain replaceable.

The interface should take inspiration from the speed, density and simplicity of Cineby and the cinematic presentation of premium streaming services, but it must have its own visual identity.

When implementing a feature, complete the full user journey before moving to the next feature.

Do not compensate for incomplete engineering with mock data or excessive visual effects.

The desired final experience is:

> Open the site → immediately see something interesting → effortlessly browse → understand a title in seconds → press Play → watch → leave → return later → continue exactly where you stopped.

That flow is the core product.