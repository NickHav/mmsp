class WebSocketManager {
  constructor() {
    if (!WebSocketManager.instance) {
      this.ws = null;
      this.listeners = new Set();
      this.sendQueue = [];
      WebSocketManager.instance = this;
    }
    return WebSocketManager.instance;
  }

  connect(url, onOpenSendData = null) {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      this.listeners.forEach((listener) => listener(event));
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
      // Send any queued messages
      this.sendQueue.forEach((data) => this.send(data));
      this.sendQueue = [];
      // Send data passed for onOpen
      if (onOpenSendData) {
        this.send(onOpenSendData);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      // Queue the message to send when the connection opens
      this.sendQueue.push(data);
      console.warn('WebSocket is not open. Queuing message. Ready state:', this.ws?.readyState);
    }
  }

  addMessageListener(listener) {
    this.listeners.add(listener);
  }

  removeMessageListener(listener) {
    this.listeners.delete(listener);
  }
}

const wsManager = new WebSocketManager();
export default wsManager;