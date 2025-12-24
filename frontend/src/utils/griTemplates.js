// GRI Templates and Standards
export const griStandards = {
  'GRI 2': 'General Disclosures',
  'GRI 3': 'Material Topics',
  'GRI 201': 'Economic Performance',
  'GRI 302': 'Energy',
  'GRI 305': 'Emissions',
  'GRI 401': 'Employment',
  'GRI 405': 'Diversity and Equal Opportunity'
};

export const griTemplates = {
  environmental: [
    { id: 'GRI-302-1', name: 'Energy consumption within the organization', category: 'Energy' },
    { id: 'GRI-305-1', name: 'Direct (Scope 1) GHG emissions', category: 'Emissions' },
    { id: 'GRI-305-2', name: 'Energy indirect (Scope 2) GHG emissions', category: 'Emissions' }
  ],
  social: [
    { id: 'GRI-401-1', name: 'New employee hires and employee turnover', category: 'Employment' },
    { id: 'GRI-405-1', name: 'Diversity of governance bodies and employees', category: 'Diversity' }
  ],
  governance: [
    { id: 'GRI-2-9', name: 'Governance structure and composition', category: 'Governance' },
    { id: 'GRI-2-10', name: 'Nomination and selection of the highest governance body', category: 'Governance' }
  ]
};

export const getGRITemplate = (category) => {
  return griTemplates[category] || [];
};

export const getAllGRITemplates = () => {
  return Object.values(griTemplates).flat();
};