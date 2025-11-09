// patents.js

document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('results');
  const metaText = document.getElementById('meta');
  const backBtn = document.getElementById('backBtn');

  const urlParams = new URLSearchParams(window.location.search);
  const drug = urlParams.get('drug') || 'paracetamol';

  metaText.textContent = `🔍 Searching patents for "${drug}"...`;

  async function fetchPatents() {
    try {
      const response = await fetch(`http://localhost:5000/api/research/patents?q=${drug}`);
      if (!response.ok) throw new Error("Failed to fetch data from backend.");
      const data = await response.json();

      // Auto-detect the correct result array
      let patents = [];
      if (Array.isArray(data)) patents = data;
      else if (Array.isArray(data.results)) patents = data.results;
      else if (data.resultList && Array.isArray(data.resultList.result)) patents = data.resultList.result;
      else if (data.data && Array.isArray(data.data)) patents = data.data;

      if (!patents || patents.length === 0) {
        metaText.textContent = `❌ No patents found for "${drug}".`;
        resultsContainer.innerHTML = '';
        return;
      }

      metaText.textContent = `✅ Found ${patents.length} patents for "${drug}".`;
      displayPatents(patents);
    } catch (error) {
      metaText.textContent = `⚠️ Error fetching patents: ${error.message}`;
      resultsContainer.innerHTML = '';
    }
  }

  function displayPatents(patents) {
    resultsContainer.innerHTML = '';

    patents.forEach(p => {
      const card = document.createElement('div');
      card.className = 'patent-card';

      card.innerHTML = `
        <h2>${p.title || 'No Title Available'}</h2>
        <p><strong>Authors:</strong> ${p.authorString || 'Unknown'}</p>
        <p><strong>Journal:</strong> ${p.journalTitle || 'N/A'}</p>
        <p><strong>Publication Date:</strong> ${p.pubYear || 'N/A'}</p>
        <p><strong>DOI:</strong> ${p.doi || 'N/A'}</p>
        <p><strong>Source:</strong> ${p.source || 'N/A'}</p>
        <p><strong>PMID:</strong> ${p.id || 'N/A'}</p>
        <p><strong>Abstract:</strong> ${p.abstractText || 'No abstract available.'}</p>
        <a href="https://europepmc.org/article/${p.source || 'MED'}/${p.id || ''}" target="_blank" class="link">🔗 View Full Patent</a>
      `;

      resultsContainer.appendChild(card);
    });
  }

  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  fetchPatents();
});
