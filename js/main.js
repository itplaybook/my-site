import { loadProjects, renderProjects } from "./projects.js";

let projects = [];
const projectsStatus = document.querySelector("#projects-status");

function showTag(tag) {
  let shown = projects;
  if (tag !== "all") {
    shown = projects.filter((project) => project.tags.includes(tag));
  }
  renderProjects(shown);
}

const filterButtons = document.querySelector(".filter-buttons");

if (filterButtons) {
  filterButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }
    showTag(button.dataset.tag);
    for (const other of filterButtons.querySelectorAll("button")) {
      other.setAttribute("aria-pressed", "false");
    }
    button.setAttribute("aria-pressed", "true");
  });
}

const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleContact(form);
  });
}

function checkMessage(field, errorText) {
  if (field.value.trim().length < 20) {
    errorText.textContent = "Please write at least 20 characters.";
    field.setAttribute("aria-invalid", "true");
    field.focus();
    return false;
  }
  errorText.textContent = "";
  field.removeAttribute("aria-invalid");
  return true;
}

function handleContact(form) {
  const data = Object.fromEntries(new FormData(form));
  const field = form.querySelector("#message");
  if (!checkMessage(field, form.querySelector("#message-error"))) {
    return;
  }
  const subject = encodeURIComponent(`Message from ${data.name}`);
  const body = encodeURIComponent(data.message);
  const link = document.querySelector("#mail-link");
  link.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  link.hidden = false;
  document.querySelector("#message-copy").textContent = data.message;
  document.querySelector("#form-status").textContent =
    "Your message is ready. This site cannot send it, so use the link below.";
}

const reposUrl = "https://api.github.com/users/octocat/repos?sort=updated&per_page=5";

async function loadRepos() {
  const response = await fetch(reposUrl);
  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status}`);
  }
  const repos = await response.json();
  return repos;
}

function toProject(repo) {
  return {
    title: repo.name,
    description: repo.description ?? "No description",
    tags: [],
    url: repo.html_url
  };
}

async function showRepos() {
  projectsStatus.textContent = "Loading repositories...";
  try {
    const repos = await loadRepos();
    if (repos.length === 0) {
      projectsStatus.textContent = "No public repositories yet.";
      return;
    }
    for (const repo of repos) {
      projects.push(toProject(repo));
    }
    renderProjects(projects);
    projectsStatus.textContent = "";
  } catch (error) {
    projectsStatus.textContent = "Could not reach GitHub. Showing saved projects instead.";
    console.error(error);
  }
}

async function main() {
  if (!projectsStatus) {
    return;
  }
  projectsStatus.textContent = "Loading projects...";
  try {
    projects = await loadProjects();
    renderProjects(projects);
  } catch (error) {
    projectsStatus.textContent = "Projects could not be loaded.";
    console.error(error);
    return;
  }
  await showRepos();
}

main();
