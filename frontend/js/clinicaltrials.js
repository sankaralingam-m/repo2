document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("results");
  const meta = document.getElementById("meta");
  const backBtn = document.getElementById("backBtn");
  const query = localStorage.getItem("lastQuery") || "aspirin";

  meta.textContent = `Fetching clinical trials for "${query}"...`;

  try {
    const response = await fetch(`http://localhost:5000/api/research/trials/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);

    const data = await response.json();
    const trials = Array.isArray(data) ? data : data.studies || data.trials || [];

    if (!Array.isArray(trials) || trials.length === 0) {
      meta.textContent = `No clinical trials found for "${query}".`;
      return;
    }

    meta.textContent = `Found ${trials.length} clinical trials.`;
    container.innerHTML = "";

    trials.forEach((item) => {
      const p = item.protocolSection || {};

      // Modules
      const id = p.identificationModule || {};
      const status = p.statusModule || {};
      const sponsor = p.sponsorCollaboratorsModule || {};
      const design = p.designModule || {};
      const conditions = p.conditionsModule || {};
      const interventions = p.armsInterventionsModule || {};
      const eligibility = p.eligibilityModule || {};
      const locations = p.locationsModule || {};

      // Extract key info
      const nctId = id.nctId || "N/A";
      const title = id.briefTitle || "Untitled Study";
      const fullTitle = id.officialTitle || "No official title available.";
      const orgName = id.organization?.fullName || "N/A";
      const orgType = id.organization?.class || "N/A";

      const leadSponsor = sponsor.leadSponsor?.name || "N/A";
      const studyStatus = status.overallStatus || "N/A";
      const startDate = status.startDateStruct?.date || "N/A";
      const completionDate = status.completionDateStruct?.date || "N/A";
      const phase = design.phaseList?.phases?.join(", ") || "N/A";
      const studyType = design.studyType || "N/A";

      const conditionList = conditions.conditions?.join(", ") || "N/A";
      const interventionList =
        interventions.interventions?.map((i) => `${i.type}: ${i.name}`).join(", ") || "N/A";

      const eligibilityCriteria = eligibility.eligibilityCriteria || "N/A";
      const age = eligibility.minimumAge || "N/A";
      const gender = eligibility.gender || "N/A";

      const locationList =
        locations.locations?.map((loc) => `${loc.city || ""}, ${loc.country || ""}`).join("; ") || "N/A";

      const link = `https://clinicaltrials.gov/study/${nctId}`;

      // Create card
      const card = document.createElement("div");
      card.className = "trial-card";

      card.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Official Title:</strong> ${fullTitle}</p>
        <p><strong>NCT ID:</strong> <a href="${link}" target="_blank">${nctId}</a></p>
        <p><strong>Organization:</strong> ${orgName} (${orgType})</p>
        <p><strong>Lead Sponsor:</strong> ${leadSponsor}</p>
        <p><strong>Status:</strong> ${studyStatus}</p>
        <p><strong>Study Type:</strong> ${studyType}</p>
        <p><strong>Phase:</strong> ${phase}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>Completion Date:</strong> ${completionDate}</p>
        <p><strong>Conditions:</strong> ${conditionList}</p>
        <p><strong>Interventions:</strong> ${interventionList}</p>
        <p><strong>Eligibility Criteria:</strong> ${eligibilityCriteria}</p>
        <p><strong>Age Range:</strong> ${age}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Locations:</strong> ${locationList}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching trials:", err);
    meta.textContent = `Error fetching trials: ${err.message}`;
  }

  backBtn?.addEventListener("click", () => (window.location.href = "../index.html"));
});
