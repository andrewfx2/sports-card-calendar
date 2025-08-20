import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Star, TrendingUp } from 'lucide-react';

const SportsCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const cardReleases = [
    {
      id: 1,
      date: new Date(2025, 7, 22),
      title: "2025 Panini Prizm Football",
      brand: "Panini",
      sport: "Football",
      type: "Hobby Box",
      price: "$299.99",
      image: "🏈",
      rarity: "high",
      popularity: 95
    },
    {
      id: 2,
      date: new Date(2025, 7, 25),
      title: "2025 Topps Chrome Baseball",
      brand: "Topps",
      sport: "Baseball", 
      type: "Blaster Box",
      price: "$24.99",
      image: "⚾",
      rarity: "medium",
      popularity: 88
    },
    {
      id: 3,
      date: new Date(2025, 7, 28),
      title: "2025-26 Panini Select Basketball",
      brand: "Panini",
      sport: "Basketball",
      type: "Hobby Box",
      price: "$449.99",
      image: "🏀",
      rarity: "high",
      popularity: 92
    },
    {
      id: 4,
      date: new Date(2025, 8, 5),
      title: "2025 Upper Deck Series 1 Hockey",
      brand: "Upper Deck",
      sport: "Hockey",
      type: "Hobby Box",
      price: "$129.99",
      image: "🏒",
      rarity: "medium",
      popularity: 75
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
      release.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSportColor = (sport) => {
    switch (sport) {
      case 'Football': return 'bg-orange-500';
      case 'Basketball': return 'bg-purple-500';
      case 'Baseball': return 'bg-blue-500';
      case 'Hockey': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);

  return React.createElement('div', { className: "max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen" },
    React.createElement('div', { className: "mb-8" },
      React.createElement('h1', { className: "text-4xl font-bold text-gray-900 mb-2" }, "Sports Card Release Calendar"),
      React.createElement('p', { className: "text-gray-600" }, "Track upcoming trading card releases and plan your purchases")
    ),
    
    React.createElement('div', { className: "flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm" },
      React.createElement('div', { className: "flex items-center gap-4" },
        React.createElement('button', {
          onClick: () => navigateMonth(-1),
          className: "p-2 hover:bg-gray-100 rounded-lg transition-colors"
        }, React.createElement(ChevronLeft, { className: "w-5 h-5" })),
        React.createElement('h2', { className: "text-2xl font-bold text-gray-900" },
          monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear()
        ),
        React.createElement('button', {
          onClick: () => navigateMonth(1),
          className: "p-2 hover:bg-gray-100 rounded-lg transition-colors"
        }, React.createElement(ChevronRight, { className: "w-5 h-5" }))
      ),
      React.createElement('div', { className: "flex gap-2" },
        React.createElement('button', {
          onClick: () => setCurrentDate(new Date()),
          className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        },
          React.createElement(Calendar, { className: "w-4 h-4" }),
          "Today"
        )
      )
    ),

    React.createElement('div', { className: "bg-white rounded-lg shadow-sm overflow-hidden mb-8" },
      React.createElement('div', { className: "grid grid-cols-7 bg-gray-50 border-b" },
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day =>
          React.createElement('div', { key: day, className: "p-4 text-center font-semibold text-gray-700" }, day)
        )
      ),
      React.createElement('div', { className: "grid grid-cols-7" },
        days.map((date, index) => {
          const releases = getReleasesForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return React.createElement('div', {
            key: index,
            className: `min-h-32 border-r border-b border-gray-200 p-2 ${
              date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
            } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`
          },
            date && React.createElement('div', null,
              React.createElement('div', {
                className: `text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`
              }, date.getDate()),
              
              releases.map(release =>
                React.createElement('div', {
                  key: release.id,
                  className: `mb-2 p-2 rounded-md border text-xs ${getRarityColor(release.rarity)} cursor-pointer hover:shadow-md transition-shadow`
                },
                  React.createElement('div', { className: "flex items-center gap-1 mb-1" },
                    React.createElement('span', { className: "text-lg" }, release.image),
                    React.createElement('div', { className: `w-2 h-2 rounded-full ${getSportColor(release.sport)}` })
                  ),
                  React.createElement('div', { className: "font-semibold truncate" }, release.title),
                  React.createElement('div', { className: "text-gray-600" }, release.price),
                  React.createElement('div', { className: "flex items-center gap-1 mt-1" },
                    React.createElement(TrendingUp, { className: "w-3 h-3" }),
                    React.createElement('span', { className: "text-xs" }, release.popularity + "% popular")
                  )
                )
              )
            )
          );
        })
      )
    ),

    React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6" },
      React.createElement('h3', { className: "text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" },
        React.createElement(Star, { className: "w-5 h-5 text-yellow-500" }),
        "Upcoming Releases This Month"
      ),
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
        cardReleases
          .filter(release => 
            release.date.getMonth() === currentDate.getMonth() &&
            release.date.getFullYear() === currentDate.getFullYear()
          )
          .sort((a, b) => a.date - b.date)
          .map(release =>
            React.createElement('div', {
              key: release.id,
              className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            },
              React.createElement('div', { className: "flex items-start gap-3" },
                React.createElement('div', { className: "text-3xl" }, release.image),
                React.createElement('div', { className: "flex-1" },
                  React.createElement('h4', { className: "font-semibold text-gray-900 mb-1" }, release.title),
                  React.createElement('p', { className: "text-sm text-gray-600 mb-2" }, release.brand + " • " + release.type),
                  React.createElement('div', { className: "flex items-center gap-2 mb-2" },
                    React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded ${getRarityColor(release.rarity)}` },
                      release.rarity + " rarity"
                    ),
                    React.createElement('div', { className: `w-3 h-3 rounded-full ${getSportColor(release.sport)}`, title: release.sport })
                  ),
                  React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('span', { className: "font-bold text-green-600" }, release.price),
                    React.createElement('span', { className: "text-sm text-gray-500" }, release.date.toLocaleDateString())
                  ),
                  React.createElement('div', { className: "mt-2 bg-gray-200 rounded-full h-2" },
                    React.createElement('div', {
                      className: "bg-blue-500 h-2 rounded-full",
                      style: { width: release.popularity + "%" },
                      title: release.popularity + "% popularity"
                    })
                  )
                )
              )
            )
          )
      )
    )
  );
};

export default SportsCardCalendar;
