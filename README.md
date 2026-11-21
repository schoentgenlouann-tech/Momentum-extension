# Stillpoint

## Purpose

Stillpoint replaces Chrome's New Tab page with a quiet, local-first space for checking the time, choosing a daily priority, managing a short task list, and finding inspiration. It also offers a curated photo library and optional local weather.

## Data collection

- The clock and date use the device's local time; they are not sent elsewhere.
- Tasks, intentions, custom quotes, and selected or uploaded backgrounds are provided by the user and stay in local browser storage.
- Weather is the only network feature. After the user enables it, the extension sends location coordinates to Open-Meteo to request a forecast. When using city search, the city name is sent to Open-Meteo's search endpoint, then returned coordinates are used for the forecast.
- Location coordinates and forecast results are not saved. The forecast may refresh in new tabs after location permission has been granted.
- The extension does not include account, analytics, or advertising features.

## Data persistence

- In the installed extension, tasks, the selected background, the current day's intention, custom quotes, and quote visibility preference use Chrome extension local storage.
- When previewed outside the extension, the page uses browser local storage as a fallback.
- Custom backgrounds are resized and compressed before being stored. The bundled photo library and built-in quotes work offline.
- Weather data is held only for the current page session; weather requests require a network connection.

## User interaction

- Add, complete, reopen, delete, and reorder tasks with the list controls.
- Set, edit, or clear one intention for the local calendar day.
- Use **Personalize quotes** to hide or show the daily quote and add or remove custom quotes. Authors are optional.
- Choose a bundled scene, upload an image, or drop a JPG, PNG, WebP, or GIF onto the page. Reset to restore the default scene.
- Select **Add local weather** and allow location access, or use city search where available. Weather is provided by Open-Meteo.

## Setup

Stillpoint is a Chrome Manifest V3 extension. It has no package installation or build step.

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Select **Load unpacked** and choose this project folder.
4. Open a new tab to see Stillpoint.

After editing the extension files, select **Reload** on the Stillpoint tile in `chrome://extensions`.

See [PM-doc.md](PM-doc.md) for product decisions, scope, and acceptance criteria.

## Learning

- Keeping daily state aligned with the user's local calendar means using a local date key rather than relying on a UTC date.
- Re-rendering a task list can interrupt keyboard navigation, so reordering restores focus and announces the new position.
- User-selected images can be large; resizing and compression help limit local storage use.

## Limitations and assistance

- Weather depends on network access and the Open-Meteo service. Forecasts are limited to the data requested by the extension.
- The extension targets Chrome Manifest V3; other browsers have not been verified.
- There is no automated regression suite. Browser checks were manual, and the extension storage API was not directly verified in an installed extension context.
- Screen-reader behavior and contrast across every possible uploaded background have not been fully tested.
- The bundled background image assets do not currently have source attribution documented in this repository.
- GitHub Copilot in VS Code assisted with implementation and browser checks. No external runtime code libraries or tutorial snippets are included.

## Audit

Maintain a sanitized [AUDIT.md](AUDIT.md) in this repository recording what was checked, issues found, fixes made, and remaining limitations. Do not include secrets or sensitive details.