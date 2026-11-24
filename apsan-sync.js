/* APSAN CMS bridge — reads public content from Website-Management */
(function () {
  "use strict";
  const OWNER = "mateus-max";
  const REPO = "Website-Management";
  const BRANCH = "main";
  const API = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/";
  const RAW = "https://raw.githubusercontent.com/" + OWNER + "/" + REPO + "/" + BRANCH + "/";
  const esc = (v) => String(v || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const asset = (v) => {
    if (!v) return "";
    if (/^https?:\/\//i.test(v) || v.startsWith("data:")) return v;
    return RAW + "public/" + (v.startsWith("/") ? v.slice(1) : v);
  };
  function parseMarkdown(text) {
    const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
    const meta = {};
    let body = "";
    if (match) {
      body = match[2] || "";
      match[1].split(/\r?\n/).forEach(line => {
        const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!m) return;
        let value = m[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        meta[m[1]] = value;
      });
    } else body = text;
    meta.body = meta.body || body;
    return meta;
  }
  const isPublished = item => ["true","yes","1"].includes(String(item.published || "").toLowerCase());
  async function loadCollection(folder) {
    try {
      const res = await fetch(API + folder + "?ref=" + BRANCH, {cache:"no-store", headers:{"Accept":"application/vnd.github+json"}});
      if (!res.ok) return [];
      const files = await res.json();
      return Promise.all(files.filter(f => f.type === "file" && /\.md$/i.test(f.name)).map(async f => {
        const r = await fetch(f.download_url + "?v=" + Date.now(), {cache:"no-store"});
        if (!r.ok) return null;
        const data = parseMarkdown(await r.text());
        data._filename = f.name;
        return data;
      }));
    } catch (e) {
      console.warn("[APSAN CMS] Não foi possível carregar " + folder, e);
      return [];
    }
  }
  function serviceCard(item, index) {
    const icon = item.icon ? '<i class="' + esc(item.icon) + '"></i>' : '<i class="fas fa-briefcase"></i>';
    const image = item.image ? '<img src="' + esc(asset(item.image)) + '" alt="' + esc(item.title) + '" loading="lazy">' : "";
    return '<article class="service-card apsan-cms-card">' +
      (image ? '<div class="apsan-cms-image">' + image + '</div>' : '<div class="apsan-cms-icon">' + icon + '</div>') +
      '<h3>' + esc(item.title) + '</h3><p>' + esc(item.summary || "") + '</p>' +
      (item.price ? '<strong class="apsan-cms-price">' + esc(item.price) + '</strong>' : '') +
      (item.details ? '<details><summary>Ver detalhes</summary><p>' + esc(item.details) + '</p></details>' : '') +
      '</article>';
  }
  function postCard(item) {
    const image = item.coverImage || item.image;
    const body = String(item.body || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return '<article class="apsan-cms-post">' +
      (image ? '<img src="' + esc(asset(image)) + '" alt="' + esc(item.title) + '" loading="lazy">' : '') +
      '<div class="apsan-cms-post-body"><small>' + esc(item.category || "Notícias APSAN") + (item.date ? " · " + esc(item.date) : "") + '</small>' +
      '<h3>' + esc(item.title) + '</h3><p>' + esc(item.excerpt || body.slice(0,190)) + '</p>' +
      (body ? '<details><summary>Ler publicação</summary><p>' + esc(body) + '</p></details>' : '') +
      '</div></article>';
  }
  function youtubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || (u.pathname.match(/\/embed\/([^/]+)/) || [])[1] || (u.pathname.match(/\/shorts\/([^/]+)/) || [])[1];
    } catch (_) {}
    return null;
  }
  function videoCard(item) {
    const id = youtubeId(item.url || "");
    if (!id) return "";
    return '<article class="apsan-cms-video"><div class="apsan-cms-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '" title="' + esc(item.title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="apsan-cms-video-copy"><h3>' + esc(item.title) + '</h3><p>' + esc(item.description || "") + '</p></div></article>';
  }
  async function init() {
    const [services, posts, videos] = await Promise.all([
      loadCollection("content/services"), loadCollection("content/posts"), loadCollection("content/videos")
    ]);
    const liveServices = services.filter(isPublished);
    const livePosts = posts.filter(isPublished).sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    const liveVideos = videos.filter(isPublished);
    const serviceSection = document.querySelector("#services");
    if (serviceSection && liveServices.length) {
      let box = document.getElementById("apsanCmsServices");
      if (!box) {
        box = document.createElement("div");
        box.id = "apsanCmsServices";
        box.className = "apsan-cms-services";
        box.innerHTML = '<h2>Outros serviços e soluções</h2><div class="apsan-cms-service-grid"></div>';
        serviceSection.appendChild(box);
      }
      box.querySelector(".apsan-cms-service-grid").innerHTML = liveServices.map(serviceCard).join("");
    }
    const postsHost = document.getElementById("postsPageContainer");
    if (postsHost && livePosts.length) {
      let box = document.getElementById("apsanCmsPosts");
      if (!box) { box = document.createElement("div"); box.id = "apsanCmsPosts"; box.className = "apsan-cms-posts"; postsHost.appendChild(box); }
      box.innerHTML = livePosts.map(postCard).join("");
    }
    if (liveVideos.length) {
      let section = document.getElementById("apsanCmsVideos");
      if (!section) {
        section = document.createElement("section");
        section.id = "apsanCmsVideos";
        section.className = "apsan-cms-video-section";
        const home = document.querySelector("#home");
        const postsSection = document.getElementById("home-posts");
        if (postsSection && postsSection.parentNode) postsSection.insertAdjacentElement("afterend", section);
        else if (home) home.appendChild(section);
      }
      section.innerHTML = '<div class="apsan-cms-section-heading"><h2><i class="fab fa-youtube"></i> Vídeos da APSAN</h2><p>Conheça as nossas atividades, serviços e soluções em vídeo.</p></div><div class="apsan-cms-video-grid">' + liveVideos.map(videoCard).join("") + '</div>';
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
