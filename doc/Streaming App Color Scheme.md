# Streaming App Color Scheme

Use this palette as the default visual system for the streaming application.

The design direction is:

- Dark
- Cinematic
- Blue-focused
- Premium
- Modern
- Minimal
- High contrast
- Not inspired by Netflix red branding
- Movie artwork should remain the main source of visual color

---

# Core Color Palette

## Main Background

```text
#050914
```

Use for:

- Main application background
- Watch page background
- Large empty surfaces
- Navigation shell

---

## Secondary Background

```text
#08101F
```

Use for:

- Secondary sections
- Sidebar
- Header when scrolled
- Bottom navigation
- Search overlays

---

## Surface / Card Background

```text
#0D1628
```

Use for:

- Cards
- Dropdowns
- Modals
- Player information panels
- Episode cards
- Search results

---

## Surface Hover

```text
#17233A
```

Use for:

- Hover states
- Selected cards
- Interactive surfaces
- Menu items

---

# Brand Colors

## Primary Blue

```text
#2563EB
```

This is the main brand color.

Use for:

- Primary buttons
- Active navigation
- Selected controls
- Active filters
- Main CTA
- Important interactive states

Example:

```css
background: #2563EB;
```

---

## Bright Blue

```text
#3B82F6
```

Use for:

- Hover states
- Links
- Secondary highlights
- Selected text
- Active icons

Example:

```css
color: #3B82F6;
```

---

## Electric Blue

```text
#1D8FFF
```

Use for:

- Progress indicators
- Player progress
- Interactive accents
- Small glowing UI elements
- Active sliders

---

## Cyan Highlight

```text
#22D3EE
```

Use sparingly.

Use for:

- Gradient endings
- Small highlights
- Active progress accents
- Special badges
- Subtle glow effects

Do not make Cyan the primary brand color.

---

## Light Blue

```text
#60A5FA
```

Use for:

- Focus rings
- Badge text
- Subtle active states
- Secondary highlighted information

---

# Text Colors

## Primary Text

```text
#F8FAFC
```

Use for:

- Titles
- Important labels
- Movie names
- Main navigation text
- Buttons

---

## Secondary Text

```text
#B6C2D2
```

Use for:

- Descriptions
- Movie metadata
- Supporting information
- Episode descriptions

---

## Muted Text

```text
#718096
```

Use for:

- Dates
- Runtime
- Secondary metadata
- Disabled or lower-priority information

---

## Very Muted Text

```text
#475569
```

Use for:

- Placeholder text
- Very low-priority metadata
- Disabled controls

---

# Borders

## Default Border

```css
rgba(148, 163, 184, 0.12)
```

Use for:

- Cards
- Inputs
- Dividers
- Modals

---

## Strong Border

```css
rgba(96, 165, 250, 0.22)
```

Use for:

- Hovered cards
- Selected surfaces
- Important interactive components

---

## Active Border

```text
#3B82F6
```

Use for:

- Selected filters
- Focused inputs
- Active controls

---

# Main Brand Gradient

Use this as the standard brand gradient:

```css
linear-gradient(
  135deg,
  #2563EB 0%,
  #1D8FFF 55%,
  #22D3EE 100%
);
```

Use for:

- Small branding elements
- Selected states
- Premium accent elements
- Progress bars
- Logo accents if needed

Do not cover large areas of the interface with this gradient.

---

# Cinematic Dark Blue Gradient

Use this for darker UI elements:

```css
linear-gradient(
  135deg,
  #1E40AF 0%,
  #2563EB 45%,
  #0EA5E9 100%
);
```

Use sparingly for:

- Special CTA
- Highlighted collections
- Premium feature sections

---

# Continue Watching Progress Gradient

```css
linear-gradient(
  90deg,
  #2563EB,
  #22D3EE
);
```

Use for:

- Movie progress bars
- Episode progress
- Resume indicators

---

# Glow

Use subtle blue glow only.

```css
box-shadow:
  0 0 20px rgba(37, 99, 235, 0.18),
  0 0 45px rgba(14, 165, 233, 0.08);
```

Glow should appear primarily around:

- Active navigation
- Primary CTA
- Focused controls
- Selected content

Avoid applying glow to every card.

---

# Primary Button

Default:

```text
Background: #2563EB
Text:       #F8FAFC
```

Hover:

```text
Background: #3B82F6
```

Example:

```css
.primary-button {
  background: #2563EB;
  color: #F8FAFC;
}

.primary-button:hover {
  background: #3B82F6;
}
```

---

# Secondary Button

Use dark/translucent styling.

```css
background: rgba(13, 22, 40, 0.75);
border: 1px solid rgba(148, 163, 184, 0.12);
color: #F8FAFC;
```

Hover:

```css
background: #17233A;
border-color: rgba(96, 165, 250, 0.22);
```

Use for:

- My List
- More Info
- Secondary actions

---

# Navigation

Inactive:

```text
Text: #B6C2D2
Icon: #718096
```

Hover:

```text
Text: #F8FAFC
Icon: #60A5FA
```

Active:

```text
Background: #2563EB
Text:       #F8FAFC
Icon:       #FFFFFF
```

Optional active glow:

```css
box-shadow: 0 0 24px rgba(37, 99, 235, 0.30);
```

---

# Links

Default:

```text
#3B82F6
```

Hover:

```text
#60A5FA
```

Examples:

- View All
- See More
- Episode links
- Secondary navigation actions

---

# Search Input

Background:

```text
#0D1628
```

Border:

```css
rgba(148, 163, 184, 0.12)
```

Text:

```text
#F8FAFC
```

Placeholder:

```text
#475569
```

Focused border:

```text
#3B82F6
```

Focus ring:

```css
0 0 0 3px rgba(59, 130, 246, 0.15)
```

---

# Badges

Background:

```text
#0D2A52
```

Text:

```text
#60A5FA
```

Examples:

```text
FEATURED
TRENDING
NEW
HD
4K
```

Avoid overly bright badges.

---

# Cards

Default:

```text
Background: #0D1628
```

However, poster artwork should normally fill the visual card.

Do not cover posters with large solid-blue surfaces.

Hover:

```text
Border: rgba(96, 165, 250, 0.22)
```

Optional subtle shadow:

```css
box-shadow:
  0 10px 35px rgba(0, 0, 0, 0.45),
  0 0 20px rgba(37, 99, 235, 0.08);
```

---

# Hero Section

The hero should NOT be heavily blue-tinted.

Let the actual movie backdrop provide most of the color.

Use dark gradients to blend it into the interface.

Bottom fade:

```css
linear-gradient(
  to bottom,
  transparent 40%,
  #050914 100%
);
```

Left fade:

```css
linear-gradient(
  to right,
  rgba(5, 9, 20, 0.95) 0%,
  rgba(5, 9, 20, 0.65) 35%,
  transparent 70%
);
```

Use blue only for:

- Featured badge
- Play button
- Navigation indicator
- Carousel indicator
- Small decorative highlights

---

# Player Page

Background:

```text
#02040A
```

Keep the player environment almost completely black.

Use blue only for:

- Episode selection
- Progress
- Active controls
- Links
- Player metadata accents

The player itself should remain visually dominant.

---

# Loading States

Skeleton base:

```text
#0D1628
```

Skeleton highlight:

```text
#17233A
```

Optional subtle blue loading indicator:

```text
#2563EB
```

Do not make skeletons bright blue.

---

# Status Colors

Blue is the brand color, but status states should remain semantically understandable.

Success:

```text
#22C55E
```

Warning:

```text
#F59E0B
```

Error:

```text
#EF4444
```

Important:

Red may be used for **errors only**.

Do not use red as:

- Branding
- Main buttons
- Navigation
- Progress
- Selected filters
- Decorative UI

---

# Tailwind Theme Tokens

Use semantic variables instead of hardcoding colors repeatedly.

Example:

```css
:root {
  --background: #050914;
  --background-secondary: #08101F;

  --surface: #0D1628;
  --surface-hover: #17233A;

  --brand-primary: #2563EB;
  --brand-bright: #3B82F6;
  --brand-electric: #1D8FFF;
  --brand-cyan: #22D3EE;
  --brand-light: #60A5FA;

  --text-primary: #F8FAFC;
  --text-secondary: #B6C2D2;
  --text-muted: #718096;
  --text-subtle: #475569;

  --border: rgba(148, 163, 184, 0.12);
  --border-strong: rgba(96, 165, 250, 0.22);

  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

Prefer using semantic classes/tokens such as:

```text
bg-background
bg-surface
bg-surface-hover

text-primary
text-secondary
text-muted

bg-brand
text-brand
border-brand
```

instead of repeatedly hardcoding hex values throughout components.

---

# Core Palette Summary

These are the primary colors the application should revolve around:

```text
#050914   Main Background

#08101F   Secondary Background

#0D1628   Surface / Cards

#17233A   Surface Hover

#2563EB   Primary Blue

#3B82F6   Bright Blue

#1D8FFF   Electric Blue

#22D3EE   Cyan Highlight

#60A5FA   Light Blue

#F8FAFC   Primary Text

#B6C2D2   Secondary Text

#718096   Muted Text

#475569   Very Muted Text
```

---

# Visual Usage Rule

The interface should NOT become overwhelmingly blue.

The hierarchy should approximately be:

```text
70–80%    Black / dark navy surfaces

15–20%    Movie posters, backdrops and content artwork

5–10%     Brand blue / cyan UI accents
```

Movie artwork should provide most of the visual diversity.

Blue is used to communicate:

```text
interactive
active
selected
progress
focus
brand
```

rather than being used as a background for everything.

---

# Important Design Rule

Do not introduce red as a major UI color.

Avoid a combination such as:

```text
black background
+
red buttons
+
red navigation
+
red progress bars
```

because it will immediately resemble existing streaming-service branding.

The visual identity should instead be:

```text
Deep Midnight
+
Electric Blue
+
Cool Blue
+
Restrained Cyan
+
Cinematic Artwork
```

The final result should feel premium, original and recognizably blue without looking like a gaming dashboard or generic SaaS application.