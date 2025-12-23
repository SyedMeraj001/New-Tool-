/**
 * ESG Report Analysis - Best Practices from Standard Organizations
 * Analysis of leading ESG reports from Fortune 500 companies and standard setters
 */

export const ESG_REPORT_BENCHMARKS = {
  // Tesla Impact Report - Innovation Focus
  tesla: {
    framework: ['GRI', 'SASB', 'TCFD'],
    uniqueApproach: 'Mission-driven narrative with quantified global impact',
    keyFeatures: ['CO2 avoided calculations', 'Gigafactory efficiency', 'Autopilot safety data'],
    visualStyle: 'Clean minimalist design with bold impact numbers'
  },

  // Patagonia Environmental Report - Activism Style
  patagonia: {
    framework: ['B Corp', 'Fair Trade'],
    uniqueApproach: 'Radical transparency with supply chain deep-dive',
    keyFeatures: ['1% for Planet donations', 'Worn Wear program metrics', 'Political activism tracking'],
    visualStyle: 'Photography-heavy with authentic storytelling'
  },

  // Interface Mission Zero Report - Science-Based
  interface: {
    framework: ['GRI', 'CDP', 'Science Based Targets'],
    uniqueApproach: 'Carbon negative mission with detailed methodology',
    keyFeatures: ['Carbon intensity per m²', 'Renewable energy certificates', 'Biosphere positive impact'],
    visualStyle: 'Data-rich infographics with nature imagery'
  },

  // Salesforce Stakeholder Impact Report - Digital Native
  salesforce: {
    framework: ['GRI', 'SASB', 'UN SDGs'],
    uniqueApproach: 'Interactive digital-first with stakeholder stories',
    keyFeatures: ['Ohana culture metrics', 'V2MOM goal alignment', 'Trailblazer community impact'],
    visualStyle: 'Interactive dashboards with real-time data'
  },

  // IKEA Sustainability Report - Circular Economy
  ikea: {
    framework: ['GRI', 'TCFD'],
    uniqueApproach: 'Circular business model with life-at-home focus',
    keyFeatures: ['Renewable materials %', 'Spare parts availability', 'Democratic design principles'],
    visualStyle: 'Product-focused with lifestyle integration'
  },

  // Ben & Jerry's Social Mission Report - Values-Driven
  benjerrys: {
    framework: ['B Corp'],
    uniqueApproach: 'Social justice integration with business metrics',
    keyFeatures: ['CEO pay ratio', 'Activism campaigns', 'Supplier diversity'],
    visualStyle: 'Playful design with serious social impact data'
  }
};

export const INNOVATIVE_FEATURES = {
  storytelling: {
    tesla: 'Global impact calculator showing CO2 avoided by all Tesla vehicles',
    patagonia: 'Supply chain transparency with factory worker stories',
    interface: 'Mission Zero countdown with real-time progress tracking'
  },
  
  dataVisualization: {
    salesforce: 'Interactive equality dashboard with drill-down capabilities',
    ikea: 'Circular material flow diagrams',
    benjerrys: 'Social justice timeline with business milestones'
  },
  
  stakeholderEngagement: {
    patagonia: 'Customer activism platform integration',
    salesforce: 'Trailblazer community impact stories',
    interface: 'Employee climate action challenges'
  }
};

export const DESIGN_INSPIRATIONS = {
  minimalist: {
    example: 'Tesla',
    characteristics: 'Clean lines, bold numbers, lots of white space',
    implementation: 'Large impact metrics, minimal text, high contrast'
  },
  
  authentic: {
    example: 'Patagonia',
    characteristics: 'Real photography, honest messaging, supply chain transparency',
    implementation: 'Behind-the-scenes content, worker stories, challenge acknowledgment'
  },
  
  scientific: {
    example: 'Interface',
    characteristics: 'Data-heavy, methodology focus, peer-reviewed approach',
    implementation: 'Detailed calculations, third-party verification, academic rigor'
  },
  
  interactive: {
    example: 'Salesforce',
    characteristics: 'Digital-first, real-time data, user engagement',
    implementation: 'Clickable elements, live dashboards, personalized content'
  }
};

export const BEST_PRACTICES = {
  structure: {
    coverPage: 'Company logo + report title + reporting period + framework badges',
    tableOfContents: 'Clear navigation with page numbers and subsections',
    executiveSummary: 'CEO letter + key achievements + forward-looking statements',
    materialityMatrix: 'Stakeholder impact vs business impact visualization',
    performanceData: 'Multi-year trends + targets + progress indicators',
    assurance: 'Third-party verification + methodology + limitations'
  },
  
  visualDesign: {
    colorScheme: 'Brand colors + accessibility compliant contrast',
    typography: 'Clear hierarchy + readable fonts + consistent sizing',
    charts: 'Simple + focused + properly labeled + trend indicators',
    layout: 'White space + logical flow + consistent margins'
  },
  
  contentStrategy: {
    narrative: 'Story-driven + outcome-focused + stakeholder-relevant',
    metrics: 'Quantitative + comparable + time-series + benchmarked',
    targets: 'Science-based + time-bound + measurable + ambitious',
    transparency: 'Challenges acknowledged + methodology explained + data assured'
  }
};

export const FRAMEWORK_REQUIREMENTS = {
  GRI: {
    mandatory: ['102-1 to 102-13', '102-14', '102-16', '102-18'],
    environmental: ['301', '302', '303', '304', '305', '306', '307', '308'],
    social: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414'],
    governance: ['201', '202', '203', '204', '205', '206', '207']
  },
  
  SASB: {
    dimensions: ['Environment', 'Social Capital', 'Human Capital', 'Business Model & Innovation', 'Leadership & Governance'],
    industrySpecific: true,
    quantitative: 'Standardized metrics with units',
    qualitative: 'Discussion and analysis'
  },
  
  TCFD: {
    pillars: ['Governance', 'Strategy', 'Risk Management', 'Metrics and Targets'],
    climateScenarios: 'Multiple scenarios including 1.5°C pathway',
    timeHorizons: 'Short, medium, and long-term',
    quantification: 'Financial impact where possible'
  }
};

export const generateInnovativeReport = (companyData, inspirationType = 'minimalist') => {
  const inspiration = DESIGN_INSPIRATIONS[inspirationType];
  
  return {
    designTheme: inspiration,
    contentStrategy: getContentStrategy(inspirationType),
    visualElements: getVisualElements(inspirationType),
    uniqueFeatures: getUniqueFeatures(inspirationType, companyData)
  };
};

const getContentStrategy = (type) => {
  const strategies = {
    minimalist: 'Focus on key impact numbers with minimal explanatory text',
    authentic: 'Include challenges and failures alongside successes',
    scientific: 'Provide detailed methodology and peer-reviewed data',
    interactive: 'Create engaging, clickable content with real-time updates'
  };
  return strategies[type];
};

const getVisualElements = (type) => {
  const elements = {
    minimalist: ['Large impact numbers', 'Clean charts', 'Lots of white space'],
    authentic: ['Real photography', 'Behind-the-scenes content', 'Worker testimonials'],
    scientific: ['Detailed infographics', 'Methodology diagrams', 'Peer review badges'],
    interactive: ['Clickable dashboards', 'Animated progress bars', 'Real-time data feeds']
  };
  return elements[type];
};

const getUniqueFeatures = (type, data) => {
  const features = {
    minimalist: [`${data.length} metrics tracked`, 'Zero-waste commitment', 'Carbon neutral by 2030'],
    authentic: ['Supply chain transparency', 'Worker safety stories', 'Environmental challenges'],
    scientific: ['Third-party verified', 'Science-based targets', 'Peer-reviewed methodology'],
    interactive: ['Live sustainability dashboard', 'Real-time impact tracking', 'Stakeholder feedback loop']
  };
  return features[type];
};

export default {
  ESG_REPORT_BENCHMARKS,
  INNOVATIVE_FEATURES,
  DESIGN_INSPIRATIONS,
  BEST_PRACTICES,
  FRAMEWORK_REQUIREMENTS,
  generateInnovativeReport
};