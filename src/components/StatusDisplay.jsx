// src/components/StatusDisplay.jsx
import React from 'react';

const StatusDisplay = ({ emotion, status }) => {
  const emotionEmojiMap = {
    happy: '😄', sad: '😢', angry: '😠',
    neutral: '😐', surprise: '😮', fear: '😨',
    unknown: '🤔'
  };

  const statusColorMap = {
    Connected: 'bg-green-500',
    Connecting: 'bg-yellow-500',
    Disconnected: 'bg-red-500',
  };

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center border border-gray-600">
      <div>
        <p className="text-sm text-gray-400">CURRENT MOOD</p>
        <p className="text-3xl font-bold capitalize text-cyan-400">
          {emotion} {emotionEmojiMap[emotion] || '🤔'}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${statusColorMap[status]}`}></div>
        <p className="text-sm text-gray-300">{status}</p>
      </div>
    </div>
  );
};

export default StatusDisplay;