// TODO: replace this stub with a real profile read from the database
const STUB_PROFILE = {
  fullName: 'Test Student',
  sourceCountry: 'KZ',
  targetCountry: 'IT',
  field: 'engineering',
  degreeLevel: 'bachelor',
  gpa: 4.8,
  gpaScale: 5,
  language: 'en',
  languageLevel: 'B2',
  budgetMonthlyEur: 800,
};

export function getStubProfile() {
  return STUB_PROFILE;
}

export function buildSystemPrompt(profile) {
  return [
    'You are Global Path, an advisor helping students apply to universities abroad.',
    'Be concrete, accurate, and honest. If you are unsure about a deadline or',
    'requirement, say so rather than guessing — do not invent specifics.',
    '',
    'Student profile:',
    `- From: ${profile.sourceCountry}, applying to: ${profile.targetCountry}`,
    `- Goal: ${profile.degreeLevel} in ${profile.field}`,
    `- GPA: ${profile.gpa}/${profile.gpaScale}, ${profile.language} ${profile.languageLevel}`,
    `- Budget: ~${profile.budgetMonthlyEur} EUR/month`,
  ].join('\n');
}
