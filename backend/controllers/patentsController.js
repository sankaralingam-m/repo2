//patentsController.js
import fetch from "node-fetch"; // required for Node <18

export const getPatents = async (req, res) => {
  try {
    // Get query parameters
    const query = req.query.q || "aspirin";          // drug/compound
    const year = req.query.year;                     // optional publication year
    const source = req.query.source;                 // optional source: EP, WO
    const pageSize = req.query.pageSize || 25;      // optional: number of results

    // Build Europe PMC query string
    let epmcQuery = `${encodeURIComponent(query)} AND (PATENT)`;

    if (year) epmcQuery += ` AND PUB_YEAR:${year}`;
    if (source) epmcQuery += ` AND SRC:${source}`;

    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${epmcQuery}&format=json&pageSize=${pageSize}`;

    console.log("Fetching Europe PMC patents:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Europe PMC response error:", response.status, response.statusText);
      throw new Error(`Europe PMC returned ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      data: data.resultList?.result || [],
    });
  } catch (error) {
    console.error("Patent fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
