const elements = {
  background: document.querySelector(".backdrop"),
  changePhoto: document.querySelector("#change-photo"),
  clock: document.querySelector("#clock"),
  date: document.querySelector("#today-date"),
  dailyQuote: document.querySelector("#daily-quote-text"),
  dailyQuoteAuthor: document.querySelector("#daily-quote-author"),
  quoteArea: document.querySelector("#quote-area"),
  showDailyQuote: document.querySelector("#show-daily-quote"),
  customQuoteForm: document.querySelector("#custom-quote-form"),
  customQuoteText: document.querySelector("#custom-quote-text"),
  customQuoteAuthor: document.querySelector("#custom-quote-author"),
  customQuoteList: document.querySelector("#custom-quote-list"),
  customQuoteEmpty: document.querySelector("#custom-quote-empty"),
  quoteError: document.querySelector("#quote-error"),
  emptyState: document.querySelector("#empty-state"),
  greeting: document.querySelector("#greeting"),
  gallery: document.querySelector("#background-gallery"),
  photoDialog: document.querySelector("#photo-dialog"),
  photoInput: document.querySelector("#photo-input"),
  closePhotoDialog: document.querySelector("#close-photo-dialog"),
  resetPhoto: document.querySelector("#reset-photo"),
  uploadPhoto: document.querySelector("#upload-photo"),
  weatherButton: document.querySelector("#weather-button"),
  weatherCityForm: document.querySelector("#weather-city-form"),
  weatherCityInput: document.querySelector("#weather-city-input"),
  weatherCitySubmit: document.querySelector("#weather-city-submit"),
  weatherCityToggle: document.querySelector("#weather-city-toggle"),
  weatherSummary: document.querySelector("#weather-summary"),
  taskCount: document.querySelector("#task-count"),
  taskError: document.querySelector("#task-error"),
  taskStatus: document.querySelector("#task-status"),
  taskForm: document.querySelector("#task-form"),
  taskInput: document.querySelector("#task-input"),
  taskList: document.querySelector("#task-list"),
  intentionForm: document.querySelector("#intention-form"),
  intentionInput: document.querySelector("#intention-input"),
  intentionText: document.querySelector("#intention-text"),
  intentionError: document.querySelector("#intention-error"),
  editIntention: document.querySelector("#edit-intention"),
  clearIntention: document.querySelector("#clear-intention"),
  cancelIntention: document.querySelector("#cancel-intention"),
  toast: document.querySelector("#toast")
};

let tasks = [];
let dailyIntention = null;
let customQuotes = [];
let toastTimeout;
let dragDepth = 0;
let dailyWeather = "";
let showDailyQuote = true;
let currentLocalDate = "";

const backgroundOptions = [
  { name: "Wildflower field", path: "assets/default-background.jpg" },
  { name: "Alpine lake", path: "assets/alpine-lake.jpg" },
  { name: "Golden coast", path: "assets/golden-coast.jpg" },
  { name: "Misty meadow", path: "assets/misty-meadow.jpg" },
  { name: "Open ocean", path: "assets/ocean-blue.jpg" },
  { name: "Forest light", path: "assets/forest-light.jpg" }
];

const dailyQuotes = [
  { text: "Begin where you are, and let the next step be enough." },
  { text: "Make room for the work that matters most." },
  { text: "A steady pace can carry you a long way." },
  { text: "Small acts of care shape an ordinary day." },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "You do not need to do everything to do something meaningful." },
  { text: "Let curiosity lead you into the next hour." },
  { text: "How wonderful it is that nobody need wait a single moment before starting to improve the world.", author: "Anne Frank" },
  { text: "Forever is composed of nows.", author: "Emily Dickinson" },
  { text: "The day is wide enough for a fresh beginning." },
  { text: "Choose presence over hurry when you can." },
  { text: "A little patience makes space for good work." },
  { text: "Return to the task in front of you." },
  { text: "There is value in showing up with care." },
  { text: "Keep what is useful; release what is not." },
  { text: "One clear choice can change the shape of a day." },
  { text: "Let today be thoughtful, not perfect." },
  { text: "Rest and focus are both part of moving forward." },
  { text: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson" },
  { text: "Start simply. Keep going gently." },
  { text: "Make your next step a kind one." },
  { text: "A pause can help you see the way ahead." },
  { text: "Use your energy on what you value." },
  { text: "Every finished thing began unfinished." },
  { text: "Leave a little space for possibility." },
  { text: "Take the time you need to do it well." },
  { text: "Let intention set the tone for action." },
  { text: "There is strength in beginning again." },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Be here for the life inside this day." }
];

function getStoredValues(keys) {
  if (globalThis.chrome?.storage?.local) {
    return chrome.storage.local.get(keys);
  }

  return Promise.resolve(Object.fromEntries(keys.map((key) => {
    try {
      return [key, JSON.parse(localStorage.getItem(key))];
    } catch {
      return [key, null];
    }
  })));
}

function setStoredValues(values) {
  if (globalThis.chrome?.storage?.local) {
    return chrome.storage.local.set(values);
  }

  for (const [key, value] of Object.entries(values)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  return Promise.resolve();
}

function removeStoredValue(key) {
  if (globalThis.chrome?.storage?.local) {
    return chrome.storage.local.remove(key);
  }

  localStorage.removeItem(key);
  return Promise.resolve();
}

function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(now);

  elements.greeting.textContent = dailyWeather ? `${greeting.slice(0, -1)}, ${dailyWeather}.` : greeting;
  elements.clock.textContent = time;
  elements.clock.setAttribute("aria-label", `Current local time: ${time}`);
  elements.date.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);

  const localDate = getLocalDateKey(now);
  if (localDate !== currentLocalDate) {
    currentLocalDate = localDate;
    renderDailyQuote();
    renderDailyIntention();
  }
}

function renderDailyQuote() {
  const today = new Date();
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000);
  const quotes = [...dailyQuotes, ...customQuotes];
  const quoteIndex = ((dayNumber % quotes.length) + quotes.length) % quotes.length;
  const quote = quotes[quoteIndex];
  elements.dailyQuote.textContent = quote.text;
  elements.dailyQuoteAuthor.textContent = quote.author || "A thought for today";
  elements.dailyQuote.dataset.date = getLocalDateKey(today);
  elements.quoteArea.hidden = !showDailyQuote;
}

function renderDailyIntention() {
  const text = dailyIntention?.date === getLocalDateKey() ? dailyIntention.text : "";
  const hasIntention = Boolean(text);
  elements.intentionText.textContent = text;
  elements.intentionText.hidden = !hasIntention || !elements.intentionForm.hidden;
  elements.editIntention.textContent = hasIntention ? "Edit intention" : "Set intention";
  elements.clearIntention.hidden = !hasIntention || !elements.intentionForm.hidden;
  if (!hasIntention) elements.intentionInput.value = "";
}

function editDailyIntention() {
  const existing = dailyIntention?.date === getLocalDateKey() ? dailyIntention.text : "";
  elements.intentionInput.value = existing;
  elements.intentionError.textContent = "";
  elements.intentionForm.hidden = false;
  renderDailyIntention();
  elements.intentionInput.focus();
}

async function saveDailyIntention(event) {
  event.preventDefault();
  const text = elements.intentionInput.value.trim();
  if (!text) {
    elements.intentionError.textContent = "Add an intention before saving.";
    elements.intentionInput.focus();
    return;
  }

  const intention = { date: getLocalDateKey(), text };
  try {
    await setStoredValues({ dailyIntention: intention });
    dailyIntention = intention;
    elements.intentionForm.hidden = true;
    renderDailyIntention();
    elements.editIntention.focus();
  } catch {
    showToast("Your intention could not be saved.");
  }
}

async function clearDailyIntention() {
  try {
    await removeStoredValue("dailyIntention");
    dailyIntention = null;
    elements.intentionForm.hidden = true;
    renderDailyIntention();
    elements.editIntention.focus();
  } catch {
    showToast("Your intention could not be cleared.");
  }
}

function renderCustomQuotes() {
  elements.customQuoteList.replaceChildren();
  elements.customQuoteEmpty.hidden = customQuotes.length > 0;

  for (const quote of customQuotes) {
    const item = document.createElement("li");
    item.className = "custom-quote-item";

    const text = document.createElement("span");
    text.className = "custom-quote-item-text";
    text.textContent = quote.author ? `${quote.text} — ${quote.author}` : quote.text;

    const remove = document.createElement("button");
    remove.className = "custom-quote-remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove quote: ${quote.text}`);
    remove.addEventListener("click", () => removeCustomQuote(quote.id));

    item.append(text, remove);
    elements.customQuoteList.append(item);
  }
}

async function addCustomQuote(event) {
  event.preventDefault();
  const text = elements.customQuoteText.value.trim();
  if (!text) {
    elements.quoteError.textContent = "Enter a quote before adding it.";
    elements.customQuoteText.focus();
    return;
  }

  const quote = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    author: elements.customQuoteAuthor.value.trim()
  };
  const nextQuotes = [...customQuotes, quote];
  try {
    await setStoredValues({ customQuotes: nextQuotes });
    customQuotes = nextQuotes;
    elements.customQuoteForm.reset();
    elements.quoteError.textContent = "";
    renderCustomQuotes();
    renderDailyQuote();
    elements.customQuoteText.focus();
  } catch {
    showToast("Your quote could not be saved.");
  }
}

async function removeCustomQuote(quoteId) {
  const nextQuotes = customQuotes.filter((quote) => quote.id !== quoteId);
  try {
    await setStoredValues({ customQuotes: nextQuotes });
    customQuotes = nextQuotes;
    renderCustomQuotes();
    renderDailyQuote();
    elements.customQuoteText.focus();
  } catch {
    showToast("Your quote could not be removed.");
  }
}

async function updateDailyQuoteVisibility() {
  const nextVisibility = elements.showDailyQuote.checked;
  try {
    await setStoredValues({ showDailyQuote: nextVisibility });
    showDailyQuote = nextVisibility;
    renderDailyQuote();
  } catch {
    elements.showDailyQuote.checked = showDailyQuote;
    showToast("Your quote preference could not be saved.");
  }
}

function renderBackgroundGallery() {
  elements.gallery.replaceChildren();
  for (const option of backgroundOptions) {
    const button = document.createElement("button");
    button.className = "background-option";
    button.type = "button";
    button.setAttribute("aria-label", `Use ${option.name} background`);
    button.style.backgroundImage = `url("${option.path}")`;

    const name = document.createElement("span");
    name.textContent = option.name;
    button.append(name);
    button.addEventListener("click", async () => {
      try {
        await setStoredValues({ customBackground: option.path });
        applyBackground(option.path);
        elements.photoDialog.close();
        showToast(`${option.name} is now your background.`);
      } catch {
        showToast("Your background could not be saved.");
      }
    });
    elements.gallery.append(button);
  }
}

function weatherDescription(code, precipitation) {
  if (code === 0) return "clear skies";
  if (code === 1) return "mostly clear skies";
  if (code === 2) return "partly cloudy skies";
  if (code === 3) return "cloudy skies";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 66].includes(code)) return precipitation > 5 ? "moderate rain" : "light rain";
  if ([63, 67].includes(code)) return "rain";
  if (code === 65) return "heavy rain";
  if ([71, 73, 77, 85].includes(code)) return "snow";
  if (code === 75 || code === 86) return "heavy snow";
  if ([80, 81].includes(code)) return "rain showers";
  if (code === 82) return "heavy rain showers";
  if ([95, 96, 99].includes(code)) return "thunderstorms";
  return "a changing forecast";
}

function requestPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 30 * 60 * 1000
    });
  });
}

async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "weather_code,precipitation_sum",
    forecast_days: "1",
    timezone: "auto"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("Forecast unavailable");
  const forecast = await response.json();
  return weatherDescription(forecast.daily.weather_code[0], forecast.daily.precipitation_sum[0]);
}

function showForecast(description, place, locationButtonText) {
  dailyWeather = `expecting ${description} today`;
  elements.weatherSummary.textContent = `Forecast for ${place} updated`;
  elements.weatherButton.textContent = locationButtonText;
  updateClock();
}

async function updateWeather() {
  elements.weatherButton.disabled = true;
  elements.weatherButton.textContent = "Checking...";
  elements.weatherSummary.textContent = "Getting your local forecast";
  try {
    const position = await requestPosition();
    const description = await fetchForecast(position.coords.latitude, position.coords.longitude);
    showForecast(description, "your area", "Refresh nearby");
  } catch (error) {
    dailyWeather = "";
    updateClock();
    elements.weatherSummary.textContent = error.code === 1
      ? "Location access is off. Allow it to see your forecast."
      : "Could not get the forecast. Check location and connection.";
    elements.weatherButton.textContent = "Try again";
  } finally {
    elements.weatherButton.disabled = false;
  }
}

async function updateWeatherForCity(event) {
  event.preventDefault();
  const city = elements.weatherCityInput.value.trim();
  if (!city) {
    elements.weatherCityInput.focus();
    return;
  }

  elements.weatherCitySubmit.disabled = true;
  elements.weatherCitySubmit.textContent = "...";
  elements.weatherSummary.textContent = `Searching for ${city}`;
  try {
    const params = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
    const response = await fetch(`https://api.open-meteo.com/v1/search?${params}`);
    if (!response.ok) throw new Error("City search unavailable");
    const results = await response.json();
    const location = results.results?.[0];
    if (!location) throw new Error("City not found");

    const description = await fetchForecast(location.latitude, location.longitude);
    showForecast(description, location.name, "Use my location");
    elements.weatherCityForm.hidden = true;
    elements.weatherCityToggle.hidden = false;
  } catch {
    dailyWeather = "";
    updateClock();
    elements.weatherSummary.textContent = "Couldn't find that city or load its forecast.";
  } finally {
    elements.weatherCitySubmit.disabled = false;
    elements.weatherCitySubmit.textContent = "Find";
  }
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3200);
}

function renderTasks(focusTarget = null) {
  elements.taskList.replaceChildren();
  const openCount = tasks.filter((task) => !task.completed).length;
  elements.taskCount.textContent = `${openCount} open`;
  elements.emptyState.hidden = tasks.length > 0;

  for (const [index, task] of tasks.entries()) {
    const row = document.createElement("li");
    row.className = `task-row${task.completed ? " is-complete" : ""}`;

    const toggle = document.createElement("button");
    toggle.className = "task-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", String(task.completed));
    toggle.setAttribute("aria-label", `${task.completed ? "Mark incomplete" : "Complete"}: ${task.text}`);
    toggle.addEventListener("click", () => {
      tasks = tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item);
      renderTasks();
      persistTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const moveUp = document.createElement("button");
    moveUp.className = "task-reorder";
    moveUp.type = "button";
    moveUp.disabled = index === 0;
    moveUp.title = "Move task up";
    moveUp.setAttribute("aria-label", `Move up: ${task.text}`);
    moveUp.dataset.taskId = task.id;
    moveUp.dataset.action = "move-up";
    moveUp.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m6 14 6-6 6 6" /></svg>';
    moveUp.addEventListener("click", () => moveTask(task.id, -1, "move-up"));

    const moveDown = document.createElement("button");
    moveDown.className = "task-reorder";
    moveDown.type = "button";
    moveDown.disabled = index === tasks.length - 1;
    moveDown.title = "Move task down";
    moveDown.setAttribute("aria-label", `Move down: ${task.text}`);
    moveDown.dataset.taskId = task.id;
    moveDown.dataset.action = "move-down";
    moveDown.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m6 10 6 6 6-6" /></svg>';
    moveDown.addEventListener("click", () => moveTask(task.id, 1, "move-down"));

    const remove = document.createElement("button");
    remove.className = "task-delete";
    remove.type = "button";
    remove.setAttribute("aria-label", `Delete: ${task.text}`);
    remove.title = "Delete task";
    remove.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m7 7 10 10M17 7 7 17" /></svg>';
    remove.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      renderTasks();
      persistTasks();
    });

    row.append(toggle, text, moveUp, moveDown, remove);
    elements.taskList.append(row);
  }

  if (focusTarget) {
    const focusAction = nextTaskAction(tasks, focusTarget);
    const focusButton = Array.from(elements.taskList.querySelectorAll("button[data-task-id]"))
      .find((button) => button.dataset.taskId === focusTarget.taskId && button.dataset.action === focusAction);
    focusButton?.focus();
  }
}

function nextTaskAction(taskList, focusTarget) {
  const index = taskList.findIndex((task) => task.id === focusTarget.taskId);
  if (focusTarget.action === "move-up" && index === 0) return "move-down";
  if (focusTarget.action === "move-down" && index === taskList.length - 1) return "move-up";
  return focusTarget.action;
}

function moveTask(taskId, direction, action) {
  const index = tasks.findIndex((task) => task.id === taskId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= tasks.length) return;

  const nextTasks = [...tasks];
  [nextTasks[index], nextTasks[nextIndex]] = [nextTasks[nextIndex], nextTasks[index]];
  tasks = nextTasks;
  renderTasks({ taskId, action });
  elements.taskStatus.textContent = `Moved task to position ${nextIndex + 1} of ${tasks.length}.`;
  persistTasks();
}

async function persistTasks() {
  try {
    await setStoredValues({ tasks });
  } catch {
    showToast("Your changes could not be saved. Check extension storage.");
  }
}

function applyBackground(imageData) {
  elements.background.style.backgroundImage = imageData ? `url("${imageData}")` : "";
}

async function setBackgroundFromFile(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    showToast("Choose a JPG, PNG, WebP, or GIF image.");
    return;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 2200;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#24362f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    let imageData = canvas.toDataURL("image/jpeg", 0.82);
    if (imageData.length > 4_000_000) {
      imageData = canvas.toDataURL("image/jpeg", 0.68);
    }
    if (imageData.length > 4_000_000) {
      const smallerCanvas = document.createElement("canvas");
      smallerCanvas.width = Math.round(canvas.width * 0.75);
      smallerCanvas.height = Math.round(canvas.height * 0.75);
      smallerCanvas.getContext("2d").drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
      imageData = smallerCanvas.toDataURL("image/jpeg", 0.68);
    }

    await setStoredValues({ customBackground: imageData });
    applyBackground(imageData);
    showToast("Your background photo is set.");
  } catch {
    showToast("That image could not be opened. Try another photo.");
  }
}

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = elements.taskInput.value.trim();
  if (!text) {
    elements.taskError.textContent = "Add a task before saving.";
    elements.taskInput.focus();
    return;
  }

  elements.taskError.textContent = "";
  tasks = [...tasks, {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false
  }];
  elements.taskInput.value = "";
  renderTasks();
  persistTasks();
  elements.taskInput.focus();
});

elements.taskInput.addEventListener("input", () => {
  elements.taskError.textContent = "";
});
elements.editIntention.addEventListener("click", editDailyIntention);
elements.clearIntention.addEventListener("click", clearDailyIntention);
elements.cancelIntention.addEventListener("click", () => {
  elements.intentionForm.hidden = true;
  elements.intentionError.textContent = "";
  renderDailyIntention();
  elements.editIntention.focus();
});
elements.intentionForm.addEventListener("submit", saveDailyIntention);
elements.intentionInput.addEventListener("input", () => {
  elements.intentionError.textContent = "";
});
elements.showDailyQuote.addEventListener("change", updateDailyQuoteVisibility);
elements.customQuoteForm.addEventListener("submit", addCustomQuote);
elements.customQuoteText.addEventListener("input", () => {
  elements.quoteError.textContent = "";
});

elements.changePhoto.addEventListener("click", () => elements.photoDialog.showModal());
elements.closePhotoDialog.addEventListener("click", () => elements.photoDialog.close());
elements.photoDialog.addEventListener("click", (event) => {
  if (event.target === elements.photoDialog) elements.photoDialog.close();
});
elements.uploadPhoto.addEventListener("click", () => {
  elements.photoDialog.close();
  elements.photoInput.click();
});
elements.weatherButton.addEventListener("click", updateWeather);
elements.weatherCityToggle.addEventListener("click", () => {
  elements.weatherCityForm.hidden = false;
  elements.weatherCityToggle.hidden = true;
  elements.weatherCityInput.focus();
});
elements.weatherCityForm.addEventListener("submit", updateWeatherForCity);
elements.photoInput.addEventListener("change", async () => {
  await setBackgroundFromFile(elements.photoInput.files?.[0]);
  elements.photoInput.value = "";
});

elements.resetPhoto.addEventListener("click", async () => {
  try {
    await removeStoredValue("customBackground");
    applyBackground("");
    showToast("The built-in background is restored.");
  } catch {
    showToast("The background could not be reset.");
  }
});

function containsFiles(event) {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

document.addEventListener("dragenter", (event) => {
  if (!containsFiles(event)) return;
  event.preventDefault();
  dragDepth += 1;
  document.body.classList.add("is-dragging");
});

document.addEventListener("dragover", (event) => {
  if (containsFiles(event)) event.preventDefault();
});

document.addEventListener("dragleave", (event) => {
  if (!containsFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) document.body.classList.remove("is-dragging");
});

document.addEventListener("drop", async (event) => {
  if (!containsFiles(event)) return;
  event.preventDefault();
  dragDepth = 0;
  document.body.classList.remove("is-dragging");
  await setBackgroundFromFile(event.dataTransfer.files?.[0]);
});

async function initialize() {
  updateClock();
  window.setInterval(updateClock, 1000);

  try {
    const stored = await getStoredValues(["tasks", "customBackground", "dailyIntention", "customQuotes", "showDailyQuote"]);
    tasks = Array.isArray(stored.tasks)
      ? stored.tasks
        .filter((task) => task && typeof task.text === "string")
        .map((task, index) => ({
          ...task,
          id: typeof task.id === "string" && task.id ? task.id : `stored-${index}-${task.text}`,
          completed: task.completed === true
        }))
      : [];
    dailyIntention = stored.dailyIntention
      && stored.dailyIntention.date === getLocalDateKey()
      && typeof stored.dailyIntention.text === "string"
      ? stored.dailyIntention
      : null;
    customQuotes = Array.isArray(stored.customQuotes)
      ? stored.customQuotes
        .filter((quote) => quote && typeof quote.text === "string" && quote.text.trim())
        .map((quote, index) => ({
          id: typeof quote.id === "string" && quote.id ? quote.id : `custom-${index}`,
          text: quote.text.trim(),
          author: typeof quote.author === "string" ? quote.author.trim() : ""
        }))
      : [];
    showDailyQuote = stored.showDailyQuote !== false;
    elements.showDailyQuote.checked = showDailyQuote;
    renderTasks();
    renderCustomQuotes();
    renderDailyQuote();
    renderDailyIntention();
    if (typeof stored.customBackground === "string" && (stored.customBackground.startsWith("data:image/") || backgroundOptions.some((option) => option.path === stored.customBackground))) {
      applyBackground(stored.customBackground);
    }
    if (navigator.permissions?.query) {
      const locationPermission = await navigator.permissions.query({ name: "geolocation" }).catch(() => null);
      if (locationPermission?.state === "granted") updateWeather();
    }
  } catch {
    renderTasks();
    renderCustomQuotes();
    renderDailyQuote();
    renderDailyIntention();
    showToast("Saved items could not be loaded.");
  }
}

renderBackgroundGallery();
renderDailyQuote();
initialize();