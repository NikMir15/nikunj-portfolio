// =========================
// Mobile Nav Toggle
// =========================
(() => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#main-nav");

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("active"));
  });
})();


// =========================
// Reveal on Scroll (animations)
// Add class="reveal" to sections/cards you want animated
// =========================
(() => {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((t) => obs.observe(t));
})();


// =========================
// Auto-load GitHub Projects (only on projects.html)
// Put this container in projects.html:
// <div class="projects-grid" id="github-projects"></div>
// =========================
(async () => {
  const container = document.getElementById("github-projects");
  if (!container) return; // run only on projects page

  const username = "NikMir15";
  const perPage = 12;

  container.innerHTML = `<div class="terminal">Loading projects from GitHub...</div>`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}`,
      { headers: { "Accept": "application/vnd.github+json" } }
    );

    if (!res.ok) {
      container.innerHTML = `<div class="terminal">Couldn’t load GitHub projects (HTTP ${res.status}).</div>`;
      return;
    }

    const repos = await res.json();

    const filtered = repos
      .filter(r => !r.fork)
      .filter(r => !r.archived);

    if (!filtered.length) {
      container.innerHTML = `<div class="terminal">No public repositories found.</div>`;
      return;
    }

    container.innerHTML = filtered.map(repo => {
      const name = repo.name || "Untitled";
      const desc = repo.description || "No description provided.";
      const lang = repo.language || "N/A";
      const stars = repo.stargazers_count ?? 0;
      const liveDemo = repo.homepage && repo.homepage.trim() ? repo.homepage : null;

      return `
        <div class="card reveal">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(desc)}</p>

          <div class="terminal" style="margin-top:12px;">
            <strong>Language:</strong> ${escapeHtml(lang)} &nbsp;|&nbsp; ⭐ ${stars}
          </div>

          <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
            <a class="btn" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Code</a>
            ${liveDemo ? `<a class="btn btn-outline" href="${liveDemo}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ""}
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="terminal">Unable to load projects. Check internet connection.</div>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/
