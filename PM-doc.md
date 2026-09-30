# Stillpoint: Product Spec

**Date:** September 30, 2026  
**Version:** V1  
**Platform:** Chrome extension (Manifest V3), replacing the New Tab page

## Product Idea

Stillpoint makes each new tab a quieter starting point for the day. It combines a useful glance at the time, one place to keep a short task list, and a personal image that makes the page feel like the user's own space.

Momentum's product idea is to turn the browser's otherwise empty new-tab page into a daily home for focus and inspiration. Its current feature set brings together a daily photo and greeting, a prominent task, and optional productivity tools such as focus timers, soundscapes, weather, and links. Stillpoint borrows the calm, focus-first principle, not Momentum's branding or full feature set.

## Candidate Features

1. Live local time, date, and time-aware greeting.
2. Custom background photo, set by dropping or selecting an image.
3. Small task list with completion and persistent local storage.
4. Daily quote or intention prompt.
5. Quick links, weather, and a focus timer.

## V1 Feature Decisions

V1 includes features 1, 2, and 3. This keeps the first release useful without accounts, external services, or a large settings surface. The quote, links, weather, and timer are explicitly deferred.

## Product Requirements and Acceptance Criteria

### 1. New-tab greeting and clock

**Build:** Replace Chrome's New Tab page with a responsive full-window dashboard. Show the current local time, date, and a greeting that changes with the local hour.

**Acceptance criteria:**

- Opening a new Chrome tab displays Stillpoint instead of Chrome's default New Tab page.
- The displayed time uses the device's local time and updates at least once per minute without a reload.
- The date is readable and correct for the device's locale.
- The greeting changes between morning, afternoon, and evening based on local time.

### 2. Personal background image

**Build:** Let the user set the dashboard background by dropping an image onto the page or choosing one from a file picker. Include a restrained built-in landscape background for first launch.

**Acceptance criteria:**

- A valid image file dropped anywhere on the dashboard becomes the background.
- A keyboard-accessible file picker offers the same image selection behavior.
- The selected background remains after the tab is closed and reopened.
- Invalid files do not replace the current background and produce a clear, temporary message.
- A visible reset control restores the built-in background.

### 3. Personal task list

**Build:** Provide one compact list for adding, completing, and deleting tasks. Keep tasks on the device using extension local storage.

**Acceptance criteria:**

- A non-empty submitted task appears in the list without reloading.
- Tasks can be marked complete and unmarked.
- Tasks can be deleted individually.
- The task list survives closing and reopening a new tab.
- Empty or whitespace-only submissions do not create tasks.

## Out of Scope for V1

- Accounts, cloud sync, or collection of personal data.
- Weather, quotes, soundscapes, focus timers, bookmarks, and third-party integrations.
- Automatically sourced daily photos or background rotation.
- Mobile browsers or non-Chromium extension stores.

## Product Principles

- Focus on one glance and one useful next action.
- Keep personal data local to the browser.
- Make primary actions usable with keyboard and pointer.
- Use a calm, legible interface that keeps the background subordinate to the content.

## V1 Validation

- Load the unpacked extension in Chrome and confirm it replaces the New Tab page.
- Exercise the greeting and clock at multiple local times.
- Set, reload, and reset a background image; reject a non-image file.
- Add, complete, delete, and reload tasks; reject a blank task.
- Confirm the layout remains usable in a narrow browser window.

## Longer-Term Direction

Any follow-on work starts with a new or revised product spec and acceptance criteria. Candidate directions include a focus timer, a daily intention, quick links, or weather; none are commitments for V1.