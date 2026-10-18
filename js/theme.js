function readTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Blocked or full: the theme still changes, but is not remembered.
  }
}

const storedTheme = readTheme();
if (storedTheme === "light" || storedTheme === "dark") {
  document.documentElement.dataset.theme = storedTheme;
}

function currentTheme() {
  const chosen = document.documentElement.dataset.theme;
  if (chosen) {
    return chosen;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".theme-toggle");
  if (!button) {
    return;
  }
  button.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  button.addEventListener("click", () => {
    let next = "dark";
    if (currentTheme() === "dark") {
      next = "light";
    }
    document.documentElement.dataset.theme = next;
    saveTheme(next);
    button.setAttribute("aria-pressed", String(next === "dark"));
  });
});
