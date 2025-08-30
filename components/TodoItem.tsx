
import React from 'react';
import type { Todo } from '../types';
import { useTodos } from '../context/TodoContext';
import { TrashIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { deleteTodo, toggleTodo } = useTodos();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTodo(todo.id);
    // No need to set isDeleting to false as the component will unmount
  };

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(todo.dateTime));

  return (
    <li className={`flex items-center p-2.5 rounded-lg transition-all duration-300 ${todo.completed ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'} ${isDeleting ? 'opacity-50' : 'opacity-100'}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <div className="ml-3 flex-grow">
        <p className={`text-slate-800 ${todo.completed ? 'line-through text-slate-400' : ''}`}>
          {todo.title}
        </p>
        <p className={`text-sm ${todo.completed ? 'text-slate-400' : 'text-slate-500'}`}>
          {formattedDate}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="ml-2 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        aria-label={`"${todo.title}" 삭제`}
      >
        <TrashIcon />
      </button>
    </li>
  );
};

export default TodoItem;