const buildPrompt = (records) => {
  return `
You are an expert CRM data extraction AI.

Your task is to convert arbitrary CSV records into the GrowEasy CRM format.

The CSV may come from:
- Facebook Lead Ads
- Google Ads
- Excel spreadsheets
- Real estate CRMs
- Sales reports
- Marketing agencies
- Manually created CSVs

Do NOT assume column names are fixed.

Instead, intelligently identify fields based on their meaning.

==========================
Target CRM Schema
==========================

Return every record in this exact format:

{
  "created_at": "",
  "name": "",
  "email": "",
  "country_code": "",
  "mobile_without_country_code": "",
  "company": "",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "",
  "crm_status": "",
  "crm_note": "",
  "data_source": "",
  "possession_time": "",
  "description": ""
}

==========================
Rules
==========================

1. Skip any record that has neither an email nor a mobile number.

2. Allowed crm_status values:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

If no status can be inferred, leave it blank.

3. Allowed data_source values:

leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots

Otherwise leave it blank.

4. If multiple emails exist:
- Use the first email.
- Append remaining emails into crm_note.

5. If multiple phone numbers exist:
- Use the first phone number.
- Append remaining numbers into crm_note.

6. Any remarks, notes, comments, follow-up text, extra information, extra phone numbers, or extra emails should be added into crm_note.

7. created_at must be a JavaScript-compatible date string.

8. Do not invent information.

9. Return ONLY valid JSON.

10. The response must be an array of CRM objects.

==========================
CSV Records
==========================

${JSON.stringify(records, null, 2)}
`;
};

module.exports = buildPrompt;