const elements = {
  background: document.querySelector(".backdrop"),
  changePhoto: document.querySelector("#change-photo"),
  clock: document.querySelector("#clock"),
  date: document.querySelector("#today-date"),
  emptyState: document.querySelector("#empty-state"),
  greeting: document.querySelector("#greeting"),
  photoInput: document.querySelector("#photo-input"),
  resetPhoto: document.querySelector("#reset-photo"),
  taskCount: document.querySelector("#task-count"),
  taskError: document.querySelector("#task-error"),
  taskForm: document.querySelector("#task-form"),
  taskInput: document.querySelector("#task-input"),
  taskList: document.querySelector("#task-list"),
  toast: document.querySelector("#toast")
};

let tasks = [];
let toastTimeout;
let dragDepth = 0;

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

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(now);

  elements.greeting.textContent = greeting;
  elements.clock.textContent = time;
  elements.clock.setAttribute("aria-label", `Current local time: ${time}`);
  elements.date.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3200);
}

function renderTasks() {
  elements.taskList.replaceChildren();
  const openCount = tasks.filter((task) => !task.completed).length;
  elements.taskCount.textContent = `${openCount} ${openCount === 1 ? "open" : "open"}`;
  elements.emptyState.hidden = tasks.length > 0;

  for (const task of tasks) {
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

    row.append(toggle, text, remove);
    elements.taskList.append(row);
  }
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

elements.changePhoto.addEventListener("click", () => elements.photoInput.click());
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
    const stored = await getStoredValues(["tasks", "customBackground"]);
    tasks = Array.isArray(stored.tasks) ? stored.tasks.filter((task) => task && typeof task.text === "string") : [];
    renderTasks();
    if (typeof stored.customBackground === "string" && stored.customBackground.startsWith("data:image/")) {
      applyBackground(stored.customBackground);
    }
  } catch {
    renderTasks();
    showToast("Saved items could not be loaded.");
  }
}

initialize();