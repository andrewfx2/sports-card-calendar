import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw, Package } from 'lucide-react';

const HockeyCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardReleases, setCardReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDates, setExpandedDates] = useState(new Set());

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
    setExpandedDates(new Set()); // Collapse all dates when changing months
  };

  const toggleDate = (dateKey) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDates(newExpanded);
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
    style: { 
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
      width: '100%'
    }
  },
    React.createElement('div', { 
      style: { 
        background: 'linear-gradient(135deg, #4a90a4 0%, #83cdea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        borderRadius: '16px',
        margin: '0 auto',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '500px',
        padding: '12px'
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
      
      // Compact Controls Bar
      React.createElement('div', { 
        style: {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }
      },
        // Navigation + Title
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flex: 1,
            minWidth: 0
          }
        },
          React.createElement('button', {
            onClick: () => navigateMonth(-1),
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }
          }, React.createElement(ChevronLeft, { style: { width: '16px', height: '16px' } })),
          
          React.createElement('h2', { 
            style: { 
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              whiteSpace: 'nowrap'
            }
          }, monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear()),
          
          React.createElement('button', {
            onClick: () => navigateMonth(1),
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }
          }, React.createElement(ChevronRight, { style: { width: '16px', height: '16px' } }))
        ),
        
        // Action buttons
        React.createElement('div', { 
          style: { display: 'flex', gap: '6px' }
        },
          React.createElement('button', {
            onClick: () => setCurrentDate(new Date()),
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          },
            React.createElement(Calendar, { style: { width: '12px', height: '12px' } }),
            "Today"
          ),
          
          React.createElement('button', {
            onClick: fetchSheetData,
            disabled: isLoading,
            style: {
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }
          },
            React.createElement(RefreshCw, { 
              style: { 
                width: '12px', 
                height: '12px',
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }
            })
          )
        )
      ),

      // Compact Status Messages
      lastUpdated && React.createElement('div', {
        style: {
          background: 'rgba(76, 175, 80, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '11px',
          padding: '4px 8px',
          marginBottom: '6px',
          textAlign: 'center'
        }
      }, `✅ Updated: ${lastUpdated.toLocaleTimeString()}`),

      error && React.createElement('div', {
        style: {
          background: 'rgba(244, 67, 54, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '11px',
          padding: '4px 8px',
          marginBottom: '6px',
          textAlign: 'center'
        }
      }, `❌ Error: ${error}`),

      // Compact Disclaimer
      React.createElement('div', {
        style: {
          background: 'rgba(255, 193, 7, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '10px',
          padding: '4px 8px',
          marginBottom: '8px',
          textAlign: 'center'
        }
      }, "⚠️ Dates subject to change"),

      // Compact Release List
      React.createElement('div', { 
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          maxHeight: '300px',
          overflowY: 'auto'
        }
      },
        groupedReleases.length === 0 ? 
          React.createElement('div', {
            style: { 
              padding: '30px 20px', 
              textAlign: 'center', 
              color: '#6b7280' 
            }
          }, 
            React.createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, "🏒"),
            React.createElement('h3', { style: { fontSize: '14px', margin: '0 0 4px 0', color: '#374151' } }, "No releases"),
            React.createElement('p', { style: { margin: 0, fontSize: '12px' } }, `No releases for ${monthNames[currentDate.getMonth()]}`)
          ) :
          
          groupedReleases.map((group, groupIndex) => {
            const isToday = group.date.toDateString() === new Date().toDateString();
            
            return React.createElement('div', {
              key: group.dateKey,
              style: {
                borderBottom: groupIndex < groupedReleases.length - 1 ? '1px solid #f1f5f9' : 'none'
              }
            },
              // Compact Date Header
              React.createElement('div', {
                style: {
                  padding: '12px 16px 8px',
                  background: isToday ? '#dbeafe' : '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  userSelect: 'none'
                },
                onClick: () => toggleDate(group.dateKey),
                onMouseEnter: (e) => {
                  if (!isToday) e.target.style.background = '#f1f5f9';
                },
                onMouseLeave: (e) => {
                  if (!isToday) e.target.style.background = '#f8fafc';
                }
              },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
                },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement('h3', {
                      style: {
                        margin: 0,
                        color: isToday ? '#1e40af' : '#334155',
                        fontSize: '14px',
                        fontWeight: '600'
                      }
                    }, group.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })),
                    React.createElement('span', {
                      style: {
                        fontSize: '11px',
                        color: '#64748b',
                        background: 'rgba(100, 116, 139, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }
                    }, `${group.releases.length}`)
                  ),
                  React.createElement('div', {
                    style: {
                      fontSize: '14px',
                      color: '#64748b',
                      transform: expandedDates.has(group.dateKey) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }
                  }, '▼')
                )
              ),
              
              // Compact Releases
              React.createElement('div', { 
                style: { 
                  background: 'white',
                  maxHeight: expandedDates.has(group.dateKey) ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease'
                } 
              },
                group.releases.map((release, releaseIndex) =>
                  React.createElement('div', {
                    key: release.id,
                    style: {
                      padding: '12px 16px',
                      borderBottom: releaseIndex < group.releases.length - 1 ? '1px solid #f8fafc' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s'
                    },
                    onMouseEnter: (e) => { 
                      e.target.style.background = '#f8fafc';
                    },
                    onMouseLeave: (e) => { 
                      e.target.style.background = 'white';
                    }
                  },
                    React.createElement('div', { style: { fontSize: '20px', flexShrink: 0 } }, "🏒"),
                    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                      React.createElement('h4', {
                        style: { 
                          margin: '0 0 2px 0', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#111827',
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }
                      }, release.setName),
                      React.createElement('p', {
                        style: { 
                          margin: 0, 
                          fontSize: '12px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }
                      }, `${release.year} Series`)
                    ),
                    React.createElement('div', {
                      style: {
                        padding: '4px 8px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                      }
                    },
                      React.createElement(Package, { 
                        style: { width: '10px', height: '10px' }
                      }),
                      'Release'
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
