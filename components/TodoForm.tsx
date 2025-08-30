
import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { PlusIcon } from './icons';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get current time in HH:MM format
const getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const { addTodo } = useTodos();
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;
    setIsAdding(true);
    await addTodo(title, date, time);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="todo-title" className="sr-only">새 할 일</label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="무엇을 해야 하나요?"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="todo-date" className="sr-only">날짜</label>
          <input
            id="todo-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="todo-time" className="sr-only">시간</label>
          <input
            id="todo-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isAdding}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:bg-blue-300"
      >
        {isAdding ? '추가 중...' : <><PlusIcon /> 할 일 추가</>}
      </button>
      <p className="text-xs text-center text-slate-500 pt-1">
        💡 캘린더에 1일, 2시간, 30분 전 알림이 자동 설정됩니다.
      </p>
    </form>
  );
};

export default TodoForm;
