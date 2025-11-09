//europepmcController.js
import fetch from "node-fetch";

export const getEuropePMC = async (req, res) => {
  try {
    const { drug } = req.params;
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(drug)}&format=json&pageSize=10`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.resultList?.result || []);
  } catch (err) {
    console.error("Error fetching Europe PMC data:", err);
    res.status(500).json({ error: "Failed to fetch Europe PMC data" });
  }
};
