//trailsController.js
import axios from "axios";

export const getTrialsData = async (req, res) => {
  try {
    const { drug } = req.params;
    const apiUrl = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(drug)}&pageSize=10`;

    const response = await axios.get(apiUrl);
    res.json(response.data.studies || []);
  } catch (error) {
    console.error("Error fetching trials data:", error);
    res.status(500).json({ error: "Failed to fetch clinical trials data" });
  }
};
