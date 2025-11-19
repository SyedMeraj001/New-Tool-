import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const IoTDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showApiData, setShowApiData] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [apiTitle, setApiTitle] = useState('');
  const [newDevice, setNewDevice] = useState({ deviceId: '', deviceType: '', location: '' });

  useEffect(() => {
    fetchDeviceStatus();
    fetchRealTimeMetrics();
    const interval = setInterval(fetchRealTimeMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/iot/devices/status');
      const data = await response.json();
      if (data.success) {
        setDevices(data.data);
      }
    } catch (error) {
      console.error('Error fetching device status:', error);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/iot/metrics/realtime');
      const data = await response.json();
      if (data.success) {
        setRealTimeMetrics(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      setLoading(false);
    }
  };

  const registerDevice = async (deviceData) => {
    try {
      const response = await fetch('http://localhost:5000/api/iot/devices/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Device registered successfully!');
        fetchDeviceStatus();
        setShowRegisterModal(false);
        setNewDevice({ deviceId: '', deviceType: '', location: '' });
      } else {
        alert(`Failed to register device: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error registering device:', error);
      alert('Error connecting to server. Make sure backend is running on port 5000.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (newDevice.deviceId && newDevice.deviceType && newDevice.location) {
      registerDevice(newDevice);
    } else {
      alert('Please fill in all fields');
    }
  };

  const viewApiData = async (endpoint, title) => {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      const data = await response.json();
      setApiData(data);
      setApiTitle(title);
      setShowApiData(true);
    } catch (error) {
      console.error('Error fetching API data:', error);
      alert('Error connecting to server. Make sure backend is running on port 5000.');
    }
  };

  const renderApiData = (data) => {
    if (!data) return null;

    if (data.summary) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Summary</h4>
            {Object.entries(data.summary).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Status</h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Success:</span>
                <span className={`font-medium ${data.success ? 'text-green-600' : 'text-red-600'}`}>
                  {data.success ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="font-medium">{new Date(data.timestamp || Date.now()).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (data.environmental) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">🌱 Environmental</h4>
            {Object.entries(data.environmental).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">👥 Social</h4>
            {Object.entries(data.social).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
              </div>
            ))}
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold text-purple-800 mb-2">🏛️ Governance</h4>
            {Object.entries(data.governance).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Data Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="font-medium">
                {typeof value === 'object' ? `${Object.keys(value).length} items` : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const deleteDevice = async (deviceId) => {
    if (window.confirm(`Are you sure you want to delete device ${deviceId}? This will also delete all associated sensor data.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/iot/devices/${deviceId}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
          alert('Device deleted successfully!');
          fetchDeviceStatus();
        } else {
          alert(`Failed to delete device: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error connecting to server.');
      }
    }
  };

  const DeviceCard = ({ device }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{device.deviceId}</span>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-sm ${
              device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {device.status}
            </span>
            <button
              onClick={() => deleteDevice(device.deviceId)}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              title="Delete Device"
            >
              🗑️
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Type:</strong> {device.deviceType}</p>
        <p><strong>Location:</strong> {device.location}</p>
        <p><strong>Last Update:</strong> {new Date(device.lastHeartbeat).toLocaleString()}</p>
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, unit, icon }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="text-2xl mr-4">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value} {unit}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading IoT Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">IoT Monitoring Dashboard</h1>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Real-time Emissions" 
          value={realTimeMetrics.realTimeEmissions || 0} 
          unit="kg CO2" 
          icon="🌱" 
        />
        <MetricCard 
          title="Waste Generated" 
          value={realTimeMetrics.realTimeWaste || 0} 
          unit="kg" 
          icon="🗑️" 
        />
        <MetricCard 
          title="Active Devices" 
          value={devices.filter(d => d.status === 'active').length} 
          unit="" 
          icon="📡" 
        />
        <MetricCard 
          title="Data Points Today" 
          value="1,247" 
          unit="" 
          icon="📊" 
        />
      </div>

      {/* Device Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected IoT Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length > 0 ? (
              devices.map(device => <DeviceCard key={device.deviceId} device={device} />)
            ) : (
              <p className="text-gray-500">No IoT devices registered yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              📱 Register New Device
            </button>
            
            <button 
              onClick={() => viewApiData('/api/iot/devices/status', 'Device Status & Analytics')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              🔗 Device Analytics
            </button>
            
            <button 
              onClick={() => viewApiData('/api/iot/metrics/realtime', 'Real-time ESG Metrics')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              📊 ESG Metrics
            </button>
            
            <button 
              onClick={() => viewApiData('/api/iot/metrics/esg-impact', 'ESG Impact Analysis')}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              🌱 Impact Analysis
            </button>
            
            <button 
              onClick={() => viewApiData('/api/iot/devices/analytics?timeRange=24h', 'Device Performance Analytics')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              📈 Performance Analytics
            </button>
            
            <button 
              onClick={() => fetchRealTimeMetrics()}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              🔄 Refresh Metrics
            </button>
          </CardContent>
        </Card>
      </div>

      {/* IoT Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>IoT Integration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Supported Sensor Types:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Energy Meters (kWh)</li>
                <li>Water Sensors (liters)</li>
                <li>Air Quality (CO2 ppm)</li>
                <li>Waste Level (%)</li>
                <li>Temperature (°C)</li>
                <li>Humidity (%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>POST /api/iot/devices/register</li>
                <li>POST /api/iot/data/ingest</li>
                <li>GET /api/iot/metrics/realtime</li>
                <li>GET /api/iot/devices/status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Register Device Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Register New IoT Device</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device ID</label>
                <input
                  type="text"
                  value={newDevice.deviceId}
                  onChange={(e) => setNewDevice({...newDevice, deviceId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., SENSOR_001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <select
                  value={newDevice.deviceType}
                  onChange={(e) => setNewDevice({...newDevice, deviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select device type</option>
                  <option value="energy_meter">Energy Meter</option>
                  <option value="water_meter">Water Meter</option>
                  <option value="air_quality">Air Quality Sensor</option>
                  <option value="waste_sensor">Waste Level Sensor</option>
                  <option value="temperature">Temperature Sensor</option>
                  <option value="humidity">Humidity Sensor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Building A - Floor 2"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Register Device
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setNewDevice({ deviceId: '', deviceType: '', location: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced API Data Modal */}
      {showApiData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-6xl max-h-5/6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{apiTitle}</h3>
              <button
                onClick={() => setShowApiData(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Formatted Data Display */}
            <div className="space-y-4">
              {apiData && renderApiData(apiData)}
            </div>
            
            {/* Raw JSON Toggle */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
                View Raw JSON Data
              </summary>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64 border">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </details>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(apiData, null, 2))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Copy JSON
              </button>
              <button
                onClick={() => setShowApiData(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IoTDashboard;