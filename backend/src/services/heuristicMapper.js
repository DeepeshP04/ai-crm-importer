const allowedStatus = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
];

const allowedSources = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
];

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).toString().trim().replace(/\s+/g, " ");
};

const normalizeHeader = (value) =>
  normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ");

const buildRecord = (row) => {
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), normalizeText(value)])
  );

  const rawValues = Object.values(normalizedRow).filter(Boolean);
  const emailMatches = rawValues.flatMap((value) =>
    value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []
  );
  const phoneMatches = rawValues.flatMap((value) =>
    value.match(/\+?\d[\d\s()-]{6,}/g) || []
  );

  const primaryEmail = emailMatches[0] || "";
  const extraEmails = emailMatches.slice(1);
  const primaryPhone = phoneMatches[0] || "";
  const extraPhones = phoneMatches.slice(1);

  const countryCodeMatch = primaryPhone.match(/\+(\d{1,3})/);
  const countryCode = countryCodeMatch ? `+${countryCodeMatch[1]}` : "";
  const mobileDigits = primaryPhone.replace(/\D/g, "");
  const mobileWithoutCountryCode = countryCode
    ? mobileDigits.replace(new RegExp(`^${countryCode.replace(/\D/g, "")}`), "")
    : mobileDigits;

  const noteParts = [];
  if (extraEmails.length) {
    noteParts.push(`Additional emails: ${extraEmails.join(", ")}`);
  }
  if (extraPhones.length) {
    noteParts.push(`Additional phones: ${extraPhones.join(", ")}`);
  }

  const findValue = (aliases) => {
    const match = Object.entries(normalizedRow).find(([key]) => {
      const normalizedKey = normalizeHeader(key);
      return aliases.some((alias) => normalizedKey.includes(alias));
    });

    return match ? match[1] : "";
  };

  const inferStatus = (value) => {
    const normalized = normalizeText(value).toLowerCase();

    if (["follow up", "interested", "warm lead", "good lead"].some((item) => normalized.includes(item))) {
      return "GOOD_LEAD_FOLLOW_UP";
    }

    if (["busy", "no answer", "call later", "do not connect", "not connected"].some((item) => normalized.includes(item))) {
      return "DID_NOT_CONNECT";
    }

    if (["rejected", "not interested", "lost", "bad lead"].some((item) => normalized.includes(item))) {
      return "BAD_LEAD";
    }

    if (["closed", "won", "deal closed", "sale done", "completed"].some((item) => normalized.includes(item))) {
      return "SALE_DONE";
    }

    return "";
  };

  const inferSource = (value) => {
    const normalized = normalizeText(value).toLowerCase();

    if (normalized.includes("leads on demand") || normalized.includes("leads_on_demand")) {
      return "leads_on_demand";
    }
    if (normalized.includes("meridian tower")) {
      return "meridian_tower";
    }
    if (normalized.includes("eden park")) {
      return "eden_park";
    }
    if (normalized.includes("varah swamy")) {
      return "varah_swamy";
    }
    if (normalized.includes("sarjapur plots")) {
      return "sarjapur_plots";
    }

    return "";
  };

  const createdAt = findValue(["created", "date", "timestamp", "lead date", "created at"]);
  const name = findValue(["name", "full name", "customer name", "contact person", "lead name"]);
  const company = findValue(["company", "company name", "business", "organization", "firm"]);
  const city = findValue(["city", "town", "location city"]);
  const state = findValue(["state", "province", "region"]);
  const country = findValue(["country", "nation"]);
  const leadOwner = findValue(["owner", "lead owner", "assigned to", "executive", "sales owner", "agent", "relationship manager"]);
  const crmStatus = inferStatus(findValue(["status", "lead status", "current status", "inquiry status", "crm status"]));
  const crmNote = normalizeText(findValue(["remarks", "notes", "comments", "follow up", "feedback", "observation", "message"])) || "";
  const dataSource = inferSource(findValue(["source", "lead source", "campaign source", "marketing source", "project"]));
  const possessionTime = findValue(["possession", "possession time", "possession date"]);
  const description = findValue(["description", "additional info", "details", "extra information"]);

  const mergedNote = [crmNote, ...noteParts].filter(Boolean).join(" | ");

  return {
    created_at: createdAt || "",
    name: name || "",
    email: primaryEmail || "",
    country_code: countryCode || "",
    mobile_without_country_code: mobileWithoutCountryCode || "",
    company: company || "",
    city: city || "",
    state: state || "",
    country: country || "",
    lead_owner: leadOwner || "",
    crm_status: allowedStatus.includes(crmStatus) ? crmStatus : "",
    crm_note: mergedNote || "",
    data_source: allowedSources.includes(dataSource) ? dataSource : "",
    possession_time: possessionTime || "",
    description: description || "",
  };
};

const mapRecordsWithHeuristics = (records = []) => {
  return records
    .map((record) => buildRecord(record))
    .filter((record) => record.email || record.mobile_without_country_code);
};

module.exports = mapRecordsWithHeuristics;
