import React from 'react';
import ReactDOM from 'react-dom';
import HockeyCardCalendar from './SportsCalendar'; // Note: still importing from same file

// Export for external use
export default HockeyCardCalendar;

// Auto-render if container exists
if (typeof document !== 'undefined') {
  const container = document.getElementById('sports-calendar-root');
  if (container) {
    ReactDOM.render(React.createElement(HockeyCardCalendar), container);
  }
}

// Also attach to window for direct access
if (typeof window !== 'undefined') {
  window.SportsCalendar = HockeyCardCalendar;
}
