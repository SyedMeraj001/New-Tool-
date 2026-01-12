class RealtimeSyncClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
    this.isConnecting = false;
    this.userId = null;
  }

  connect(userId = null) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }
    
    this.isConnecting = true;
    this.userId = userId;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_HOST || window.location.host;
    const wsUrl = `${protocol}//${host}/ws${userId ? `?userId=${userId}` : ''}`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connected':
        console.log('WebSocket connected with userId:', data.userId);
        break;
      case 'regulatory_update':
      case 'regulatory_create':
      case 'regulatory_delete':
        this.notifyListeners('regulatory', data);
        break;
      case 'compliance_update':
      case 'compliance_create':
        this.notifyListeners('compliance', data);
        break;
      case 'update':
        this.notifyListeners(data.entityType, data);
        break;
      case 'pong':
        // Heartbeat response - connection is alive
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  syncUpdate(entityType, entityId, action, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'sync',
        entityType,
        entityId,
        action,
        payload,
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending sync update:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send sync update');
    }
  }

  subscribe(entityType, callback) {
    if (!this.listeners.has(entityType)) {
      this.listeners.set(entityType, []);
    }
    this.listeners.get(entityType).push(callback);
    console.log(`Subscribed to ${entityType} updates`);
  }

  unsubscribe(entityType, callback) {
    if (this.listeners.has(entityType)) {
      const callbacks = this.listeners.get(entityType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(`Unsubscribed from ${entityType} updates`);
      }
    }
  }

  notifyListeners(entityType, data) {
    if (this.listeners.has(entityType)) {
      const callbacks = this.listeners.get(entityType);
      console.log(`Notifying ${callbacks.length} listeners for ${entityType}`);
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in listener callback:', error);
        }
      });
    }
  }

  startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing interval
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
      }
    }, 30000); // 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
      
      setTimeout(() => {
        if (!this.isConnecting && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
          this.connect(this.userId);
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    console.log('Disconnecting WebSocket...');
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  getConnectionState() {
    if (!this.ws) return 'DISCONNECTED';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }
}

export default new RealtimeSyncClient();