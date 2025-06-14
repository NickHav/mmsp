import React from 'react';
import './HeroSection.css';

function HeroSection() {
    return (
        <div class="hero-wrapper">
        <div className="hero-section">
            <div className="movie-info">
                <h1>The Accountant<sup>2</sup></h1>
                <p>When an old acquaintance is murdered, Wolff is compelled to solve the case. Realizing more extreme measures are necessary, Wolff recruits his estranged and highly lethal brother, Brax, to help. In partnership with Marybeth Medina, they...</p>
                <div className="tags">
                    <span>Crime</span>
                    <span>Thriller</span>
                    <span>Apr 23, 2025</span>
                    <span>1080p</span>
                </div>
                <div className="actions">
                    <button className="watch-now">Watch Now</button>
                    <button className="bookmark">Bookmark</button>
                    <span className="rating">7.2</span>
                </div>
            </div>
            <div className='slide-controls'>
                <div className='slide-nav'>
                    <button className='left-button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="slide-left-arrow">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="movie-poster">
                <img src="poster.jpg" alt="The Accountant 2 Poster" />
            </div>
        </div>
        </div>
    );
}

export default HeroSection;