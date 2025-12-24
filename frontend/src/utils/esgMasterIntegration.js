// ESG Master Integration utilities
export const esgMasterIntegration = {
  frameworks: ['GRI', 'SASB', 'TCFD', 'BRSR'],
  
  mapToFramework: (data, framework) => {
    const mappings = {
      GRI: mapToGRI,
      SASB: mapToSASB,
      TCFD: mapToTCFD,
      BRSR: mapToBRSR
    };
    
    return mappings[framework] ? mappings[framework](data) : data;
  },
  
  validateData: (data, framework) => {
    return data.filter(item => item.framework === framework || !item.framework);
  }
};

const mapToGRI = (data) => {
  return data.map(item => ({
    ...item,
    griStandard: getGRIStandard(item.category),
    disclosure: getGRIDisclosure(item.metric)
  }));
};

const mapToSASB = (data) => {
  return data.map(item => ({
    ...item,
    sasbTopic: getSASBTopic(item.category),
    metric: getSASBMetric(item.metric)
  }));
};

const mapToTCFD = (data) => {
  return data.map(item => ({
    ...item,
    tcfdPillar: getTCFDPillar(item.category),
    recommendation: getTCFDRecommendation(item.metric)
  }));
};

const mapToBRSR = (data) => {
  return data.map(item => ({
    ...item,
    brsrPrinciple: getBRSRPrinciple(item.category),
    disclosure: getBRSRDisclosure(item.metric)
  }));
};

const getGRIStandard = (category) => {
  const standards = {
    environmental: 'GRI 300 Series',
    social: 'GRI 400 Series',
    governance: 'GRI 2'
  };
  return standards[category] || 'GRI Universal';
};

const getSASBTopic = (category) => {
  const topics = {
    environmental: 'Environment',
    social: 'Social Capital',
    governance: 'Leadership & Governance'
  };
  return topics[category] || 'General';
};

const getTCFDPillar = (category) => {
  const pillars = {
    environmental: 'Risk Management',
    social: 'Strategy',
    governance: 'Governance'
  };
  return pillars[category] || 'Metrics and Targets';
};

const getBRSRPrinciple = (category) => {
  const principles = {
    environmental: 'Principle 6',
    social: 'Principle 3',
    governance: 'Principle 1'
  };
  return principles[category] || 'General';
};

const getGRIDisclosure = (metric) => `GRI-${metric}`;
const getSASBMetric = (metric) => `SASB-${metric}`;
const getTCFDRecommendation = (metric) => `TCFD-${metric}`;
const getBRSRDisclosure = (metric) => `BRSR-${metric}`;

export const ESGMasterIntegration = esgMasterIntegration;

export default esgMasterIntegration;