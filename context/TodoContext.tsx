import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Todo } from '../types';
import * as api from '../services/googleCalendarService';

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (title: string, date: string, time: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTodos = await api.fetchTodos();
      // API에서 받은 할 일들을 날짜/시간 순으로 정렬합니다.
      const sortedTodos = fetchedTodos.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
      setTodos(sortedTodos);
    } catch (err) {
      setError('할 일 목록을 불러오지 못했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = async (title: string, date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      const newTodo = await api.createTodo(title, dateTime);
      setTodos(prevTodos => 
        [...prevTodos, newTodo].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      );
    } catch (err) {
      setError('할 일을 추가하지 못했습니다.');
      console.error(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.removeTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('할 일을 삭제하지 못했습니다.');
      console.error(err);
    }
  };
  
  const toggleTodo = async (id: string) => {
    try {
      // API는 '완료' 상태를 지원하지 않으므로, 이 기능은 프론트엔드에서만 상태를 변경합니다.
      // 실제 앱에서는 캘린더 이벤트의 색상을 변경하는 등의 방법으로 구현할 수 있습니다.
      const todoToToggle = todos.find(todo => todo.id === id);
      if (!todoToToggle) {
        console.error(`Todo with id ${id} not found for toggling.`);
        return;
      }
      
      const updatedTodo = { ...todoToToggle, completed: !todoToToggle.completed };
      
      setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError('할 일을 업데이트하지 못했습니다.');
      console.error(err);
    }
  }

  return (
    <TodoContext.Provider value={{ todos, isLoading, error, addTodo, deleteTodo, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
