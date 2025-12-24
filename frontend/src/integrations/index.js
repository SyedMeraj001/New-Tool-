// Integration modules for external systems
export const integrationTypes = {
  IOT: 'Internet of Things',
  ERP: 'Enterprise Resource Planning',
  API: 'Third Party APIs',
  DATABASE: 'External Databases',
  CLOUD: 'Cloud Services'
};

export const getAvailableIntegrations = () => {
  return [
    { id: 'iot', name: 'IoT Sensors', type: 'IOT', status: 'active' },
    { id: 'sap', name: 'SAP ERP', type: 'ERP', status: 'available' },
    { id: 'oracle', name: 'Oracle Database', type: 'DATABASE', status: 'available' },
    { id: 'aws', name: 'AWS Services', type: 'CLOUD', status: 'active' },
    { id: 'azure', name: 'Azure Services', type: 'CLOUD', status: 'available' }
  ];
};

export const validateIntegration = (integrationConfig) => {
  const required = ['id', 'name', 'type'];
  return required.every(field => integrationConfig[field]);
};

// Integration components
export const IntegrationConfig = {
  create: (config) => ({ ...config, id: Date.now() }),
  validate: validateIntegration,
  getTypes: () => integrationTypes
};

export const IntegrationManager = {
  getAll: getAvailableIntegrations,
  create: (config) => IntegrationConfig.create(config),
  validate: validateIntegration
};

export const ERPConnector = {
  connect: (config) => ({ connected: true, config }),
  disconnect: () => ({ connected: false }),
  sync: (data) => ({ synced: true, data })
};

export const IoTDataIngestion = {
  startIngestion: () => ({ status: 'started' }),
  stopIngestion: () => ({ status: 'stopped' }),
  getMetrics: () => ({ metrics: [] })
};

export const HRMSSync = {
  syncEmployeeData: () => ({ synced: true }),
  getEmployeeMetrics: () => ({ metrics: [] })
};

export const ConnectorFactory = {
  create: (type) => {
    switch (type) {
      case 'ERP': return ERPConnector;
      case 'IOT': return IoTDataIngestion;
      case 'HRMS': return HRMSSync;
      default: return null;
    }
  }
};

export const UtilityBillImporter = {
  import: (file) => ({ imported: true, file }),
  parse: (data) => ({ parsed: true, data })
};

export default {
  integrationTypes,
  getAvailableIntegrations,
  validateIntegration,
  IntegrationConfig,
  IntegrationManager,
  ERPConnector,
  IoTDataIngestion,
  HRMSSync,
  ConnectorFactory,
  UtilityBillImporter
};