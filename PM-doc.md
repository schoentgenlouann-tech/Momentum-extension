# Stillpoint: Product Spec

**Date:** September 30, 2026  
**Version:** V1.2
**Platform:** Chrome extension (Manifest V3), replacing the New Tab page

## Product Idea

Stillpoint makes each new tab a quieter starting point for the day. It combines a useful glance at the time, one place to keep a short task list, and a personal image that makes the page feel like the user's own space.

Momentum's product idea is to turn the browser's otherwise empty new-tab page into a daily home for focus and inspiration. Its current feature set brings together a daily photo and greeting, a prominent task, and optional productivity tools such as focus timers, soundscapes, weather, and links. Stillpoint borrows the calm, focus-first principle, not Momentum's branding or full feature set.

## Candidate Features

1. Live local time, date, and time-aware greeting.
2. Background library with curated scenes, custom upload, and drag-and-drop.
3. Small task list with completion and persistent local storage.
4. Local weather forecast in the greeting area.
5. A new inspirational quote each day below the task list.

## V1.2 Feature Decisions

V1.2 includes features 1 through 5, plus a date-scoped daily intention, task reordering, quote customization, and accessibility refinements. Weather is fetched from Open-Meteo after the user grants browser location access. Photos, tasks, intentions, and custom quotes remain in local extension storage; they need no account or network connection.

## Product Requirements and Acceptance Criteria

### 1. New-tab greeting and clock

**Build:** Replace Chrome's New Tab page with a responsive full-window dashboard. Show the current local time, date, and a greeting that changes with the local hour.

**Acceptance criteria:**

- Opening a new Chrome tab displays Stillpoint instead of Chrome's default New Tab page.
- The displayed time uses the device's local time and updates at least once per minute without a reload.
- The date is readable and correct for the device's locale.
- The greeting changes between morning, afternoon, and evening based on local time.

### 2. Personal background image

**Build:** Let the user select a scene from a curated built-in photo library, upload an image, or drop one onto the page. Include a restrained default scene for first launch.

**Acceptance criteria:**

- The photo library opens from the new-tab page and offers at least five built-in scenes with visible previews and names.
- Selecting a library image changes the background and persists after reopening a tab.
- A valid image file dropped anywhere on the dashboard or chosen from the upload control becomes the background.
- The selected background remains after the tab is closed and reopened.
- Invalid files do not replace the current background and produce a clear, temporary message.
- A visible reset control restores the built-in background.

### 3. Personal task list

**Build:** Provide one compact list for adding, completing, and deleting tasks. Keep tasks on the device using extension local storage.

**Acceptance criteria:**

- A non-empty submitted task appears in the list without reloading.
- Tasks can be marked complete and unmarked.
- Tasks can be deleted individually.
- Tasks can be moved up or down with keyboard-accessible controls, and the chosen order persists after reopening a tab.
- The task list survives closing and reopening a new tab.
- Empty or whitespace-only submissions do not create tasks.
- A user can set, edit, or clear one intention for the current local calendar day.
- An intention persists across tabs on the same day and is not shown on the next local calendar day.

### 4. Local weather

**Build:** After the user requests weather, ask for browser location access and show today's forecast in the greeting area using Open-Meteo. Do not store coordinates.

**Acceptance criteria:**

- Weather is requested only after the user selects the weather control.
- With location permission and network access, the page displays a plain-language summary such as "Expecting light rain today."
- On desktop, users can search for a city when browser location is denied or unavailable.
- If location is denied, unavailable, or the forecast cannot be fetched, explain the state and allow retry without breaking the rest of the page.
- Coordinates are used only for the forecast request and are not saved.

### 5. Daily inspirational quote

**Build:** Show an inspirational quote beneath the task list. Select it deterministically from a local collection using the user's local calendar date.

**Acceptance criteria:**

- A quote appears below the task list, including when there are no tasks.
- The same quote appears for all tabs opened on the same local date, and the selection changes on the next date.
- Quote selection works offline and does not require an account.
- Users can add and remove custom quotes, with an optional author, and those quotes join the daily rotation.
- Users can hide or show the daily quote; that preference persists locally and quote settings remain available while the quote is hidden.

### 6. Accessibility and motion

**Build:** Keep all primary controls keyboard operable, provide visible focus, and respect reduced-motion preferences.

**Acceptance criteria:**

- Interactive controls show a high-contrast visible focus indicator when reached by keyboard.
- Foreground text remains legible over the background through a stronger image shade and an opaque task panel.
- Reduced-motion preferences disable entrance, task, and transition animations.
- Task reordering announces the new position to assistive technology and preserves keyboard focus.

## Out of Scope for V1

- Accounts, cloud sync, or collection of personal data.
- Soundscapes, focus timers, bookmarks, and third-party integrations other than the weather forecast endpoint.
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
- Select multiple library backgrounds, upload/drop and reload a custom image, reset the background, and reject a non-image file.
- Add, complete, delete, and reload tasks; reject a blank task.
- Set an intention, open another tab on the same day, and confirm it is shared; advance the date and confirm it is no longer shown.
- Reorder tasks with the keyboard and confirm the order persists after reopening a tab.
- Add and remove a custom quote, toggle quote visibility, and confirm both settings persist locally.
- Request weather with location allowed and denied; confirm errors leave other features usable.
- Confirm the quote is stable for a date and changes when the date changes.
- Confirm visible focus styles and reduced-motion behavior in the browser.
- Confirm the layout remains usable in a narrow browser window.

## Longer-Term Direction

Any follow-on work starts with a new or revised product spec and acceptance criteria. Candidate directions include a focus timer, a daily intention, quick links, or weather; none are commitments for V1.