// europepmc.js

document.addEventListener('DOMContentLoaded', () => {
  const resultsEl = document.getElementById('results');
  const metaEl = document.getElementById('meta');
  const backBtn = document.getElementById('backBtn');

  const query = localStorage.getItem('lastQuery') || 'aspirin';

  metaEl.textContent = `🔍 Fetching Europe PMC research papers for "${query}"...`;

  async function fetchEuropePMC() {
    try {
      const res = await fetch(`http://localhost:5000/api/research/europepmc/${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();

      // Handle various possible JSON structures
      let papers = [];
      if (Array.isArray(data)) papers = data;
      else if (Array.isArray(data.results)) papers = data.results;
      else if (data.resultList && Array.isArray(data.resultList.result)) papers = data.resultList.result;
      else if (data.data && Array.isArray(data.data)) papers = data.data;

      if (!papers || papers.length === 0) {
        metaEl.textContent = `❌ No research papers found for "${query}".`;
        resultsEl.innerHTML = '';
        return;
      }

      metaEl.textContent = `✅ Found ${papers.length} Europe PMC papers for "${query}".`;
      displayPapers(papers);
    } catch (err) {
      metaEl.textContent = `⚠️ Error fetching data: ${err.message}`;
    }
  }

  function displayPapers(papers) {
    resultsEl.innerHTML = '';

    papers.forEach(p => {
  const card = document.createElement('div');
  card.className = 'paper-card'; // already styled in CSS

  card.innerHTML = `
    <h3 class="paper-title">${p.title || 'Untitled Paper'}</h3>
    <p class="paper-info"><strong>Authors:</strong> ${p.authorString || p.author || 'Unknown'}</p>
    <p class="paper-info"><strong>Journal:</strong> ${p.journalTitle || 'N/A'} (${p.pubYear || '—'})</p>
    <p class="paper-info"><strong>DOI:</strong> ${p.doi || 'N/A'}</p>
    <p class="paper-info"><strong>Source:</strong> ${p.source || 'Europe PMC'}</p>
    <p class="paper-abstract"><strong>Abstract:</strong> ${p.abstractText ? p.abstractText.slice(0, 300) + '...' : 'No abstract available.'}</p>
    <a href="https://europepmc.org/article/${p.source || 'MED'}/${p.id || ''}" target="_blank" class="link">🔗 View Full Article</a>
  `;

  resultsEl.appendChild(card);
});

  }

  backBtn.addEventListener('click', () => (window.location.href = '../index.html'));
  fetchEuropePMC();
});
