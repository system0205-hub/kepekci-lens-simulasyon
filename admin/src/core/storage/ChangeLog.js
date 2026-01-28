// Değişiklik log servisi
export class ChangeLogService {
  static logChange(action, details, userId = 'admin') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      details,
      userId,
    };

    try {
      const config = JSON.parse(localStorage.getItem('kepekci-lens-admin') || '{}');
      const logs = config.changeLog || [];
      logs.unshift(logEntry);

      if (logs.length > 100) {
        logs.splice(100);
      }

      config.changeLog = logs;
      localStorage.setItem('kepekci-lens-admin', JSON.stringify(config));
    } catch (error) {
      console.error('Log kaydetme hatası:', error);
    }
  }

  static getLogs() {
    try {
      const config = JSON.parse(localStorage.getItem('kepekci-lens-admin') || '{}');
      return config.changeLog || [];
    } catch (error) {
      console.error('Log okuma hatası:', error);
      return [];
    }
  }

  static exportLogs() {
    const logs = this.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kepekci-lens-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default class ChangeLog {
  static log(data) {
    // Adapt object-style log to simple logChange
    const action = data.action;
    const details = `${data.collection}:${data.itemId} (${data.oldValue ? 'Modify' : 'New'})`;
    ChangeLogService.logChange(action, details, data.user);
  }
}
