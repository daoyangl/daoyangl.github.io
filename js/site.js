(function () {
  var THEME_KEY = "theme";

  function preferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀" : "☾";
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.title = theme === "dark" ? "Light mode" : "Dark mode";
    }
  }

  function initTheme() {
    applyTheme(preferredTheme());
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  function markActiveNav() {
    var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (path === "" || path === "post.html") path = path === "post.html" ? "archive.html" : "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      link.classList.toggle("active", href === path || (path === "index.html" && href === "./"));
    });
  }

  function parseFrontMatter(raw) {
    if (!raw.startsWith("---")) {
      return { meta: {}, body: raw };
    }
    var end = raw.indexOf("\n---", 3);
    if (end === -1) {
      return { meta: {}, body: raw };
    }
    var matter = raw.slice(3, end).trim();
    var body = raw.slice(end + 4).replace(/^\s*\n/, "");
    var meta = {};
    matter.split(/\r?\n/).forEach(function (line) {
      var i = line.indexOf(":");
      if (i === -1) return;
      var key = line.slice(0, i).trim();
      var value = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      meta[key] = value;
    });
    return { meta: meta, body: body };
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  function yearOf(iso) {
    return (iso || "").slice(0, 4) || "Unknown";
  }

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    });
  }

  function renderPostList(container, posts, limit) {
    if (!container) return;
    var list = Array.isArray(posts) ? posts.slice() : [];
    list.sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });
    if (typeof limit === "number") list = list.slice(0, limit);

    if (!list.length) {
      container.innerHTML = '<p class="empty-state">No posts yet.</p>';
      return;
    }

    var html = '<ul class="item-list">';
    list.forEach(function (post) {
      html +=
        "<li>" +
        '<span class="date">' +
        formatDate(post.date) +
        "</span>" +
        '<div><a class="title" href="post.html?slug=' +
        encodeURIComponent(post.slug) +
        '">' +
        escapeHtml(post.title) +
        "</a></div>" +
        "</li>";
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  function renderArchive(container, posts) {
    if (!container) return;
    var list = (posts || []).slice().sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });

    if (!list.length) {
      container.innerHTML = '<p class="empty-state">No posts yet.</p>';
      return;
    }

    var byYear = {};
    list.forEach(function (post) {
      var y = yearOf(post.date);
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(post);
    });

    var years = Object.keys(byYear).sort(function (a, b) {
      return b.localeCompare(a);
    });

    var html = "";
    years.forEach(function (year) {
      html += '<section class="year-block"><h2>' + year + ' <span class="count">' + byYear[year].length + "</span></h2>";
      html += '<ul class="item-list">';
      byYear[year].forEach(function (post) {
        html +=
          "<li>" +
          '<span class="date">' +
          formatDate(post.date) +
          "</span>" +
          '<div><a class="title" href="post.html?slug=' +
          encodeURIComponent(post.slug) +
          '">' +
          escapeHtml(post.title) +
          "</a></div>" +
          "</li>";
      });
      html += "</ul></section>";
    });
    container.innerHTML = html;
  }

  function highlightSelf(authors) {
    return escapeHtml(authors || "").replace(
      /Daoyang Li(†?)/g,
      "<strong><em>Daoyang Li$1</em></strong>"
    );
  }

  function researchEntryHtml(item, opts) {
    opts = opts || {};
    var title = '<div class="pub-title">' + escapeHtml(item.title || "") + "</div>";
    var authors = item.authors
      ? '<div class="pub-authors">' + highlightSelf(item.authors) + "</div>"
      : "";
    var venueParts = [];
    if (item.venue) {
      venueParts.push('<em class="pub-venue">' + escapeHtml(item.venue) + "</em>");
    }
    if (item.url) {
      venueParts.push(
        '[<a href="' + escapeAttr(item.url) + '" target="_blank" rel="noopener">Paper</a>]'
      );
    }
    var venue = venueParts.length
      ? '<div class="pub-venue-line">' + venueParts.join(" ") + "</div>"
      : "";

    if (opts.compact) {
      return (
        "<li>" +
        '<span class="date">' +
        escapeHtml(String(item.year || "")) +
        "</span>" +
        "<div>" +
        (item.url
          ? '<a class="title" href="' +
            escapeAttr(item.url) +
            '" target="_blank" rel="noopener">' +
            escapeHtml(item.title || "") +
            "</a>"
          : '<span class="title">' + escapeHtml(item.title || "") + "</span>") +
        (item.venue ? '<div class="meta">' + escapeHtml(item.venue) + "</div>" : "") +
        "</div>" +
        "</li>"
      );
    }

    return '<li class="pub-item">' + title + authors + venue + "</li>";
  }

  function renderResearch(container, items, limit) {
    if (!container) return;
    var list = (items || []).slice().sort(function (a, b) {
      return (b.year || 0) - (a.year || 0);
    });
    if (typeof limit === "number") list = list.slice(0, limit);

    if (!list.length) {
      container.innerHTML = '<p class="empty-state">No research items yet.</p>';
      return;
    }

    var html = '<ul class="item-list">';
    list.forEach(function (item) {
      html += researchEntryHtml(item, { compact: true });
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  function renderResearchArchive(container, items) {
    if (!container) return;
    var list = (items || []).slice().sort(function (a, b) {
      return (b.year || 0) - (a.year || 0);
    });

    var byYear = {};
    list.forEach(function (item) {
      var y = String(item.year || "Other");
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(item);
    });

    var years = Object.keys(byYear).sort(function (a, b) {
      return b.localeCompare(a);
    });

    var html = "";
    years.forEach(function (year) {
      html += '<section class="year-block"><h2>' + year + ' <span class="count">' + byYear[year].length + "</span></h2>";
      html += '<ul class="pub-list">';
      byYear[year].forEach(function (item) {
        html += researchEntryHtml(item);
      });
      html += "</ul></section>";
    });
    container.innerHTML = html || '<p class="empty-state">No research items yet.</p>';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function renderHomeIntro(data) {
    var container = document.getElementById("home-intro");
    if (!container || !data) return;

    var social = (data.social || [])
      .map(function (item) {
        return (
          '<a href="' +
          escapeAttr(item.url || "#") +
          '" target="_blank" rel="noopener">' +
          escapeHtml(item.label || "") +
          "</a>"
        );
      })
      .join("");

    container.innerHTML =
      '<img class="intro-photo" src="' +
      escapeAttr(data.photo || "") +
      '" alt="' +
      escapeAttr(data.photoAlt || data.name || "") +
      '" />' +
      "<div>" +
      "<h1>" +
      escapeHtml(data.name || "") +
      "</h1>" +
      "<p>" +
      (data.bio || "") +
      "</p>" +
      (data.email ? '<p class="muted">' + escapeHtml(data.email) + "</p>" : "") +
      (social ? '<div class="social-links">' + social + "</div>" : "") +
      "</div>";
  }

  function renderAbout(data) {
    var whatEl = document.getElementById("about-what");
    var expEl = document.getElementById("about-experience");
    var eduEl = document.getElementById("about-education");
    if (!whatEl && !expEl && !eduEl) return;

    if (whatEl) {
      var paras = data.whatIDo || [];
      whatEl.innerHTML = paras
        .map(function (p) {
          return "<p>" + p + "</p>";
        })
        .join("");
    }

    function renderTimeline(container, items) {
      if (!container) return;
      var list = items || [];
      if (!list.length) {
        container.innerHTML = '<li class="empty-state">No items yet.</li>';
        return;
      }
      container.innerHTML = list
        .map(function (item) {
          var detail = item.detail
            ? '<p class="detail">' + item.detail + "</p>"
            : "";
          return (
            "<li>" +
            '<div class="role">' +
            escapeHtml(item.role || "") +
            "</div>" +
            '<div class="org">' +
            escapeHtml(item.org || "") +
            "</div>" +
            '<div class="when">' +
            escapeHtml(item.when || "") +
            "</div>" +
            detail +
            "</li>"
          );
        })
        .join("");
    }

    renderTimeline(expEl, data.experience);
    renderTimeline(eduEl, data.education);
  }

  function rewritePostAssetUrls(root, slug) {
    if (!root) return;
    var base = "posts/" + slug + "/";
    root.querySelectorAll("img[src], a[href], source[src], video[src]").forEach(function (el) {
      var attr = el.hasAttribute("src") ? "src" : "href";
      var value = el.getAttribute(attr);
      if (!value) return;
      if (/^(https?:|data:|mailto:|tel:|#|\/)/i.test(value)) return;
      el.setAttribute(attr, base + value.replace(/^\.\//, ""));
    });
  }

  function loadPostPage() {
    var params = new URLSearchParams(location.search);
    var slug = params.get("slug");
    var titleEl = document.getElementById("post-title");
    var dateEl = document.getElementById("post-date");
    var bodyEl = document.getElementById("post-body");
    if (!bodyEl) return;

    if (!slug) {
      bodyEl.innerHTML = '<p class="empty-state">Missing post slug.</p>';
      return;
    }

    function fetchPostMarkdown(slug) {
      var primary = "posts/" + slug + "/index.md";
      return fetch(primary).then(function (res) {
        if (res.ok) return res;
        // Fallback for older flat paths during migration / cache
        return fetch("posts/" + slug + ".md");
      });
    }

    Promise.all([fetchJson("data/posts.json"), fetchPostMarkdown(slug)])
      .then(function (results) {
        var index = results[0];
        var res = results[1];
        if (!res.ok) throw new Error("Post not found");
        return res.text().then(function (raw) {
          return { index: index, raw: raw };
        });
      })
      .then(function (payload) {
        var parsed = parseFrontMatter(payload.raw);
        var fromIndex = (payload.index || []).find(function (p) {
          return p.slug === slug;
        }) || {};
        var title = parsed.meta.title || fromIndex.title || slug;
        var date = parsed.meta.date || fromIndex.date || "";
        if (titleEl) titleEl.textContent = title;
        if (dateEl) dateEl.textContent = formatDate(date);
        document.title = title + " · Daoyang Li";
        if (typeof marked !== "undefined") {
          bodyEl.innerHTML = marked.parse(parsed.body);
        } else {
          bodyEl.innerHTML = "<pre>" + escapeHtml(parsed.body) + "</pre>";
        }
        rewritePostAssetUrls(bodyEl, slug);
      })
      .catch(function (err) {
        console.error(err);
        bodyEl.innerHTML = '<p class="empty-state">Unable to load this post.</p>';
      });
  }

  function boot() {
    initTheme();
    markActiveNav();

    var homeIntro = document.getElementById("home-intro");
    var recentPosts = document.getElementById("recent-posts");
    var archiveList = document.getElementById("archive-list");
    var recentResearch = document.getElementById("recent-research");
    var researchList = document.getElementById("research-list");
    var aboutWhat = document.getElementById("about-what");
    var postBody = document.getElementById("post-body");

    if (homeIntro) {
      fetchJson("data/home.json")
        .then(renderHomeIntro)
        .catch(function (err) {
          console.error(err);
          homeIntro.innerHTML = '<p class="empty-state">Unable to load intro.</p>';
        });
    }

    if (recentPosts || archiveList) {
      fetchJson("data/posts.json")
        .then(function (posts) {
          renderPostList(recentPosts, posts, 10);
          renderArchive(archiveList, posts);
        })
        .catch(function (err) {
          console.error(err);
          if (recentPosts) recentPosts.innerHTML = '<p class="empty-state">Unable to load posts.</p>';
          if (archiveList) archiveList.innerHTML = '<p class="empty-state">Unable to load posts.</p>';
        });
    }

    if (recentResearch || researchList) {
      fetchJson("data/research.json")
        .then(function (items) {
          renderResearch(recentResearch, items, 5);
          renderResearchArchive(researchList, items);
        })
        .catch(function (err) {
          console.error(err);
          if (recentResearch) recentResearch.innerHTML = '<p class="empty-state">Unable to load research.</p>';
          if (researchList) researchList.innerHTML = '<p class="empty-state">Unable to load research.</p>';
        });
    }

    if (aboutWhat || document.getElementById("about-experience") || document.getElementById("about-education")) {
      fetchJson("data/about.json")
        .then(renderAbout)
        .catch(function (err) {
          console.error(err);
          if (aboutWhat) aboutWhat.innerHTML = '<p class="empty-state">Unable to load about.</p>';
        });
    }

    if (postBody) loadPostPage();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
