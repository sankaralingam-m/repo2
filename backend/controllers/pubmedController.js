//pubmedController.js
import fetch from "node-fetch";
import xml2js from "xml2js";

export const getPubMed = async (req, res) => {
  try {
    const { drug } = req.params;

    // Step 1: Search for IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      drug
    )}+new+use&retmax=10`;
    const searchRes = await fetch(searchUrl);
    const xmlText = await searchRes.text();

    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(xmlText);
    const ids = parsed?.eSearchResult?.IdList?.[0]?.Id || [];

    // Step 2: Fetch summaries
    const idString = ids.join(",");
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idString}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    // Combine title + author + link
    const articles = ids.map(id => ({
      id,
      title: summaryData.result?.[id]?.title || "No title",
      authors: summaryData.result?.[id]?.authors?.map(a => a.name).join(", ") || "N/A",
      source: summaryData.result?.[id]?.source || "N/A",
      pubdate: summaryData.result?.[id]?.pubdate || "N/A",
      link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
    }));

    res.json({ drug, articles });
  } catch (err) {
    console.error("Error fetching PubMed data:", err);
    res.status(500).json({ error: "Failed to fetch PubMed data" });
  }
};
