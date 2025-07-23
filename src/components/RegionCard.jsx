import React from 'react';
import '../App.css';

const RegionCard = ({ region, onRegionClick, isSelected }) => {
  return (
    <div
      className={`card region-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onRegionClick(region)}
      style={{
        backgroundColor: region.bgColor,
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        width: '160px',
        height: '100px',
        boxSizing: 'border-box',
        boxShadow: isSelected ? `0 4px 10px ${region.bgColor}aa` : '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      <h2 style={{
          margin: '0',
          textAlign: 'center',
          color: '#000000',
          fontSize: '1.1rem',
          wordBreak: 'break-word'
        }}>
        {region.name}
      </h2>
    </div>
  );
};

export default RegionCard;
