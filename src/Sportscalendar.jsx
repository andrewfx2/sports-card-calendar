import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Star, TrendingUp } from 'lucide-react';

const SportsCardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('month'); // 'month' or 'week'

  // Sample sports card release data
  const cardReleases = [
    {
      id: 1,
      date: new Date(2025, 7, 22), // August 22, 2025
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
      date: new Date(2025, 7, 25), // August 25, 2025
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
      date: new Date(2025, 7, 28), // August 28, 2025
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
      date: new Date(2025, 8, 5), // September 5, 2025
      title: "2025 Upper Deck Series 1 Hockey",
      brand: "Upper Deck",
      sport: "Hockey",
      type: "Hobby Box",
      price: "$129.99",
      image: "🏒",
      rarity: "medium",
      popularity: 75
    },
    {
      id: 5,
      date: new Date(2025, 8, 12), // September 12, 2025
      title: "2025 Topps Stadium Club Baseball",
      brand: "Topps",
      sport: "Baseball",
      type: "Hobby Box",
      price: "$89.99",
      image: "⚾",
      rarity: "low",
      popularity: 82
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sports Card Release Calendar
        </h1>
        <p className="text-gray-600">Track upcoming trading card releases and plan your purchases</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const releases = getReleasesForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-32 border-r border-b border-gray-200 p-2 ${
                  date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {releases.map(release => (
                      <div
                        key={release.id}
                        className={`mb-2 p-2 rounded-md border text-xs ${getRarityColor(release.rarity)} cursor-pointer hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg">{release.image}</span>
                          <div className={`w-2 h-2 rounded-full ${getSportColor(release.sport)}`}></div>
                        </div>
                        <div className="font-semibold truncate">{release.title}</div>
                        <div className="text-gray-600">{release.price}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs">{release.popularity}% popular</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Releases List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Upcoming Releases This Month
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardReleases
            .filter(release => 
              release.date.getMonth() === currentDate.getMonth() &&
              release.date.getFullYear() === currentDate.getFullYear()
            )
            .sort((a, b) => a.date - b.date)
            .map(release => (
              <div
                key={release.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{release.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{release.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{release.brand} • {release.type}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRarityColor(release.rarity)}`}>
                        {release.rarity} rarity
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getSportColor(release.sport)}`} title={release.sport}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">{release.price}</span>
                      <span className="text-sm text-gray-500">
                        {release.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{width: `${release.popularity}%`}}
                        title={`${release.popularity}% popularity`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Football</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Basketball</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Baseball</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Hockey</span>
          </div>
        </div>
        <div className="flex gap-6 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>High Rarity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Medium Rarity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Low Rarity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsCardCalendar;
