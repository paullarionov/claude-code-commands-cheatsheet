// Initialize widget on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLimitsWidget();
  // Update widget every minute
  setInterval(updateLimitsWidget, 60000);

  // Check system status
  updateSystemStatus();
  // Check system status every 5 minutes
  setInterval(updateSystemStatus, 300000);
});

function updateLimitsWidget() {
  const now = new Date();

  // Get UTC time
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();

  // Get local time for display
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone
  });

  // Update time display
  const timeDisplay = document.getElementById('widget-time');
  if (timeDisplay) {
    timeDisplay.textContent = `Your time: ${timeStr} (${timezone})`;
  }

  // Generate 24 hour blocks
  const barsContainer = document.getElementById('hourly-bars');
  if (barsContainer && barsContainer.children.length === 0) {
    for (let h = 0; h < 24; h++) {
      const block = document.createElement('div');
      block.className = 'limits-hour-block';
      block.title = `${h.toString().padStart(2, '0')}:00 UTC`;

      // Determine color based on period
      if (h >= 16 || h < 1) {
        // Peak hours: red
        block.classList.add('peak');
      } else {
        // Best time: green
        block.classList.add('best');
      }

      barsContainer.appendChild(block);
    }
  }

  // Mark current hour
  if (barsContainer) {
    const blocks = barsContainer.querySelectorAll('.limits-hour-block');
    blocks.forEach((block, index) => {
      if (index === utcHours) {
        block.classList.add('current');
      } else {
        block.classList.remove('current');
      }
    });
  }

  // Determine current period
  const isPeak = utcHours >= 16 || utcHours < 1;

  // Update status
  const statusEl = document.getElementById('current-status');
  if (statusEl) {
    const statusText = isPeak ? 'Low Limits' : 'High Limits';
    statusEl.textContent = statusText;
    statusEl.className = `limits-current-status ${isPeak ? 'low' : 'high'}`;
  }

  // Calculate time until next period
  let timeUntil, currentPeriodText;

  if (isPeak) {
    let nextHour = 1;
    let hoursUntil = nextHour - utcHours;
    if (hoursUntil <= 0) hoursUntil += 24;
    const minutesUntil = 60 - utcMinutes;
    if (minutesUntil === 60) {
      hoursUntil -= 1;
    }
    timeUntil = `${hoursUntil}h ${minutesUntil % 60}m`;
    currentPeriodText = 'Peak Hours (Low Limits)';
  } else {
    let nextHour = 16;
    let hoursUntil = nextHour - utcHours;
    const minutesUntil = 60 - utcMinutes;
    if (minutesUntil === 60) {
      hoursUntil -= 1;
    }
    timeUntil = `${hoursUntil}h ${minutesUntil % 60}m`;
    currentPeriodText = 'Best Time (High Limits)';
  }

  // Update info boxes
  const currentPeriodEl = document.getElementById('info-current-period');
  if (currentPeriodEl) currentPeriodEl.textContent = currentPeriodText;

  const timeUntilEl = document.getElementById('info-time-until');
  if (timeUntilEl) timeUntilEl.textContent = timeUntil;
}

async function updateSystemStatus() {
  try {
    const response = await fetch('https://status.claude.com/api/v2/status.json');
    const data = await response.json();

    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.getElementById('status-indicator');

    if (!statusDot || !statusText) return;

    const status = data.status.indicator;
    let statusClass = 'unknown';
    let statusLabel = 'Unknown';

    switch(status) {
      case 'none':
        statusClass = 'operational';
        statusLabel = 'All Systems Operational';
        break;
      case 'minor':
        statusClass = 'degraded';
        statusLabel = 'Minor Issues';
        break;
      case 'major':
        statusClass = 'degraded';
        statusLabel = 'Major Issues';
        break;
      case 'critical':
        statusClass = 'outage';
        statusLabel = 'Critical Outage';
        break;
    }

    statusDot.className = `limits-status-dot ${statusClass}`;
    statusText.textContent = statusLabel;

    // Add click handler to open status page
    if (statusIndicator) {
      statusIndicator.style.cursor = 'pointer';
      statusIndicator.onclick = () => {
        const { shell } = require('electron');
        shell.openExternal('https://status.claude.com');
      };
    }
  } catch (err) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    if (statusDot && statusText) {
      statusDot.className = 'limits-status-dot unknown';
      statusText.textContent = 'Unable to load';
    }
  }
}

// Apply saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  const nightThemePreference = localStorage.getItem('nightTheme');
  if (nightThemePreference === 'enabled') {
    document.body.classList.add('night-theme');
  }
});
