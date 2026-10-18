export async function loadProjects() {
  const response = await fetch("data/projects.json");
  if (!response.ok) {
    throw new Error(`Could not load projects: ${response.status}`);
  }
  const projects = await response.json();
  return projects;
}

export function createCard(project) {
  const template = document.querySelector("#project-card-template");
  const card = template.content.firstElementChild.cloneNode(true);
  const link = card.querySelector("a");
  link.href = project.url;
  link.textContent = project.title;
  card.querySelector("p").textContent = project.description;
  const tags = card.querySelector("ul");
  for (const tag of project.tags) {
    const item = document.createElement("li");
    item.textContent = tag;
    tags.append(item);
  }
  return card;
}

export function renderProjects(projects) {
  const grid = document.querySelector(".project-grid");
  if (!grid) {
    return;
  }
  grid.replaceChildren();
  for (const project of projects) {
    grid.append(createCard(project));
  }
}
