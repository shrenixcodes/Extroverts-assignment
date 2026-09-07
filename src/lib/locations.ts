export const STATE_CITY_MAP: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland'],
  'New York': ['New York City', 'Brooklyn', 'Buffalo', 'Albany', 'Rochester'],
  Texas: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
  Florida: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  Illinois: ['Chicago', 'Naperville', 'Evanston', 'Springfield', 'Peoria'],
  Georgia: ['Atlanta', 'Savannah', 'Athens', 'Augusta', 'Macon'],
  Washington: ['Seattle', 'Tacoma', 'Spokane', 'Bellevue', 'Olympia'],
  Colorado: ['Denver', 'Boulder', 'Colorado Springs', 'Fort Collins', 'Aspen'],
  Nevada: ['Las Vegas', 'Reno', 'Henderson', 'Carson City', 'Sparks'],
  Massachusetts: ['Boston', 'Cambridge', 'Worcester', 'Salem', 'Somerville'],
}

export const STATES = Object.keys(STATE_CITY_MAP)

export function getCitiesForState(state: string): string[] {
  return STATE_CITY_MAP[state] ?? []
}

export const PRONOUN_OPTIONS = ['She / Her', 'He / Him', 'They / Them', 'Prefer to self-describe']
