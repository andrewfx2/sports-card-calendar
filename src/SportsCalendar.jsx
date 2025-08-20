import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw, Clock, Package } from 'lucide-react';

const HockeyCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardReleases, setCardReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

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
      if (values.length >= 4) {
        const releaseDate = new Date(values[2]);
        const preOrderDate = new Date(values[3]);
        
        if (!isNaN(releaseDate.getTime())) {
          data.push({
            id: i,
            setName: values[0],
            year: values[1],
            releaseDate: releaseDate,
            preOrderDate: !isNaN(preOrderDate.getTime()) ? preOrderDate : null,
            type: 'release'
          });
        }

        // Add pre-order date as separate entry if it exists
        if (!isNaN(preOrderDate.getTime())) {
          data.push({
            id: `${i}-preorder`,
            setName: values[0],
            year: values[1],
            releaseDate: releaseDate,
            preOrderDate: preOrderDate,
            type: 'preorder'
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
    
    return cardReleases.filter(release => {
      const compareDate = release.type === 'preorder' ? release.preOrderDate : release.releaseDate;
      return compareDate && compareDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return React.createElement('div', { 
    className: "min-h-screen", 
    style: { 
      background: 'linear-gradient(135deg, #4a90a4 0%, #83cdea 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  },
    React.createElement('div', { 
      className: "max-w-6xl mx-auto p-6",
      style: { minHeight: '100vh' }
    },
      
      // Header
      React.createElement('div', { 
        className: "mb-8 p-6 rounded-lg",
        style: {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }
      },
        React.createElement('h1', { 
          className: "text-4xl font-bold mb-2",
          style: { 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }
        }, "🏒 Hockey Card Release Calendar"),
        React.createElement('p', { 
          style: { 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            margin: 0
          }
        }, "Track upcoming hockey card releases and pre-orders")
      ),

      // Controls Bar
      React.createElement('div', { 
        className: "flex items-center justify-between mb-6 p-4 rounded-lg",
        style: {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          flexWrap: 'wrap',
          gap: '15px'
        }
      },
        // Navigation
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('button', {
            onClick: () => navigateMonth(-1),
            className: "p-2 rounded-lg transition-colors",
            style: {
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer'
            }
          }, React.createElement(ChevronLeft, { className: "w-5 h-5" })),
          
          React.createElement('h2', { 
            className: "text-2xl font-bold",
            style: { color: 'white' }
          }, monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear()),
          
          React.createElement('button', {
            onClick: () => navigateMonth(1),
            className: "p-2 rounded-lg transition-colors",
            style: {
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer'
            }
          }, React.createElement(ChevronRight, { className: "w-5 h-5" }))
        ),
        
        // Action buttons
        React.createElement('div', { className: "flex gap-2" },
          React.createElement('button', {
            onClick: () => setCurrentDate(new Date()),
            className: "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
            style: {
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer'
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
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
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
        className: "mb-6 p-3 rounded-lg text-center",
        style: {
          background: 'rgba(76, 175, 80, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '14px'
        }
      }, `✅ Last updated: ${lastUpdated.toLocaleString()}`),

      error && React.createElement('div', {
        className: "mb-6 p-3 rounded-lg text-center",
        style: {
          background: 'rgba(244, 67, 54, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '14px'
        }
      }, `❌ Error: ${error}`),

      // Calendar Grid
      React.createElement('div', { 
        className: "rounded-lg overflow-hidden mb-8",
        style: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      },
        // Days of week header
        React.createElement('div', { 
          className: "grid grid-cols-7",
          style: {
            background: 'rgba(74, 144, 164, 0.1)',
            borderBottom: '1px solid #e5e7eb'
          }
        },
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day =>
            React.createElement('div', { 
              key: day, 
              className: "p-4 text-center font-semibold",
              style: { color: '#4a90a4' }
            }, day)
          )
        ),

        // Calendar days
        React.createElement('div', { className: "grid grid-cols-7" },
          days.map((date, index) => {
            const releases = getReleasesForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            
            return React.createElement('div', {
              key: index,
              className: "min-h-32 border-r border-b border-gray-200 p-2",
              style: {
                backgroundColor: date ? (isToday ? '#eff6ff' : 'white') : '#f9fafb',
                borderColor: isToday ? '#93c5fd' : '#e5e7eb'
              }
            },
              date && React.createElement('div', null,
                React.createElement('div', {
                  className: "text-sm font-medium mb-2",
                  style: { color: isToday ? '#2563eb' : '#111827' }
                }, date.getDate()),
                
                releases.map(release =>
                  React.createElement('div', {
                    key: release.id,
                    className: "mb-2 p-2 rounded-md border text-xs cursor-pointer transition-shadow",
                    style: {
                      backgroundColor: release.type === 'preorder' ? '#fef3c7' : '#dbeafe',
                      borderColor: release.type === 'preorder' ? '#f59e0b' : '#3b82f6',
                      color: release.type === 'preorder' ? '#92400e' : '#1e40af'
                    },
                    onMouseEnter: (e) => {
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    },
                    onMouseLeave: (e) => {
                      e.target.style.boxShadow = 'none';
                    }
                  },
                    React.createElement('div', { className: "flex items-center gap-1 mb-1" },
                      React.createElement('span', { className: "text-lg" }, "🏒"),
                      React.createElement(release.type === 'preorder' ? Clock : Package, { 
                        className: "w-3 h-3" 
                      })
                    ),
                    React.createElement('div', { 
                      className: "font-semibold truncate",
                      style: { fontSize: '11px' }
                    }, release.setName),
                    React.createElement('div', { 
                      style: { opacity: 0.8, fontSize: '10px' }
                    }, release.year),
                    React.createElement('div', { 
                      style: { fontSize: '10px', marginTop: '2px' }
                    }, release.type === 'preorder' ? 'Pre-Order' : 'Release')
                  )
                )
              )
            );
          })
        )
      ),

      // Upcoming Releases List
      React.createElement('div', { 
        className: "rounded-lg p-6",
        style: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      },
        React.createElement('h3', { 
          className: "text-xl font-bold mb-4 flex items-center gap-2",
          style: { color: '#4a90a4' }
        },
          React.createElement('span', { className: "text-2xl" }, "🏒"),
          "Upcoming Hockey Releases This Month"
        ),
        
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
          cardReleases
            .filter(release => {
              const compareDate = release.type === 'preorder' ? release.preOrderDate : release.releaseDate;
              return compareDate &&
                compareDate.getMonth() === currentDate.getMonth() &&
                compareDate.getFullYear() === currentDate.getFullYear();
            })
            .sort((a, b) => {
              const dateA = a.type === 'preorder' ? a.preOrderDate : a.releaseDate;
              const dateB = b.type === 'preorder' ? b.preOrderDate : b.releaseDate;
              return dateA - dateB;
            })
            .map(release =>
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
                          backgroundColor: release.type === 'preorder' ? '#fef3c7' : '#dbeafe',
                          color: release.type === 'preorder' ? '#92400e' : '#1e40af'
                        }
                      }, release.type === 'preorder' ? 'Pre-Order' : 'Release'),
                      React.createElement(release.type === 'preorder' ? Clock : Package, { 
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
                      }, (release.type === 'preorder' ? release.preOrderDate : release.releaseDate).toLocaleDateString())
                    )
                  )
                )
              )
            )
        )
      )
    )
  );
};

export default HockeyCardCalendar;
