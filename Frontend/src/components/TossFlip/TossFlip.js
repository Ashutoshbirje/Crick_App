import React from 'react';
import './TossFlip.css'; // ✅ Import the external CSS file

const TossFlip = () => {
  const tossResult = Math.random() < 0.5 ? 'H e a d' : 'T a i l';
  const tossImage = tossResult === 'H e a d' ? '/images/Photo6.jpg' : '/images/Photo5.jpg';

  return (
    <div className="container9">
      <div className="content">
        <img src={tossImage} alt={tossResult} className="image" />
        <h1 className="text">{tossResult}</h1>
      </div>
    </div>
  );
};

export default TossFlip;
