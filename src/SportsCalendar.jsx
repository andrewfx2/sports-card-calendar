import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw, Package } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://lwuwdvnyclgaogkqemxt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dXdkdm55Y2xnYW9na3FlbXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjY3MDQsImV4cCI6MjA3MTQwMjcwNH0.n4aCBlmHiI0g51xwUQMVB6h4YmAKesZ1ZFL2ZX3755U';
const supabase = createClient(supabaseUrl, supabaseKey);

const HockeyCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardReleases, setCardReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedDates, setExpandedDates] = useState(new Set());
  const releasesPerPage = 3;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchSheetData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('Hockey Releases')
        .select('*')
        .order('Release Date', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match your existing component structure
      const transformedData = data.map((item, index) => ({
        id: item.id || index,
        setName: item['Set Name'],
        year: item['Year'],
        releaseDate: new Date(item['Release Date'])
      }));
      
      setCardReleases(transformedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Supabase data:', err);
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
      margin: 0,
      padding: 0
    }
  },
    React.createElement('div', { 
      className: "sports-calendar-container",
      style: { 
        background: 'linear-gradient(135deg, #000000 0%, #00ff41 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        borderRadius: '24px',
        margin: '0 auto',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        width: 'fit-content',
        minWidth: '600px',
        maxWidth: '100%',
        padding: '16px'
      }
    },
      // Add gradient animation CSS + responsive styles
      React.createElement('style', {}, `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @media (max-width: 768px) {
          .sports-calendar-container {
            width: 100% !important;
            min-width: unset !important;
            max-width: 100% !important;
          }
          .sports-calendar-title {
            font-size: 18px !important;
          }
          .mobile-title {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-title {
            display: none !important;
          }
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
          flexWrap: 'wrap'
        }
      },
        // Left side: Navigation + Title
        React.createElement('div', { 
          className: "flex items-center gap-3",
          style: { flexShrink: 1, minWidth: 0, flexWrap: 'wrap' }
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
            className: "text-2xl font-bold sports-calendar-title",
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
            className: "text-sm font-semibold mobile-title",
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

      // Disclaimer message
      React.createElement('div', {
        className: "mb-4 p-3 rounded-lg text-center",
        style: {
          background: 'rgba(255, 193, 7, 0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      }, "⚠️ Release dates are subject to change by Upper Deck and may not be final"),

      // Release List
      React.createElement('div', { 
        className: "rounded-lg overflow-hidden",
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          marginBottom: 0
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
              // Date Header (clickable)
              React.createElement('div', {
                style: {
                  padding: '20px 24px 12px',
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
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
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
                  ),
                  React.createElement('div', {
                    style: {
                      fontSize: '20px',
                      color: '#64748b',
                      transform: expandedDates.has(group.dateKey) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }
                  }, '▼')
                )
              ),
              
              // Releases for this date (collapsible)
              React.createElement('div', { 
                style: { 
                  background: 'white',
                  maxHeight: expandedDates.has(group.dateKey) ? '2000px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease'
                } 
              },
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
