// Names and customers: Max's client-supplied 20-job list, October 30, 2026.
// Photo identities: Max's two ordered upload batches. Do not infer scopes,
// industry categories, completion dates, customers, or photo matches.
// Photo-only collections have no customer assignment until one is supplied.
import { assetPath } from './asset-path';

export type ProjectPhoto = { src: string; alt: string };
export type Project = {
  id: string;
  sourceJobNumber?: number;
  title: string;
  customer: string | null;
  customers?: string[];
  photos: ProjectPhoto[];
  scope: string | null;
};

function withAssetPaths(project: Project): Project {
  return { ...project, photos: project.photos.map(photo => ({ ...photo, src: assetPath(photo.src) })) };
}

export const PROJECTS: Project[] = [
  {
    "id": "job-01",
    "sourceJobNumber": 1,
    "title": "The Lane Libraries",
    "customer": "HGC Construction",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-02",
    "sourceJobNumber": 2,
    "title": "Christ Hospital EP Dept Reloca",
    "customer": "BEISCHEL BUILDING CONSTRUCTION",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-03",
    "sourceJobNumber": 3,
    "title": "Queensgate Ops Ctr AHU 1 & 2",
    "customer": "TURNER CONSTRUCTION COMPANY",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-04",
    "sourceJobNumber": 4,
    "title": "TCH Liberty - Imaging Addition",
    "customer": "DANIS",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-05",
    "sourceJobNumber": 5,
    "title": "POB South RTU Replc",
    "customer": "UC HEALTH",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-06",
    "sourceJobNumber": 6,
    "title": "Highland Heights VA Clinic",
    "customer": "SCS Construction Services, Inc",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-07",
    "sourceJobNumber": 7,
    "title": "SAKS Redevelopment",
    "customer": "TURNER CONSTRUCTION COMPANY",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-08",
    "sourceJobNumber": 8,
    "title": "Symmes Township Library",
    "customer": "TURNER CONSTRUCTION COMPANY",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-09",
    "sourceJobNumber": 9,
    "title": "Cinti State Harrison Campus Ad",
    "customer": "Equity Construction Solutions",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-11",
    "sourceJobNumber": 11,
    "title": "Xavier Jesuit Academy",
    "customer": "TRIVERSITY CONSTRUCTION",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-12",
    "sourceJobNumber": 12,
    "title": "Spinney Field HVAC & Roof Repl",
    "customer": "Alpha Construction",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-13",
    "sourceJobNumber": 13,
    "title": "Freestore Foodbank Cincinnati",
    "customer": "Paul Hemmer Company",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-14",
    "sourceJobNumber": 14,
    "title": "PNC - City Club Apartments",
    "customer": "TP MECHANICAL",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-15",
    "sourceJobNumber": 15,
    "title": "UC HEALTH HOXWORTH 3RD FL",
    "customer": "DANIS",
    "photos": [],
    "scope": null
  },
  {
    "id": "job-16",
    "sourceJobNumber": 16,
    "title": "Federal Reserve \u2014 Air Handling Unit Rebuild",
    "customer": "MEGEN CONSTRUCTION CO. INC",
    "photos": [
      {
        "src": "/projects/2026/federal-reserve-01.webp",
        "alt": "Federal Reserve air handling equipment."
      },
      {
        "src": "/projects/2026/federal-reserve-02.webp",
        "alt": "A second view of Federal Reserve air handling equipment."
      }
    ],
    "scope": null
  },
  {
    "id": "job-17",
    "sourceJobNumber": 17,
    "title": "UC Digital Futures",
    "customer": "HGC Construction / MESSER CONSTRUCTION COMPANY",
    "photos": [
      {
        "src": "/projects/2026/digital-futures-01.webp",
        "alt": "Exterior view of UC Digital Futures."
      },
      {
        "src": "/projects/2026/digital-futures-02.webp",
        "alt": "Interior ceiling and mechanical systems at UC Digital Futures."
      },
      {
        "src": "/projects/2026/digital-futures-03.webp",
        "alt": "View of UC Digital Futures buildings 1 and 2."
      }
    ],
    "scope": null,
    "customers": [
      "HGC Construction",
      "MESSER CONSTRUCTION COMPANY"
    ]
  },
  {
    "id": "job-18",
    "sourceJobNumber": 18,
    "title": "Findlay Community Center",
    "customer": "SKANSKA USA BUILDING INC.",
    "photos": [
      {
        "src": "/projects/2026/findlay-01.webp",
        "alt": "Rooftop equipment at Findlay Community Center."
      },
      {
        "src": "/projects/2026/findlay-02.webp",
        "alt": "Ductwork installation at Findlay Community Center."
      }
    ],
    "scope": null
  },
  {
    "id": "job-19",
    "sourceJobNumber": 19,
    "title": "CH Winslow Research Facility",
    "customer": "MESSER CONSTRUCTION COMPANY",
    "photos": [
      {
        "src": "/projects/2026/winslow-02.webp",
        "alt": "Exterior of the Winslow Research Pavilion; the building sign confirms the Winslow spelling."
      },
      {
        "src": "/projects/2026/winslow-01.webp",
        "alt": "SURE Mechanical crew during an equipment lift at the Winslow project."
      }
    ],
    "scope": null
  },
  {
    "id": "job-20",
    "sourceJobNumber": 20,
    "title": "Renovation Kenton Elementary",
    "customer": "Monarch Construction Co",
    "photos": [
      {
        "src": "/projects/2026/kenton-01.webp",
        "alt": "Ductwork at Kenton Elementary School."
      }
    ],
    "scope": null
  },
  {
    "id": "photo-uc-mab",
    "title": "UC MAB \u2014 AHU Fan Motor",
    "customer": null,
    "photos": [
      {
        "src": "/projects/2026/uc-mab-01.webp",
        "alt": "SURE Mechanical crew working at the UC MAB project."
      }
    ],
    "scope": null
  },
  {
    "id": "photo-bethesda",
    "title": "Bethesda Arrow Springs MRI",
    "customer": null,
    "photos": [
      {
        "src": "/projects/2026/bethesda-01.webp",
        "alt": "Mechanical equipment at Bethesda Arrow Springs MRI."
      }
    ],
    "scope": null
  },
  {
    "id": "photo-duke-energy",
    "title": "Duke Energy \u2014 Air Handling Unit Assembly",
    "customer": null,
    "photos": [
      {
        "src": "/projects/2026/duke-energy-01.webp",
        "alt": "Air handling unit assembly at Duke Energy."
      }
    ],
    "scope": "Assembly of two air handling units, each with 8,000 rivets."
  },
  {
    "id": "photo-dayton-police",
    "title": "Dayton Police Station",
    "customer": null,
    "photos": [
      {
        "src": "/projects/2026/dayton-police-01.webp",
        "alt": "Ceiling-mounted mechanical equipment at Dayton Police Station."
      }
    ],
    "scope": null
  }
].map(withAssetPaths);

export const PHOTO_COLLECTIONS = PROJECTS.filter(project => project.photos.length);
