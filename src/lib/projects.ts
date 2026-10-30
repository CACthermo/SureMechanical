import { assetPath } from './asset-path';

// Leadership must confirm titles, scopes and photo matching before publication.
// Supply a unique approved image path per record; never recycle another project's photo.
export const PROJECTS = [
  {
    title: 'University Medical Center HVAC Renovation',
    industry: 'Healthcare',
    company: 'SURE Mechanical',
    scope: 'Complete air handling system replacement with coordinated ductwork and hydronic piping in an active hospital environment.',
    tags: ['Healthcare', 'Ductwork', 'Piping', 'BIM', 'Commissioning'],
    image: assetPath('/projects/photos/RTU_pic1.png'),
    featured: true,
  },
  {
    title: 'Federal Government Office Complex',
    industry: 'Government',
    company: 'SURE Mechanical',
    scope: 'Multi-building chilled water system upgrade with new cooling towers and central plant controls integration.',
    tags: ['Government', 'Chillers', 'Controls', 'Cooling Towers'],
    image: assetPath('/projects/photos/Ceiling_Work_1.png'),
    featured: false,
  },
  {
    title: 'Advanced Research Laboratory',
    industry: 'Research & Laboratory',
    company: 'Thermolinear',
    scope: 'Precision environmental rooms with tight temperature and humidity control for critical research applications.',
    tags: ['Research', 'Environmental Rooms', 'Precision Control'],
    image: assetPath('/projects/photos/Rooftop_Work_1.png'),
    featured: false,
  },
  {
    title: 'Regional School District Facility Upgrade',
    industry: 'Education',
    company: 'Cincinnati Air Conditioning Company',
    scope: 'HVAC system modernization across twelve school buildings with priority on occupied-space comfort and energy efficiency.',
    tags: ['Education', 'Service', 'Retrofit', 'Energy'],
    image: assetPath('/projects/photos/Worker_pic1.png'),
    featured: false,
  },
  {
    title: 'Industrial Manufacturing Plant',
    industry: 'Industrial',
    company: 'SURE Mechanical',
    scope: 'High-capacity ventilation and process cooling for a 200,000 SF manufacturing facility with clean-room zones.',
    tags: ['Industrial', 'Process Cooling', 'Ventilation'],
    image: null,
    featured: false,
  },
  {
    title: 'Commercial Office Tower Build-Out',
    industry: 'Commercial',
    company: 'SURE Mechanical',
    scope: 'Full mechanical system for a 15-story Class A office tower including VAV systems, energy recovery and building automation.',
    tags: ['Commercial', 'VAV', 'Energy Recovery', 'BAS'],
    image: null,
    featured: false,
  },
];

