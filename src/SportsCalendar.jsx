import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw, Package } from 'lucide-react';

const HockeyCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardReleases, setCardReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const releasesPerPage = 3;

  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7bXBVQ-wEiJdCk8-E-ZooW_wUhSRMVaJxvRoEMGquWgd-c3iBDcwpFpG7IuN104Qn1AKDtVtxqKWa/pub?output=csv';

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const parseCSVData = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 3) {
        const releaseDate = new Date(values[2]);
        
        if (!isNaN(releaseDate.getTime())) {
          data.push({
            id: i,
            setName: values[0],
            year: values[1],
            releaseDate: releaseDate
          });
        }
      }
    }

    return data;
  };

  const fetchSheetData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      
      const csvText = await response.text();
      const parsedData = parseCSVData(csvText);
      
      setCardReleases(parsedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sheet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getReleasesForDate = (date) => {
    if (!date) return [];
    
    return cardReleases.filter(release => 
      release.releaseDate && release.releaseDate.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setCurrentPage(0); // Reset pagination when changing months
    setIsDropdownOpen(false); // Close dropdown when changing months
  };

  const days = getDaysInMonth(currentDate);

  return React.createElement('div', { 
    className: "min-h-screen", 
    style: { 
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  },
    React.createElement('div', { 
      className: "max-w-6xl mx-auto p-4",
      style: { 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4a90a4 0%, #83cdea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        borderRadius: '24px',
        margin: '20px auto',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }
    },
      // Add mobile-specific CSS
      React.createElement('style', {}, `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .calendar-container {
            padding: 2px !important;
          }
          .calendar-day {
            min-height: 80px !important;
            padding: 4px !important;
            touch-action: manipulation;
          }
          .calendar-grid {
            gap: 1px !important;
          }
          .mobile-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .mobile-scroll::-webkit-scrollbar {
            display: none;
          }
          .controls-mobile {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .nav-mobile {
            width: 100% !important;
            justify-content: center !important;
          }
          .buttons-mobile {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `),
      
      // Header
      React.createElement('div', { 
        className: "mb-4 p-4 rounded-lg",
        style: {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
        }
      },
        React.createElement('h1', { 
          className: "text-3xl font-bold mb-2",
          style: { 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }
        }, "🏒 New Release Calender"),
        React.createElement('p', { 
          style: { 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            margin: 0
          }
        }, "Track upcoming hockey card releases and pre orders - all dates are subject to delays")
      ),

      // Controls Bar
      React.createElement('div', { 
        className: "flex items-center justify-between mb-4 p-3 rounded-lg controls-mobile",
        style: {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '16px',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      },
        // Navigation
        React.createElement('div', { 
          className: "flex items-center gap-3 nav-mobile",
          style: { flexShrink: 1, minWidth: 0 }
        },
          React.createElement('button', {
            onClick: () => navigateMonth(-1),
            className: "p-2 rounded-lg transition-colors",
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              flexShrink: 0
            }
          }, React.createElement(ChevronLeft, { className: "w-5 h-5" })),
          
          React.createElement('h2', { 
            className: "text-2xl font-bold",
            style: { 
              color: 'white',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }
          }, monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear()),
          
          React.createElement('button', {
            onClick: () => navigateMonth(1),
            className: "p-2 rounded-lg transition-colors",
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              flexShrink: 0
            }
          }, React.createElement(ChevronRight, { className: "w-5 h-5" }))
        ),
        
        // Action buttons
        React.createElement('div', { 
          className: "flex gap-2 buttons-mobile",
          style: { flexShrink: 0, flexWrap: 'nowrap' }
        },
          React.createElement('button', {
            onClick: () => setCurrentDate(new Date()),
            className: "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }
          },
            React.createElement(Calendar, { className: "w-4 h-4" }),
            "Today"
          ),
          
          React.createElement('button', {
            onClick: fetchSheetData,
            disabled: isLoading,
            className: "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }
          },
            React.createElement(RefreshCw, { 
              className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` 
            }),
            isLoading ? "Updating..." : "Refresh"
          )
        )
      ),

      // Status Bar
      lastUpdated && React.createElement('div', {
        className: "mb-4 p-2 rounded-lg text-center",
        style: {
          background: 'rgba(76, 175, 80, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '14px'
        }
      }, `✅ Last updated: ${lastUpdated.toLocaleString()}`),

      error && React.createElement('div', {
        className: "mb-4 p-2 rounded-lg text-center",
        style: {
          background: 'rgba(244, 67, 54, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '14px'
        }
      }, `❌ Error: ${error}`),

      // Calendar Grid
      React.createElement('div', { 
        className: "rounded-lg overflow-hidden mb-4 mobile-scroll",
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      },
        // Days of week header
        React.createElement('div', { 
          className: "grid grid-cols-7 calendar-grid",
          style: {
            background: 'rgba(74, 144, 164, 0.1)',
            borderBottom: '1px solid #e5e7eb'
          }
        },
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day =>
            React.createElement('div', { 
              key: day, 
              className: "p-4 text-center font-semibold",
              style: { 
                color: '#4a90a4',
                padding: window.innerWidth <= 768 ? '8px 4px' : '16px'
              }
            }, day)
          )
        ),

        // Calendar days
        React.createElement('div', { 
          className: "grid grid-cols-7 calendar-grid" 
        },
          days.map((date, index) => {
            const releases = getReleasesForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            
            return React.createElement('div', {
              key: index,
              className: "calendar-day border-r border-b border-gray-200",
              style: {
                minHeight: window.innerWidth <= 768 ? '80px' : '128px',
                padding: window.innerWidth <= 768 ? '4px' : '8px',
                backgroundColor: date ? (isToday ? '#eff6ff' : 'white') : '#f9fafb',
                borderColor: isToday ? '#93c5fd' : '#e5e7eb',
                touchAction: 'manipulation'
              }
            },
              date && React.createElement('div', null,
                React.createElement('div', {
                  className: "text-sm font-medium mb-2",
                  style: { color: isToday ? '#2563eb' : '#111827' }
                }, date.getDate()),
                
                // Show first 2 releases, then a "+X more" indicator
                releases.slice(0, 2).map(release =>
                  React.createElement('div', {
                    key: release.id,
                    className: "mb-1 p-1 rounded border text-xs cursor-pointer transition-shadow relative",
                    style: {
                      backgroundColor: '#dbeafe',
                      borderColor: '#3b82f6',
                      color: '#1e40af',
                      position: 'relative'
                    },
                    onMouseEnter: (e) => {
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      
                      // Create tooltip for individual releases (EXACT same code as "+X more")
                      const tooltip = document.createElement('div');
                      tooltip.innerHTML = `<div style="margin-bottom: 4px; font-size: 11px;"><strong>${release.setName}</strong><br><span style="opacity: 0.8;">${release.year} Series</span><br><span style="opacity: 0.7; font-size: 10px;">${release.releaseDate.toLocaleDateString()}</span></div>`;
                      tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 8px;
                        font-size: 11px;
                        white-space: nowrap;
                        z-index: 1000;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        pointer-events: none;
                        max-width: 200px;
                        white-space: normal;
                        line-height: 1.3;
                      `;
                      // Add arrow
                      const arrow = document.createElement('div');
                      arrow.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 5px solid transparent;
                        border-top-color: rgba(0, 0, 0, 0.9);
                      `;
                      tooltip.appendChild(arrow);
                      e.target.appendChild(tooltip);
                      e.target._tooltip = tooltip;
                      
                      // Multiple cleanup handlers for different scroll scenarios + more aggressive cleanup
                      const cleanupTooltip = () => {
                        if (e.target && e.target._tooltip) {
                          try {
                            e.target.removeChild(e.target._tooltip);
                          } catch (err) {
                            // Tooltip already removed
                          }
                          e.target._tooltip = null;
                        }
                      };
                      
                      // Listen for various scroll events
                      const scrollEvents = ['scroll', 'wheel', 'touchmove'];
                      scrollEvents.forEach(eventType => {
                        window.addEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                        document.addEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                      });
                      
                      // Additional mouse tracking for more reliable cleanup
                      const mouseTracker = (event) => {
                        const rect = e.target.getBoundingClientRect();
                        const isOutside = event.clientX < rect.left || 
                                        event.clientX > rect.right || 
                                        event.clientY < rect.top || 
                                        event.clientY > rect.bottom;
                        if (isOutside) {
                          cleanupTooltip();
                          document.removeEventListener('mousemove', mouseTracker);
                        }
                      };
                      document.addEventListener('mousemove', mouseTracker);
                      
                      // Store cleanup function
                      e.target._cleanupTooltip = () => {
                        cleanupTooltip();
                        document.removeEventListener('mousemove', mouseTracker);
                        scrollEvents.forEach(eventType => {
                          window.removeEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                          document.removeEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                        });
                      };
                      
                      // Shorter auto-cleanup for individual releases
                      setTimeout(() => {
                        if (e.target && e.target._cleanupTooltip) {
                          e.target._cleanupTooltip();
                        }
                      }, 2000);
                    },
                    onMouseLeave: (e) => {
                      e.target.style.boxShadow = 'none';
                      if (e.target._cleanupTooltip) {
                        e.target._cleanupTooltip();
                        e.target._cleanupTooltip = null;
                      }
                    }
                  },
                    React.createElement('div', { className: "flex items-center gap-1" },
                      React.createElement('span', { style: { fontSize: '12px' } }, "🏒"),
                      React.createElement('div', { 
                        className: "font-semibold truncate",
                        style: { fontSize: '11px', lineHeight: '1.2', fontWeight: '700' }
                      }, release.setName.length > 15 ? release.setName.substring(0, 15) + '...' : release.setName)
                    )
                  )
                ).concat(
                  releases.length > 2 ? [
                    React.createElement('div', {
                      key: 'more',
                      className: "text-xs text-center p-1 rounded relative",
                      style: {
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        fontSize: '9px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        position: 'relative'
                      },
                      onMouseEnter: (e) => {
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        const additionalReleases = releases.slice(2);
                        tooltip.innerHTML = additionalReleases.map(r => 
                          `<div style="margin-bottom: 4px; font-size: 11px;"><strong>${r.setName}</strong><br><span style="opacity: 0.8;">${r.year}</span></div>`
                        ).join('');
                        tooltip.style.cssText = `
                          position: absolute;
                          bottom: 100%;
                          left: 50%;
                          transform: translateX(-50%);
                          background: rgba(0, 0, 0, 0.9);
                          color: white;
                          padding: 8px 12px;
                          border-radius: 8px;
                          font-size: 11px;
                          white-space: nowrap;
                          z-index: 1000;
                          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                          pointer-events: none;
                          max-width: 200px;
                          white-space: normal;
                          line-height: 1.3;
                        `;
                        // Add arrow
                        const arrow = document.createElement('div');
                        arrow.style.cssText = `
                          position: absolute;
                          top: 100%;
                          left: 50%;
                          transform: translateX(-50%);
                          border: 5px solid transparent;
                          border-top-color: rgba(0, 0, 0, 0.9);
                        `;
                        tooltip.appendChild(arrow);
                        e.target.appendChild(tooltip);
                        e.target._tooltip = tooltip;
                        
                        // Multiple cleanup handlers for different scroll scenarios
                        const cleanupTooltip = () => {
                          if (e.target && e.target._tooltip) {
                            try {
                              e.target.removeChild(e.target._tooltip);
                            } catch (err) {
                              // Tooltip already removed
                            }
                            e.target._tooltip = null;
                          }
                        };
                        
                        // Listen for various scroll events
                        const scrollEvents = ['scroll', 'wheel', 'touchmove'];
                        scrollEvents.forEach(eventType => {
                          window.addEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                          document.addEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                        });
                        
                        // Store cleanup function
                        e.target._cleanupTooltip = () => {
                          cleanupTooltip();
                          scrollEvents.forEach(eventType => {
                            window.removeEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                            document.removeEventListener(eventType, cleanupTooltip, { passive: true, capture: true });
                          });
                        };
                        
                        // Auto-cleanup after 3 seconds as backup
                        setTimeout(() => {
                          if (e.target && e.target._cleanupTooltip) {
                            e.target._cleanupTooltip();
                          }
                        }, 3000);
                      },
                      onMouseLeave: (e) => {
                        if (e.target._cleanupTooltip) {
                          e.target._cleanupTooltip();
                          e.target._cleanupTooltip = null;
                        }
                      },
                      onMouseOut: (e) => {
                        // Additional cleanup for mouse out events
                        if (e.target._cleanupTooltip) {
                          e.target._cleanupTooltip();
                          e.target._cleanupTooltip = null;
                        }
                      }
                    }, `+${releases.length - 2} more`)
                  ] : []
                )
              )
            );
          })
        )
      ),

      // Upcoming Releases Dropdown
      React.createElement('div', { 
        className: "rounded-lg",
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      },
        // Dropdown Header (always visible)
        React.createElement('div', {
          className: "p-4 cursor-pointer flex items-center justify-between",
          onClick: () => setIsDropdownOpen(!isDropdownOpen),
          style: {
            borderBottom: isDropdownOpen ? '1px solid #e5e7eb' : 'none',
            borderRadius: isDropdownOpen ? '20px 20px 0 0' : '20px',
            transition: 'all 0.3s ease'
          }
        },
          React.createElement('h3', { 
            className: "text-xl font-bold flex items-center gap-2",
            style: { color: '#4a90a4', margin: 0 }
          },
            React.createElement('span', { className: "text-2xl" }, "🏒"),
            "Upcoming Hockey Releases This Month",
            React.createElement('span', {
              className: "text-sm font-normal ml-2 px-2 py-1 rounded",
              style: {
                backgroundColor: 'rgba(74, 144, 164, 0.1)',
                color: '#4a90a4'
              }
            }, (() => {
              const monthReleases = cardReleases.filter(release => 
                release.releaseDate &&
                release.releaseDate.getMonth() === currentDate.getMonth() &&
                release.releaseDate.getFullYear() === currentDate.getFullYear()
              );
              return `${monthReleases.length} total`;
            })())
          ),
          React.createElement('div', {
            className: "text-2xl",
            style: {
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              color: '#4a90a4'
            }
          }, '▼')
        ),
        
        // Dropdown Content (collapsible)
        isDropdownOpen && React.createElement('div', {
          className: "p-6",
          style: {
            borderRadius: '0 0 20px 20px'
          }
        },
          React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
            (() => {
              const monthReleases = cardReleases
                .filter(release => 
                  release.releaseDate &&
                  release.releaseDate.getMonth() === currentDate.getMonth() &&
                  release.releaseDate.getFullYear() === currentDate.getFullYear()
                )
                .sort((a, b) => a.releaseDate - b.releaseDate);
              
              const totalPages = Math.ceil(monthReleases.length / releasesPerPage);
              const startIndex = currentPage * releasesPerPage;
              const paginatedReleases = monthReleases.slice(startIndex, startIndex + releasesPerPage);
              
              return paginatedReleases.map(release =>
                React.createElement('div', {
                  key: release.id,
                  className: "border rounded-lg p-4 transition-shadow",
                  style: {
                    borderColor: '#e5e7eb',
                    backgroundColor: 'white'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.target.style.borderColor = '#4a90a4';
                  },
                  onMouseLeave: (e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                },
                  React.createElement('div', { className: "flex items-start gap-3" },
                    React.createElement('div', { className: "text-3xl" }, "🏒"),
                    React.createElement('div', { className: "flex-1" },
                      React.createElement('h4', { 
                        className: "font-semibold mb-1",
                        style: { color: '#111827' }
                      }, release.setName),
                      React.createElement('p', { 
                        className: "text-sm mb-2",
                        style: { color: '#6b7280' }
                      }, `${release.year} Series`),
                      React.createElement('div', { 
                        className: "flex items-center gap-2 mb-2" 
                      },
                        React.createElement('span', {
                          className: "px-2 py-1 text-xs font-medium rounded",
                          style: {
                            backgroundColor: '#dbeafe',
                            color: '#1e40af'
                          }
                        }, 'Release'),
                        React.createElement(Package, { 
                          className: "w-3 h-3",
                          style: { color: '#4a90a4' }
                        })
                      ),
                      React.createElement('div', { 
                        className: "flex items-center justify-between" 
                      },
                        React.createElement('span', { 
                          className: "text-sm",
                          style: { color: '#6b7280' }
                        }, release.releaseDate.toLocaleDateString())
                      )
                    )
                  )
                )
              );
            })()
          ),
          
          // Pagination for upcoming releases (only show when dropdown is open)
          (() => {
            const monthReleases = cardReleases
              .filter(release => 
                release.releaseDate &&
                release.releaseDate.getMonth() === currentDate.getMonth() &&
                release.releaseDate.getFullYear() === currentDate.getFullYear()
              );
            
            const totalPages = Math.ceil(monthReleases.length / releasesPerPage);
            
            if (totalPages <= 1) return null;
            
            return React.createElement('div', {
              className: "flex justify-center items-center gap-3 mt-6",
              style: { paddingTop: '20px', borderTop: '1px solid #e5e7eb' }
            },
              React.createElement('button', {
                onClick: () => setCurrentPage(Math.max(0, currentPage - 1)),
                disabled: currentPage === 0,
                className: "px-4 py-2 rounded-lg transition-colors",
                style: {
                  background: currentPage === 0 ? '#f3f4f6' : 'rgba(74, 144, 164, 0.1)',
                  color: currentPage === 0 ? '#9ca3af' : '#4a90a4',
                  border: `1px solid ${currentPage === 0 ? '#e5e7eb' : '#4a90a4'}`,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                }
              }, '← Previous'),
              
              React.createElement('span', {
                className: "text-sm font-medium",
                style: { color: '#4a90a4' }
              }, `Page ${currentPage + 1} of ${totalPages} (${monthReleases.length} total releases)`),
              
              React.createElement('button', {
                onClick: () => setCurrentPage(Math.min(totalPages - 1, currentPage + 1)),
                disabled: currentPage === totalPages - 1,
                className: "px-4 py-2 rounded-lg transition-colors",
                style: {
                  background: currentPage === totalPages - 1 ? '#f3f4f6' : 'rgba(74, 144, 164, 0.1)',
                  color: currentPage === totalPages - 1 ? '#9ca3af' : '#4a90a4',
                  border: `1px solid ${currentPage === totalPages - 1 ? '#e5e7eb' : '#4a90a4'}`,
                  cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
                }
              }, 'Next →')
            );
          })()
        )
      )
    )
  );
};

export default HockeyCardCalendar;
