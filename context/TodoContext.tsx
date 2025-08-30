
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
      setTodos(fetchedTodos);
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
      setTodos(prevTodos => [...prevTodos, newTodo].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()));
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
      const updatedTodo = await api.toggleTodoCompletion(id);
      setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? updatedTodo : todo));
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