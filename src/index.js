import React from 'react';
import ReactDOM from 'react-dom';
import SportsCalendar from './SportsCalendar';

// Export for external use
export default SportsCalendar;

// Auto-render if container exists
if (typeof document !== 'undefined') {
  const container = document.getElementById('sports-calendar-root');
  if (container) {
    ReactDOM.render(React.createElement(SportsCalendar), container);
  }
}

// Also attach to window for direct access
if (typeof window !== 'undefined') {
  window.SportsCalendar = SportsCalendar;
}
