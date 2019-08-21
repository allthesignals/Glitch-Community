const dayjs = require('dayjs');
const { mapValues } = require('lodash');

const tests = {
  'Just-A-Test': {
    niceone: { weight: 0.5, value: 'nice one!' },
    goodjob: { weight: 0.5, value: 'good job!' },
    toobad: { weight: 4, value: 'too bad' },
  },
};

const COOKIE_NAME = 'ab-tests';

const readAssignments = (request) => {
  try {
    return JSON.parse(request.cookies[COOKIE_NAME]) || {};
  } catch {
    return {};
  }
};

const writeAssignments = (response, assignments) => {
  const maxAge = dayjs.convert(1, 'month', 'ms');
  const whitelist = Object.keys(tests).sort();
  const serialized = JSON.stringify(assignments, whitelist);
  response.cookie(COOKIE_NAME, serialized, { maxAge });
};

const assignGroup = (groups) => {
  const entries = Object.entries(groups);
  const sum = Object.values(groups).reduce((sum, { weight }) => sum + weight, 0);

  // pick a number in [0, sum) and see which [0, weight) range it falls in
  let rand = Math.random() * sum;
  for (const [assignment, { weight }] of entries) {
    if (rand < weight) {
      return assignment;
    }
    rand -= weight;
  }

  // this must be a rounding error, so return the last group
  return entries[entries.length - 1][0];
};

const getAssignments = (request, response) => {
  const assignments = readAssignments(request);
  for (const [test, groups] of Object.entries(tests)) {
    if (!Object.keys(groups).includes(assignments[test])) {
      assignments[test] = assignGroup(groups);
    }
  }
  writeAssignments(response, assignments);
  return mapValues(assignments, (assignment, test) => tests[test][assignment].value);
};

// test assignment bias
const groups = tests['Just-A-Test'];
const results = mapValues(groups, () => 0);
for (let i = 0; i < 1000; ++i) {
  const assignment = assignGroup(groups);
  results[assignment] += 1;
}
const total = Object.values(results).reduce((sum, value) => sum + value, 0);


module.exports = getAssignments;
