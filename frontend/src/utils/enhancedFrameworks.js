// Enhanced ESG Frameworks
export const enhancedFrameworks = {
  GRI: {
    name: 'Global Reporting Initiative',
    version: '2021',
    categories: ['Universal', 'Economic', 'Environmental', 'Social'],
    standards: {
      universal: ['GRI 1', 'GRI 2', 'GRI 3'],
      economic: ['GRI 201', 'GRI 202', 'GRI 203', 'GRI 204', 'GRI 205', 'GRI 206', 'GRI 207'],
      environmental: ['GRI 301', 'GRI 302', 'GRI 303', 'GRI 304', 'GRI 305', 'GRI 306', 'GRI 307', 'GRI 308'],
      social: ['GRI 401', 'GRI 402', 'GRI 403', 'GRI 404', 'GRI 405', 'GRI 406', 'GRI 407', 'GRI 408', 'GRI 409', 'GRI 410', 'GRI 411', 'GRI 413', 'GRI 414', 'GRI 415', 'GRI 416', 'GRI 417', 'GRI 418']
    }
  },
  
  SASB: {
    name: 'Sustainability Accounting Standards Board',
    version: '2023',
    dimensions: ['Environment', 'Social Capital', 'Human Capital', 'Business Model & Innovation', 'Leadership & Governance'],
    sectors: ['Technology', 'Healthcare', 'Financials', 'Consumer Goods', 'Infrastructure']
  },
  
  TCFD: {
    name: 'Task Force on Climate-related Financial Disclosures',
    version: '2023',
    pillars: ['Governance', 'Strategy', 'Risk Management', 'Metrics and Targets'],
    recommendations: {
      governance: ['Board oversight', 'Management role'],
      strategy: ['Climate risks and opportunities', 'Impact on business', 'Resilience of strategy'],
      riskManagement: ['Risk identification', 'Risk management', 'Integration'],
      metricsTargets: ['Climate metrics', 'Scope 1, 2, 3 emissions', 'Climate targets']
    }
  },
  
  BRSR: {
    name: 'Business Responsibility and Sustainability Reporting',
    version: '2023',
    principles: [
      'Principle 1: Ethics, Transparency and Accountability',
      'Principle 2: Product Lifecycle Sustainability',
      'Principle 3: Employees Well-being',
      'Principle 4: Stakeholder Engagement',
      'Principle 5: Human Rights',
      'Principle 6: Environment',
      'Principle 7: Policy Advocacy',
      'Principle 8: Inclusive Growth',
      'Principle 9: Customer Value'
    ]
  }
};

export const getFrameworkStandards = (framework) => {
  return enhancedFrameworks[framework] || null;
};

export const getAllFrameworks = () => {
  return Object.keys(enhancedFrameworks);
};

export const mapDataToFramework = (data, framework) => {
  const frameworkData = enhancedFrameworks[framework];
  if (!frameworkData) return data;
  
  return data.map(item => ({
    ...item,
    framework,
    frameworkVersion: frameworkData.version,
    mappedStandard: getMappedStandard(item, framework)
  }));
};

const getMappedStandard = (item, framework) => {
  switch (framework) {
    case 'GRI':
      return getGRIStandard(item.category);
    case 'SASB':
      return getSASBDimension(item.category);
    case 'TCFD':
      return getTCFDPillar(item.category);
    case 'BRSR':
      return getBRSRPrinciple(item.category);
    default:
      return 'General';
  }
};

const getGRIStandard = (category) => {
  const mapping = {
    environmental: 'GRI 300 Series',
    social: 'GRI 400 Series',
    governance: 'GRI 2',
    economic: 'GRI 200 Series'
  };
  return mapping[category] || 'GRI Universal';
};

const getSASBDimension = (category) => {
  const mapping = {
    environmental: 'Environment',
    social: 'Social Capital',
    governance: 'Leadership & Governance',
    economic: 'Business Model & Innovation'
  };
  return mapping[category] || 'General';
};

const getTCFDPillar = (category) => {
  const mapping = {
    environmental: 'Risk Management',
    social: 'Strategy',
    governance: 'Governance',
    economic: 'Metrics and Targets'
  };
  return mapping[category] || 'Strategy';
};

const getBRSRPrinciple = (category) => {
  const mapping = {
    environmental: 'Principle 6: Environment',
    social: 'Principle 3: Employees Well-being',
    governance: 'Principle 1: Ethics, Transparency and Accountability',
    economic: 'Principle 8: Inclusive Growth'
  };
  return mapping[category] || 'General';
};

export default enhancedFrameworks;