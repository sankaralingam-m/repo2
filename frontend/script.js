const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const choices = document.querySelectorAll(".choice");

function getQuery() {
  return new URLSearchParams(location.search).get("q") || localStorage.getItem("lastQuery") || "";
}
function saveQuery(q) {
  if (q && q.trim()) localStorage.setItem("lastQuery", q.trim());
  else localStorage.removeItem("lastQuery");
}

// Load last query if available
if (input) {
  input.value = getQuery();
}

// Clear input on × click
clearBtn?.addEventListener("click", () => {
  input.value = "";
  saveQuery("");
  input.focus();
});

// Navigate to target pages *with drug param*
choices.forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = input.value.trim();
    if (!q) {
      alert("Please enter a search term first!");
      return;
    }

    saveQuery(q);

    // ✅ IMPORTANT FIX: Append ?drug= query
    window.location.href = `${btn.dataset.target}?drug=${encodeURIComponent(q)}`;
  });
});
