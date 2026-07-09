const test = require('node:test');
const assert = require('node:assert/strict');
const mapRecordsWithHeuristics = require('../src/services/heuristicMapper');

test('maps common lead fields from arbitrary CSV headers using heuristics', () => {
  const rows = [
    {
      'Lead Name': 'John Doe',
      'Email Address': 'john@example.com',
      'Phone Number': '9876543210',
      'Business': 'GrowEasy',
      'City': 'Mumbai',
      'State': 'Maharashtra',
      'Country': 'India',
      'Lead Status': 'Follow Up',
      'Source': 'Meridian Tower',
      'Notes': 'Interested in demo',
    },
  ];

  const result = mapRecordsWithHeuristics(rows);

  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'John Doe');
  assert.equal(result[0].email, 'john@example.com');
  assert.equal(result[0].mobile_without_country_code, '9876543210');
  assert.equal(result[0].company, 'GrowEasy');
  assert.equal(result[0].crm_status, 'GOOD_LEAD_FOLLOW_UP');
  assert.equal(result[0].data_source, 'meridian_tower');
  assert.match(result[0].crm_note, /Interested/i);
});

test('skips records with neither email nor mobile', () => {
  const rows = [{ 'Full Name': 'No Contact', 'Company': 'Test Ltd' }];

  const result = mapRecordsWithHeuristics(rows);

  assert.equal(result.length, 0);
});
