import React from 'react';

const AuroraGrid = () => {
  return (
   
    <div className="absolute inset-0 z-[-1] grid grid-cols-20 h-full w-full">
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={`square-${i}`}
          className="aurora-square"
          style={{ animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 5 + 5}s` }}
        />
      ))}
    </div>
  );
};

export default AuroraGrid;