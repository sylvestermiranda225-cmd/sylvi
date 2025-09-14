import React from 'react';

const AuthInput = ({ id, type, placeholder, value, onChange, icon }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-800/50 border border-gray-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block pl-12 p-3.5 transition-all duration-300"
        required
      />
    </div>
  );
};

export default AuthInput;
