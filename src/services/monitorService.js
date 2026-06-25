class MonitorService {
  constructor() {
    // Stores monitors by ID
    this.monitors = new Map();
  }

  /**
   * Register a new monitor
   */
  registerMonitor(id, timeout, alertEmail) {
    if (this.monitors.has(id)) {
      throw new Error('Monitor with this ID already exists');
    }

    const monitor = {
      id,
      timeout, // Original timeout duration in seconds
      alertEmail,
      status: 'ok',
      timer: null,
      lastHeartbeat: Date.now(),
      startTime: Date.now(),
      paused: false
    };

    this.monitors.set(id, monitor);
    this._startTimer(id);
    
    return this._formatResponse(monitor);
  }

  /**
   * Handle a heartbeat from a monitor
   */
  heartbeat(id) {
    const monitor = this.monitors.get(id);
    
    if (!monitor) {
      throw new Error('Monitor not found');
    }

    if (monitor.status === 'down' || monitor.status === 'paused') {
      // If it was down or paused, we reset its status to ok
      monitor.status = 'ok';
    }

    monitor.paused = false;
    monitor.lastHeartbeat = Date.now();
    this._startTimer(id);

    return this._formatResponse(monitor);
  }

  /**
   * Pause a monitor (Bonus feature)
   */
  pause(id) {
    const monitor = this.monitors.get(id);
    
    if (!monitor) {
      throw new Error('Monitor not found');
    }

    if (monitor.timer) {
      clearTimeout(monitor.timer);
      monitor.timer = null;
    }

    monitor.paused = true;
    monitor.status = 'paused';

    return this._formatResponse(monitor);
  }

  /**
   * Get all monitors (Developer's Choice)
   */
  getAllMonitors() {
    const result = [];
    for (const [_, monitor] of this.monitors) {
      result.push(this._formatResponse(monitor));
    }
    return result;
  }

  /**
   * Get a specific monitor (Developer's Choice)
   */
  getMonitor(id) {
    const monitor = this.monitors.get(id);
    if (!monitor) {
      throw new Error('Monitor not found');
    }
    return this._formatResponse(monitor);
  }

  // --- Private Helper Methods ---

  _startTimer(id) {
    const monitor = this.monitors.get(id);
    
    if (monitor.timer) {
      clearTimeout(monitor.timer);
    }

    monitor.timer = setTimeout(() => {
      this._triggerAlert(id);
    }, monitor.timeout * 1000); // timeout is in seconds, convert to ms
  }

  _triggerAlert(id) {
    const monitor = this.monitors.get(id);
    
    if (monitor && !monitor.paused && monitor.status !== 'down') {
      monitor.status = 'down';
      monitor.timer = null;
      
      const alertPayload = {
        ALERT: `Device ${id} is down!`,
        time: new Date().toISOString()
      };
      
      // Simulate sending an alert
      console.log(JSON.stringify(alertPayload));
    }
  }

  _formatResponse(monitor) {
    let timeRemaining = 0;
    
    if (!monitor.paused && monitor.status === 'ok') {
      const elapsed = (Date.now() - monitor.lastHeartbeat) / 1000;
      timeRemaining = Math.max(0, monitor.timeout - elapsed);
    }

    return {
      id: monitor.id,
      timeout: monitor.timeout,
      alertEmail: monitor.alertEmail,
      status: monitor.status,
      timeRemaining: Math.floor(timeRemaining)
    };
  }
}

module.exports = new MonitorService();
