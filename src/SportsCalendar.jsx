import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw, Package } from 'lucide-react';

const HockeyCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardReleases, setCardReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setCurrentPage(0); // Reset pagination when changing months
  };

  // Group releases by date for the current month
  const getGroupedReleases = () => {
    const monthReleases = cardReleases.filter(release => 
      release.releaseDate &&
      release.releaseDate.getMonth() === currentDate.getMonth() &&
      release.releaseDate.getFullYear() === currentDate.getFullYear()
    );

    const grouped = monthReleases.reduce((groups, release) => {
      const dateKey = release.releaseDate.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(release);
      return groups;
    }, {});

    // Sort dates chronologically
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    
    return sortedDates.map(dateKey => ({
      dateKey,
      date: new Date(dateKey),
      releases: grouped[dateKey].sort((a, b) => a.setName.localeCompare(b.setName))
    }));
  };

  const groupedReleases = getGroupedReleases();

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
        background: 'linear-gradient(135deg, #4a90a4 0%, #83cdea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        borderRadius: '24px',
        margin: '20px auto',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        width: 'fit-content',
        minWidth: '600px'
      }
    },
      // Add gradient animation CSS
      React.createElement('style', {}, `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `),
      
      // Controls Bar
      React.createElement('div', { 
        className: "flex items-center justify-between mb-4 p-3 rounded-lg",
        style: {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '16px',
          gap: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          flexWrap: 'nowrap'
        }
      },
        // Left side: Navigation + Title
        React.createElement('div', { 
          className: "flex items-center gap-3",
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
              flexShrink: 0
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
          }, React.createElement(ChevronRight, { className: "w-5 h-5" })),
          
          // Title beside navigation
          React.createElement('h1', { 
            className: "text-sm font-semibold",
            style: { 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              marginLeft: '12px',
              whiteSpace: 'nowrap'
            }
          }, "Release Calendar")
        ),
        
        // Right side: Action buttons
        React.createElement('div', { 
          className: "flex gap-2",
          style: { flexShrink: 0 }
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

      // Release List
      React.createElement('div', { 
        className: "rounded-lg overflow-hidden mb-4",
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      },
        groupedReleases.length === 0 ? 
          React.createElement('div', {
            style: { 
              padding: '60px 40px', 
              textAlign: 'center', 
              color: '#6b7280' 
            }
          }, 
            React.createElement('div', { style: { fontSize: '48px', marginBottom: '16px' } }, "🏒"),
            React.createElement('h3', { style: { fontSize: '18px', margin: '0 0 8px 0', color: '#374151' } }, "No releases scheduled"),
            React.createElement('p', { style: { margin: 0, fontSize: '14px' } }, `No hockey card releases found for ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`)
          ) :
          
          groupedReleases.map((group, groupIndex) => {
            const isToday = group.date.toDateString() === new Date().toDateString();
            
            return React.createElement('div', {
              key: group.dateKey,
              style: {
                borderBottom: groupIndex < groupedReleases.length - 1 ? '1px solid #f1f5f9' : 'none'
              }
            },
              // Date Header
              React.createElement('div', {
                style: {
                  padding: '20px 24px 12px',
                  background: isToday ? '#dbeafe' : '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }
              },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
                },
                  React.createElement('h3', {
                    style: {
                      margin: 0,
                      color: isToday ? '#1e40af' : '#334155',
                      fontSize: '20px',
                      fontWeight: '600'
                    }
                  }, group.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })),
                  React.createElement('span', {
                    style: {
                      fontSize: '14px',
                      color: '#64748b',
                      background: 'rgba(100, 116, 139, 0.1)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }
                  }, `${group.releases.length} release${group.releases.length > 1 ? 's' : ''}`)
                )
              ),
              
              // Releases for this date
              React.createElement('div', { style: { background: 'white' } },
                group.releases.map((release, releaseIndex) =>
                  React.createElement('div', {
                    key: release.id,
                    style: {
                      padding: '20px 24px',
                      borderBottom: releaseIndex < group.releases.length - 1 ? '1px solid #f8fafc' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    },
                    onMouseEnter: (e) => { 
                      e.target.style.background = '#f8fafc';
                      e.target.style.transform = 'translateX(4px)';
                    },
                    onMouseLeave: (e) => { 
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateX(0)';
                    }
                  },
                    React.createElement('div', { style: { fontSize: '32px', flexShrink: 0 } }, "🏒"),
                    React.createElement('div', { style: { flex: 1 } },
                      React.createElement('h4', {
                        style: { 
                          margin: '0 0 6px 0', 
                          fontSize: '22px', 
                          fontWeight: '700', 
                          color: '#111827',
                          lineHeight: '1.3'
                        }
                      }, release.setName),
                      React.createElement('p', {
                        style: { 
                          margin: '0 0 8px 0', 
                          fontSize: '18px', 
                          color: '#4b5563',
                          fontWeight: '600'
                        }
                      }, `${release.year} Series`)
                    ),
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
                      React.createElement('div', {
                        style: {
                          padding: '8px 16px',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '20px',
                          fontSize: '18px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }
                      },
                        React.createElement(Package, { 
                          style: { width: '16px', height: '16px' }
                        }),
                        'Release'
                      )
                    )
                  )
                )
              )
            );
          })
      )
    )
  );
};

export default HockeyCardCalendar;
