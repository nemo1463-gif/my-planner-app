
import React from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';
import Spinner from './Spinner';

const TodoList: React.FC = () => {
  const { todos, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }
  
  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">나의 할 일</h2>
      {todos.length === 0 ? (
        <p className="text-slate-500 text-center py-4">
            모든 할 일을 마쳤어요! ✨
        </p>
      ) : (
        <ul className="space-y-1">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;