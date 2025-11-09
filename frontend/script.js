const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const choices = document.querySelectorAll(".choice");
const resultsContainer = document.getElementById("results"); // may be null on index.html

function getQuery() {
  return new URLSearchParams(location.search).get("drug") || localStorage.getItem("lastQuery") || "";
}

function saveQuery(q) {
  if (q && q.trim()) localStorage.setItem("lastQuery", q.trim());
  else localStorage.removeItem("lastQuery");
}

// Load last query if available
if (input) {
  input.value = getQuery();
  // Fetch only if the page has a results container
  if (input.value && resultsContainer) fetchData(input.value);
}

// Clear input
clearBtn?.addEventListener("click", () => {
  if (input) input.value = "";
  saveQuery("");
  if (resultsContainer) resultsContainer.innerHTML = ""; // safe
  input?.focus();
});

// Navigate to target pages with query param
choices.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!input) return; // safety
    const q = input.value.trim();
    if (!q) {
      alert("Please enter a search term first!");
      return;
    }

    saveQuery(q);
    window.location.href = `${btn.dataset.target}?drug=${encodeURIComponent(q)}`;
  });
});

// Fetch function (runs only if resultsContainer exists)
function fetchData(drugName) {
  if (!resultsContainer) return; // safety

  resultsContainer.innerHTML = "Loading...";

  fetch(`/api/research/trials?query=${encodeURIComponent(drugName)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      resultsContainer.innerHTML = "";
      if (data && data.length > 0) {
        data.forEach((item) => {
          const div = document.createElement("div");
          div.classList.add("result-item");
          div.innerHTML = `<h3>${item.title}</h3><p>${item.description || ""}</p>`;
          resultsContainer.appendChild(div);
        });
      } else {
        resultsContainer.innerHTML = "No results found.";
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      resultsContainer.innerHTML = "Failed to fetch data. Please try again.";
    });
}

// Optional: fetch when pressing Enter in the input field
input?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const q = input.value.trim();
    if (q && resultsContainer) fetchData(q);
  }
});
