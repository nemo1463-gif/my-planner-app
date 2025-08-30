import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
        <span role="img" aria-label="memo" className="mr-2">📝</span>
        My Planner
      </h1>
      <p className="text-slate-500 mt-1">일정관리 도우미</p>
    </header>
  );
};

export default Header;