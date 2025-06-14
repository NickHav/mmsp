import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <body>
      <header className="navbar">
        <button className="menu-toggle" onClick="toggleMenu()">☰</button>
        <nav>
          <ul>
            <li><a href="#">Movies</a></li>
            <li><a href="#">Shows</a></li>
            <li><a href="#">Streaming</a></li>
            <li><a href="#">Discover</a></li>
          </ul>
        </nav>
      </header>
    </body>

  );
}

export default Navbar;