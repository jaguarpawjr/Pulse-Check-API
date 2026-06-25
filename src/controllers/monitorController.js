const monitorService = require('../services/monitorService');

class MonitorController {
  
  /**
   * POST /monitors
   * Register a new monitor
   */
  register(req, res) {
    try {
      const { id, timeout, alert_email } = req.body;

      if (!id || typeof timeout !== 'number' || !alert_email) {
        return res.status(400).json({ error: 'Missing or invalid required fields (id, timeout, alert_email)' });
      }

      const monitor = monitorService.registerMonitor(id, timeout, alert_email);
      res.status(201).json({ message: 'Monitor created successfully', monitor });
    } catch (error) {
      if (error.message === 'Monitor with this ID already exists') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * POST /monitors/:id/heartbeat
   * Reset the timer
   */
  heartbeat(req, res) {
    try {
      const { id } = req.params;
      const monitor = monitorService.heartbeat(id);
      res.status(200).json({ message: 'Heartbeat received', monitor });
    } catch (error) {
      if (error.message === 'Monitor not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * POST /monitors/:id/pause
   * Pause the monitor (Bonus Feature)
   */
  pause(req, res) {
    try {
      const { id } = req.params;
      const monitor = monitorService.pause(id);
      const message = monitor.status === 'paused' ? 'Monitor paused successfully' : 'Monitor resumed successfully';
      res.status(200).json({ message, monitor });
    } catch (error) {
      if (error.message === 'Monitor not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /monitors
   * Get all monitors (Developer's Choice)
   */
  getAll(req, res) {
    try {
      const monitors = monitorService.getAllMonitors();
      res.status(200).json(monitors);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /monitors/:id
   * Get a specific monitor (Developer's Choice)
   */
  getOne(req, res) {
    try {
      const { id } = req.params;
      const monitor = monitorService.getMonitor(id);
      res.status(200).json(monitor);
    } catch (error) {
      if (error.message === 'Monitor not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new MonitorController();
