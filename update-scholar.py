"""Fetch public Google Scholar all-time metrics; retain the snapshot on failure."""
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def parse_metrics(html):
    # Parse only the statistics table, never publication-level citation counts.
    table = re.search(r'<table\b[^>]*\bid=["\']gsc_rsb_st["\'][^>]*>(.*?)</table>', html, re.S)
    if not table:
        raise ValueError("Scholar statistics table missing (possibly a challenge page)")
    values = re.findall(r'<td\b[^>]*class=["\']gsc_rsb_std["\'][^>]*>\s*([0-9,]+)\s*</td>', table[1])
    if len(values) != 6:
        raise ValueError("Unexpected Scholar statistics table")
    citations, h_index = int(values[0].replace(',', '')), int(values[2].replace(',', ''))
    if h_index > citations:
        raise ValueError("Invalid Scholar metrics")
    return citations, h_index


def main():
    snapshot = ROOT / 'scholar-metrics.json'
    old = json.loads(snapshot.read_text(encoding='utf-8'))
    request = urllib.request.Request(
        'https://scholar.google.com/citations?user=' + old['scholarId'] + '&hl=en',
        headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            citations, h_index = parse_metrics(response.read().decode('utf-8'))
        latest = {**old, 'citations': citations, 'hIndex': h_index,
                  'updatedAt': datetime.now(timezone.utc).isoformat(timespec='seconds')}
        temporary = snapshot.with_suffix('.tmp')
        temporary.write_text(json.dumps(latest, indent=2) + '\n', encoding='utf-8')
        temporary.replace(snapshot)
        print(f'Scholar: {citations} citations, h-index {h_index}')
    except Exception as error:
        print(f'::warning::Scholar refresh failed; retaining last verified values: {error}')


if __name__ == '__main__':
    main()
