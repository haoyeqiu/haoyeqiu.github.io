import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label) => `<a href="${esc(url)}">${label}</a>`;
const emailLabel = esc(data.email.replace('@', ' [at] '));
const icon = name => {
  if (name === 'dblp') return '<img class="profile-icon dblp" src="images/dblp-official.png" width="192" height="192" alt="" aria-hidden="true">';
  // Font Awesome Free 6.5.2 building-columns, CC BY 4.0, Copyright 2024 Fonticons, Inc.
  // https://fontawesome.com/license/free — same icon and version as xuz2019.github.io/cv/.
  if (name === 'university') return '<svg class="profile-icon university" viewBox="0 0 512 512" style="color:#000" aria-hidden="true" focusable="false"><path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>';
  const shapes = {
    location: '<path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>',
    email: '<path d="M2 5h20v14H2V5Zm2 2v1l8 6 8-6V7l-8 6-8-6Z"/>',
    scholar: '<path d="m12 3-12 4 12 4 12-4-12-4ZM5 10.3v6.2c3.9 2.6 10.1 2.6 14 0v-6.2L12 13l-7-2.7ZM1 9v5l-1 4h3l-1-4V9.3L1 9Z"/>',
    github: '<path d="M12 .75a11.25 11.25 0 0 0-3.558 21.922c.563.104.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.51-3.79-1.51-.512-1.302-1.25-1.649-1.25-1.649-1.022-.699.078-.685.078-.685 1.13.079 1.724 1.16 1.724 1.16 1.005 1.722 2.635 1.225 3.277.937.102-.729.393-1.226.715-1.508-2.499-.284-5.126-1.25-5.126-5.565 0-1.23.44-2.234 1.16-3.022-.116-.285-.503-1.431.11-2.982 0 0 .945-.303 3.094 1.154a10.79 10.79 0 0 1 5.626 0c2.147-1.457 3.09-1.154 3.09-1.154.615 1.551.228 2.697.112 2.982.722.788 1.158 1.792 1.158 3.022 0 4.326-2.632 5.278-5.14 5.557.405.35.766 1.043.766 2.102 0 1.517-.014 2.741-.014 3.113 0 .3.203.65.774.54A11.25 11.25 0 0 0 12 .75Z"/>',
    orcid: '<circle cx="12" cy="12" r="12" fill="#a6ce39"/><circle cx="7.1" cy="6.9" r="1" fill="white"/><path d="M6.3 9h1.6v8H6.3V9Zm4 0h3.4c5.2 0 5.2 8 0 8h-3.4V9Zm1.6 1.5v5h1.7c3.2 0 3.2-5 0-5h-1.7Z" fill="white"/>',
  };
  return `<svg class="profile-icon ${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
};
const paper = p => `<article class="paper${p.image ? ' illustrated' : ''}">
  ${p.image ? `<a class="paper-image" href="${esc(p.url)}"><span class="image-badge">${esc(p.badge)}</span><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="975" height="300" loading="lazy"></a>` : ''}
  <div class="paper-content"><p class="paper-meta"><span class="venue-badge">${esc(p.badge)}</span>${p.status && p.status !== p.badge ? `<span class="status">${esc(p.status)}</span>` : ''}</p>
  <h4>${link(p.url, esc(p.title))}</h4>
  <p class="authors">${esc(p.authors).replaceAll('Haoye Qiu', '<strong>Haoye Qiu</strong>')}.</p>
  ${p.authorNote ? `<p class="author-note">${esc(p.authorNote)}</p>` : ''}
  <p class="venue">${esc(p.venue)}.</p>
  ${p.rankings?.length || p.recognition?.length ? `<p class="paper-ratings">${p.rankingContext ? `<span class="ranking-context">${esc(p.rankingContext)}</span>` : ''}${(p.rankings || []).map(r => `<a class="ranking-badge" href="${esc(r.source)}">${esc(r.label)}</a>`).join('')}${(p.recognition || []).map(r => r === 'Poster' && p.poster ? `<a class="ranking-badge" href="${esc(p.poster)}">${esc(r)}</a>` : `<span class="${r === 'Poster' ? 'ranking-badge' : 'recognition-badge'}">${esc(r)}</span>`).join('')}</p>` : ''}
  <div class="paper-links">${link(p.url, 'Paper')}${p.pdf ? link(p.pdf, 'PDF') : ''}${p.code ? link(p.code, 'Code') : ''}</div></div>
</article>`;
const published = data.publications.filter(p => p.status !== 'Under review');
const underReview = data.publications.filter(p => p.status === 'Under review');
const categories = [...new Set(published.map(p => p.category))];
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Haoye Qiu - Homepage</title><meta name="description" content="Haoye Qiu, second-year master's student at PALM Lab, Southeast University. Research on ensemble clustering, multi-view learning, and uncertainty-aware clustering.">
<meta name="theme-color" content="#ffffff"><link rel="stylesheet" href="style.css">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23224b8d'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='Arial,sans-serif' font-size='22' fill='white'%3EQ%3C/text%3E%3C/svg%3E">
</head><body><a class="skip" href="#about-me">Skip to content</a>
<header class="masthead"><nav class="topnav" aria-label="Main navigation"><a class="home" href="#about-me">Homepage</a><a href="#about-me">About Me</a><a href="#news">News</a><a href="#publications">Selected Publications</a>${underReview.length ? '<a href="#preprints">Preprints</a>' : ''}<a href="#honors-and-awards">Honors and Awards</a><a href="#education">Education</a></nav></header>
<div class="layout">
<aside class="profile" aria-label="Haoye Qiu's profile"><div class="profile-inner">
  <div class="avatar"><img src="${esc(data.photo)}" alt="Portrait of ${esc(data.name)}" width="411" height="526"></div><h1>${esc(data.name)}${data.chineseName ? ` (${esc(data.chineseName)})` : ''}</h1>
  <p class="role">Master's Student<br>Second Year · 硕士二年级</p>
  <ul class="profile-links"><li>${icon('university')}${link('https://www.seu.edu.cn/', 'Southeast University')}</li><li>${icon('location')}Nanjing, China</li><li>${icon('email')}${link('mailto:'+data.email, emailLabel)}</li><li>${icon('scholar')}${link(data.scholar, esc(data.scholarLabel))}</li><li>${icon('orcid')}${link(data.orcid, 'ORCID')}</li><li>${icon('github')}${link(data.github, 'GitHub')}</li><li>${icon('dblp')}${link('https://dblp.org/pid/370/6105.html', 'DBLP')}</li></ul>
  <div class="profile-affiliation"><a href="http://palm.seu.edu.cn/">PALM Lab</a><p>School of Computer Science<br>and Engineering</p></div>
</div></aside>
<main>
  <section id="about-me"><h2><span aria-hidden="true">👨‍🎓</span> About Me</h2>
  <p>I am a second-year master's student at the <a href="http://palm.seu.edu.cn/">PAttern Learning and Mining</a> (PALM) Lab, <a href="https://cse.seu.edu.cn/">School of Computer Science and Engineering</a>, <a href="https://www.seu.edu.cn/">Southeast University</a> (东南大学计算机科学与工程学院), China. My supervisor is <a href="https://jyh-learning.github.io/">Prof. Yuheng Jia</a> (贾育衡), and my second supervisor is <a href="https://cs.seu.edu.cn/dingding/">Prof. Ding Ding</a> (丁玎). I received my bachelor's degree from the <a href="https://cs.hainanu.edu.cn/">School of Computer Science and Technology</a>, <a href="https://www.hainanu.edu.cn/">Hainan University</a> (海南大学计算机科学与技术学院).</p>
  <p>My research focuses on <strong>theoretical computer science</strong>, <strong>learning theory</strong>, and <strong>machine learning</strong>. In particular, I am interested in clustering and focusing on:</p>
  <ul class="research-interests">
    <li><strong>Explainable clustering</strong> (k-medians, k-means, spectral clustering) <span class="current-focus">— Current research focus</span></li>
    <li>Ensemble clustering</li>
    <li>Multi-view clustering</li>
    <li>Dempster–Shafer evidence theory</li>
    <li>Neutrosophic set theory</li>
  </ul>
  </section>
  <section id="news"><h2><span aria-hidden="true">🔥</span> News</h2><ul class="news news-bullets"><li><time datetime="2026-09">2026.09:</time> I achieved a normalized average score of <strong>84.48</strong> and ranked <strong>1/33</strong> in my major at Southeast University.</li><li><time datetime="2025-10">2025.10:</time> I received the <strong>First-Class Scholarship</strong> at Southeast University (<strong>Top 10%</strong>).</li></ul></section>
  <section id="publications"><h2><span aria-hidden="true">📘</span> Selected Publications</h2>
  ${categories.map(c => `<h3>${esc(c).replaceAll('&amp;', '<span class="ampersand">&amp;</span>')}</h3>${published.filter(p => p.category === c).map(paper).join('\n')}`).join('\n')}
  <p class="bibliography">${link(data.scholar, 'More publications on Google Scholar')}</p></section>
  ${underReview.length ? `<section id="preprints"><h2><span aria-hidden="true">📝</span> Preprints</h2>${underReview.map(paper).join('\n')}</section>` : ''}
  <section id="honors-and-awards"><h2><span aria-hidden="true">🏆</span> Honors and Awards</h2><ul class="news honors">${data.honors.map(h => `<li><time datetime="${esc(h.date)}">${esc(h.date.replace('-', '.'))}</time><div><span>${esc(h.title)}</span><div class="honor-links">${h.links.map(l => link(l.url, esc(l.label))).join('')}</div></div></li>`).join('\n')}</ul></section>
  <section id="education"><h2><span aria-hidden="true">🎓</span> Education</h2><ul class="education"><li><strong>${link('https://www.seu.edu.cn/', 'Southeast University')}</strong><span>2025.09 - 2028.06 (expected)</span><span>Master's degree</span><span>${link('https://cse.seu.edu.cn/', 'School of Computer Science and Engineering')} · ${link('http://palm.seu.edu.cn/', 'PALM Lab')}</span></li><li><strong>${link('https://www.hainanu.edu.cn/', 'Hainan University')}</strong><span>2021.09 - 2025.06</span><span>Bachelor's degree</span><span>${link('https://cs.hainanu.edu.cn/', 'School of Computer Science and Technology')}</span></li></ul></section>
</main></div><footer><div>© 2026 Haoye Qiu <span>PALM Lab · Southeast University</span><p class="site-updated">Site last updated: <time datetime="${esc(data.lastUpdated)}">${esc(data.lastUpdated)}</time></p></div></footer>
</body></html>`;
const htmlWithExternalLinks = html.replace(/<a\b([^>]*\bhref="https?:\/\/[^\"]*"[^>]*)>/g, '<a$1 target="_blank" rel="noopener noreferrer">');
fs.writeFileSync(path.join(root,'index.html'), htmlWithExternalLinks);
console.log(`Generated index.html with ${data.publications.length} selected publications.`);
