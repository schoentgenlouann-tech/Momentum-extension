# Stillpoint

Stillpoint is a Chrome New Tab extension built as a small, local-first focus space. It includes a live local clock and greeting, a curated photo library with custom uploads, a personal task list, opt-in local weather, and a daily inspirational quote.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Select **Load unpacked** and choose this project folder.
4. Open a new tab to see Stillpoint.

After editing the extension files, select **Reload** on the Stillpoint tile in `chrome://extensions`.

## Use

- Add tasks in the list; select the circle to complete or reopen one, or use its delete control to remove it.
- Set one intention for the day above the task list. Intentions are saved locally and refresh for the next local calendar day.
- Use the up and down controls on a task to change its position in the saved list.
- Open **Personalize quotes** to hide the daily quote or add and remove your own quotes. Custom quotes and this preference are saved locally.
- Select **Choose a scene** to browse the bundled photo library, upload a photo, or drop a JPG, PNG, WebP, or GIF onto the page. Use the reset control to return to the default scene.
- Select **Add local weather** and allow location access to show today's forecast. Weather is fetched from Open-Meteo; coordinates are not saved.
- On desktop, choose **Use a city** to get a forecast without sharing device location. If location access has already been granted, the forecast refreshes automatically in new tabs.
- Tasks, the selected photo, daily intention, custom quotes, and quote visibility preference are stored locally in the browser through Chrome extension storage. The photo library and quotes work offline; weather needs location access and a network connection.

See [PM-doc.md](PM-doc.md) for the product decisions, scope, and acceptance criteria.