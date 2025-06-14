import React, { useState } from 'react';
import './MainSeperator.css';

const MainSeperator = () => {
  const [activeTab, setActiveTab] = useState('Day');

  return (
    <div className="main-seperator">
      <h2>Trending 🔥~</h2>
      <div className="toggle-switch">
        <button
          className={`toggle-btn ${activeTab === 'Day' ? 'active' : ''}`}
          onClick={() => setActiveTab('Day')}
        >
          Day
        </button>
        <button
          className={`toggle-btn ${activeTab === 'Week' ? 'active' : ''}`}
          onClick={() => setActiveTab('Week')}
        >
          Week
        </button>
      </div>
    </div>
  );
};

export default MainSeperator;