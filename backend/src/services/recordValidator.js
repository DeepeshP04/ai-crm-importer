const allowedStatus = [
    "GOOD_LEAD_FOLLOW_UP",
    "DID_NOT_CONNECT",
    "BAD_LEAD",
    "SALE_DONE"
];

const allowedSources = [
    "leads_on_demand",
    "meridian_tower",
    "eden_park",
    "varah_swamy",
    "sarjapur_plots"
];

const validateRecord = (record) => ({
    created_at: record.created_at || "",
    name: record.name || "",
    email: record.email || "",
    country_code: record.country_code || "",
    mobile_without_country_code: record.mobile_without_country_code || "",
    company: record.company || "",
    city: record.city || "",
    state: record.state || "",
    country: record.country || "",
    lead_owner: record.lead_owner || "",
    crm_status: allowedStatus.includes(record.crm_status)
        ? record.crm_status
        : "",
    crm_note: record.crm_note || "",
    data_source: allowedSources.includes(record.data_source)
        ? record.data_source
        : "",
    possession_time: record.possession_time || "",
    description: record.description || ""
});

const validateRecords = (records) => {
    return records
        .filter(record =>
            record.email?.trim() ||
            record.mobile_without_country_code?.trim()
        )
        .map(validateRecord);
};

module.exports = validateRecords;