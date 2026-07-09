const buildPrompt = (records) => `
You are an expert CRM data extraction and intelligent field mapping system.

Your task is to convert the following CSV records into the standardized GrowEasy CRM format.

IMPORTANT:
The uploaded CSV can come from ANY source:
- Facebook Lead Export
- Google Ads Export
- Excel Sheets
- Real Estate CRM
- Sales Reports
- Marketing Agency CSVs
- Manually Created Spreadsheets
- Any other valid CSV

The CSV headers are NOT fixed.

Do NOT assume column names such as "email", "phone", "name", or "company" exist.

Instead, intelligently identify the meaning of each column and map it to the correct CRM field.

Examples of possible mappings:

Lead Created
Created On
Date
Created Time
Timestamp
Lead Date
→ created_at

Full Name
Customer Name
Lead Name
Client Name
Contact Person
Customer
→ name

Email
Email Address
Primary Email
Work Email
Contact Email
E-mail
→ email

Phone
Mobile
Mobile Number
Phone Number
Contact Number
Contact No
Cell
Telephone
→ mobile_without_country_code

Country Code
Dial Code
ISD Code
→ country_code

Company
Company Name
Business
Organization
Firm
→ company

City
Town
Location City
→ city

State
Province
Region
→ state

Country
Nation
→ country

Owner
Lead Owner
Assigned To
Executive
Sales Owner
Agent
Relationship Manager
→ lead_owner

Status
Lead Status
Current Status
Inquiry Status
→ crm_status

Remarks
Notes
Comments
Follow Up
Feedback
Observation
Message
→ crm_note

Lead Source
Campaign
Campaign Source
Marketing Source
Project
Source
→ data_source

Possession
Possession Time
Possession Date
→ possession_time

Description
Additional Info
Details
Extra Information
→ description

Return ONLY a valid JSON array.

Never return markdown.

Never return explanations.

Each output object MUST contain exactly these fields:

created_at
name
email
country_code
mobile_without_country_code
company
city
state
country
lead_owner
crm_status
crm_note
data_source
possession_time
description

Rules:

1. Skip any record that contains neither an email nor a mobile number.

2. If multiple email addresses exist:
   - Use the first email.
   - Append the remaining emails to crm_note.

3. If multiple mobile numbers exist:
   - Extract country code separately.
   - Store only the first mobile number in mobile_without_country_code.
   - Append remaining mobile numbers to crm_note.

4. crm_status MUST be ONLY one of:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

Status Mapping Examples:

Follow Up → GOOD_LEAD_FOLLOW_UP
Interested → GOOD_LEAD_FOLLOW_UP
Warm Lead → GOOD_LEAD_FOLLOW_UP

Busy → DID_NOT_CONNECT
No Answer → DID_NOT_CONNECT
Call Later → DID_NOT_CONNECT

Rejected → BAD_LEAD
Not Interested → BAD_LEAD
Lost → BAD_LEAD

Closed
Won
Deal Closed
Sale Done
Completed
→ SALE_DONE

If no mapping is clear, leave crm_status empty.

5. data_source MUST ONLY be one of:

leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots

Examples:

Leads On Demand → leads_on_demand
Meridian Tower → meridian_tower
Eden Park → eden_park
Varah Swamy → varah_swamy
Sarjapur Plots → sarjapur_plots

Any other source such as:

Facebook Ads
Google Ads
Website
Referral
Instagram
Newspaper
WhatsApp
Campaign

should return an empty string.

6. created_at must be convertible using:

new Date(created_at)

If necessary, normalize the date format.

7. Use crm_note for:

- remarks
- comments
- follow-up notes
- additional notes
- extra phone numbers
- extra email addresses
- any useful information that does not fit another field

8. Missing values should be empty strings.

9. Keep one output object for each valid input record.

10. Never merge multiple records.

11. Never invent information that is not present in the input.

12. Return ONLY the JSON array.

Input Records:

${JSON.stringify(records, null, 2)}
`;

module.exports = buildPrompt;