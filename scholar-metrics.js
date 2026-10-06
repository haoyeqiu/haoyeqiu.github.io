async function refreshScholarMetrics() {
  try {
    const response = await fetch(`scholar-metrics.json?t=${Date.now()}`, {cache: 'no-store'});
    if (!response.ok) return;
    const metrics = await response.json();
    if (metrics.scholarId !== 'Fl3ulDUAAAAJ' ||
        !Number.isInteger(metrics.citations) || metrics.citations < 0 ||
        !Number.isInteger(metrics.hIndex) || metrics.hIndex < 0 ||
        metrics.hIndex > metrics.citations || !Number.isFinite(Date.parse(metrics.updatedAt))) return;
    document.querySelector('[data-scholar-citations]').textContent = metrics.citations.toLocaleString('en-US');
    document.querySelector('[data-scholar-h-index]').textContent = metrics.hIndex;
    document.querySelector('.scholar-stats').title = `Google Scholar · Last checked: ${new Date(metrics.updatedAt).toLocaleString()}`;
  } catch {
    // Keep the server-rendered, last verified values while offline.
  }
}
refreshScholarMetrics();
setInterval(refreshScholarMetrics, 5 * 60 * 1000);
