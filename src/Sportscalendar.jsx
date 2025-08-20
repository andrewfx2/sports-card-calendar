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
