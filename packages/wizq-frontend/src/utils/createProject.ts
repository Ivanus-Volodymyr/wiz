import { LengthUnit, Step } from '../types/project';

export const LENGTH_UNITS: LengthUnit[] = [
  {
    name: 'Inches',
    value: 0.0833333,
  },
  {
    name: 'Meters',
    value: 3.28084,
  },
  {
    name: 'Feet',
    value: 1,
  },
];

export const START_DATE_OPTIONS: string[] = [
  'ASAP (As soon as possible)',
  'Within the next month',
  'In the next two months',
  'In the next three months',
  'In the next six months',
  'Next year',
  "I'm flexible, no specific timeline",
  'Not sure, need to discuss this further',
];

export const CREATE_PROJECT_STEPS: Step[] = [
  {
    id: 1,
    name: 'Project',
  },
  {
    id: 2,
    name: 'Floor plan',
  },
  {
    id: 3,
    name: 'Service provider',
  },
  {
    id: 4,
    name: 'Budget',
  },
  {
    id: 5,
    name: 'Review',
  },
];

export const SKILL_LEVEL_OPTIONS = ['Expert (10+ years)', 'Intermediate (3-5 years)', 'Beginner (0-3 years)'];

export const SKILLS_OPTIONS = [
  'Plumbing',
  'Sheetrock',
  'Door',
  'Caulking',
  'Demo',
  'Hardwood',
  'HVAC',
  'Sub',
  'Light',
  'Kitchen',
  'Exterior',
  'Tiling',
  'RAN',
  'Rental',
  'Construction',
  'Residential',
  'Room',
  'Commercial',
  'Drywall',
  'General',
  'Plastering',
  'Tile',
  'Home',
  'Shingles',
  'Cabinet',
  'Counter',
  'Window',
];
