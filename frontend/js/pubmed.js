const resultsEl = document.getElementById('results');
const metaEl = document.getElementById('meta');
const backBtn = document.getElementById('backBtn');
const query = localStorage.getItem('lastQuery');

async function fetchPubMedArticles() {
  if (!query) {
    metaEl.textContent = 'No query found. Please go back and search.';
    return;
  }

  metaEl.textContent = `Fetching PubMed articles for "${query}"...`;

  try {
    const res = await fetch(`/api/research/pubmed?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const data = await res.json();
    const articles = data.articles || [];

    if (!Array.isArray(articles) || articles.length === 0) {
      metaEl.textContent = 'No PubMed articles found.';
      return;
    }

    metaEl.textContent = `Found ${articles.length} PubMed articles for "${data.drug || query}".`;

    resultsEl.innerHTML = articles
      .map(a => `
        <div class="card paper-card">
          <h3>${a.title || 'Untitled Article'}</h3>
          <p><strong>Authors:</strong> ${a.authors || 'Unknown'}</p>
          <p><strong>Source / Journal:</strong> ${a.source || 'N/A'}</p>
          <p><strong>Publication Date:</strong> ${a.pubdate || 'N/A'}</p>
          <p><a href="${a.link}" target="_blank">🔗 View on PubMed</a></p>
        </div>
      `).join('');
  } catch (err) {
    metaEl.textContent = `Error fetching PubMed data: ${err.message}`;
  }
}

backBtn.addEventListener('click', () => (window.location.href = '../index.html'));
fetchPubMedArticles();
