# Design Brief

## Direction

Dark Editorial Messaging — professional, calm, information-focused communication app inspired by Telegram/Slack.

## Tone

Modern tool aesthetic: clean, minimal, no decorative flourish — restraint and clarity signal professionalism and trust.

## Differentiation

Intentional three-column structural hierarchy: left sidebar (conversations), center chat area (message content), right sidebar (contacts/presence) — each zone has deliberate visual separation and background treatment.

## Color Palette

| Token      | OKLCH           | Role                           |
| ---------- | --------------- | ------------------------------ |
| background | 0.145 0.014 260 | Dark charcoal, content area    |
| foreground | 0.95 0.01 260   | Light text, high contrast      |
| card       | 0.18 0.014 260  | Slight elevation for cards     |
| primary    | 0.75 0.15 190   | Cyan/teal accent, interactions |
| accent     | 0.75 0.15 190   | Same as primary (consistent)   |
| muted      | 0.22 0.02 260   | Secondary backgrounds          |
| destructive| 0.55 0.2 25     | Delete/leave actions           |

## Typography

- Display: Satoshi — professional, approachable sans-serif for headings
- Body: Satoshi — consistent throughout for clarity and recognition
- Mono: JetBrains Mono — timestamps, technical info, message IDs
- Scale: hero `text-2xl font-bold`, h2 `text-lg font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth

Subtle, minimal shadows only on interactive elements. Depth via color contrast and borders, not blur/shadow stacking. Message bubbles use background color variation (card vs. muted).

## Structural Zones

| Zone          | Background    | Border         | Notes                              |
| ------------- | ------------- | -------------- | ---------------------------------- |
| Header        | card          | border-b       | App name, search bar               |
| Left Sidebar  | background    | —              | Conversation list, hover lift      |
| Chat Area     | background    | —              | Messages in card/muted alternation |
| Right Sidebar | card          | border-l       | Online contacts, user info         |
| Message       | card/muted    | —              | Sent (accent bg), received (card)  |

## Spacing & Rhythm

Spacious density with consistent 1rem/1.5rem gaps between sections. Micro-spacing (0.5rem) for text inside cards. Visual rhythm via alternating background tones in message lists.

## Component Patterns

- Buttons: rounded-md, bg-accent hover:opacity-90, no shadow
- Message bubbles: rounded-lg, bg-card (received) or bg-accent text-accent-foreground (sent)
- Contact badges: rounded-full, bg-muted-foreground/20, teal online indicator dot
- List items: rounded-sm, hover:bg-muted/50 transition-smooth

## Motion

- Entrance: opacity fade on message load (0.2s)
- Hover: subtle background lift on interactive rows (transition-smooth)
- Presence indicator: pulse (1s) on online status change (optional)
- No decorative animations

## Constraints

- No gradients, no glassmorphism
- Minimum 0.7 lightness difference for contrast (dark mode)
- Teal accent used sparingly: active state, send buttons, online indicators
- Borders thin (1px), color boundary only

## Signature Detail

Presence status dots (teal online, muted away, gray offline) placed consistently in corners of avatars — a quiet, professional indicator that reinforces the "always-on" communication purpose.
