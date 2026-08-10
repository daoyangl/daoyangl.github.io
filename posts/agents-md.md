---
title: Site notes: AGENTS.md
date: 2026-08-10
---

This is the first sample post on the redesigned site. The body below is adapted from the project `AGENTS.md` design brief.

## Goal

Present my background and work in a clear, visual way for colleagues, students, and industry peers.

## Site structure

1. **Home** — short intro, news, recent posts, and recent research
2. **Archive** — full posts list (each post is a separate Markdown file)
3. **Research** — research / publication list
4. **About** — what I do, experience timeline, and education

## Design principles

1. Soft gray or light yellow background for comfortable long reading
2. Keep the interface simple — avoid unnecessary ornament
3. Top navigation on every page: theme toggle on the left; Home / Archive / Research / About on the right
4. Page size, type size, and spacing should be easy to tune from one variables file (`css/tokens.css`)

## Page requirements

### Home

- Short personal introduction and social links
- Links to the latest posts (up to 10) with publish dates
- A compact view of recent research progress

### Archive / Research

Inspired by [Lilian Weng's archives](https://lilianweng.github.io/archives/): chronological, year-grouped lists.

### About

1. A short written section on what I am doing
2. Experience / positions
3. Education

## How to add a new post

1. Create `posts/your-slug.md` with YAML front matter (`title`, `date`)
2. Append an entry to `data/posts.json` with the same `slug`, `title`, and `date`
3. The home page and archive will pick it up automatically
