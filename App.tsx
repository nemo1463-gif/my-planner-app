import React, { useState, useEffect } from 'react';
import { TodoProvider } from './context/TodoContext';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Spinner from './components/Spinner';

const Auth: React.FC = () => {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold text-slate-700 mb-2">환영합니다!</h2>
      <p className="text-slate-500 mb-6">할 일 목록 동기화를 시작하려면 Google 캘린더를 연결하세요.</p>
      <a
        href="/auth/google"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Google 캘린더 연결
      </a>
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 페이지 로드 시, 서버에 현재 인증 상태를 물어봅니다.
    // 이렇게 하면 페이지를 새로고침해도 로그인 상태가 유지됩니다.
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
            credentials: 'include', // Send cookies with the request
        });
        if (!response.ok) {
            // If the response is not ok (e.g., 401), we are not authorized.
            setIsAuthorized(false);
            return;
        }
        const data = await response.json();
        setIsAuthorized(data.isAuthorized);
      } catch (error) {
        // A network error or JSON parsing error also means we're not authorized.
        console.error('인증 상태 확인 중 오류:', error);
        setIsAuthorized(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const renderContent = () => {
    if (isCheckingAuth) {
      return (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      );
    }

    if (isAuthorized) {
      return (
        <TodoProvider>
          <Header />
          <div className="space-y-4">
            <TodoForm />
            <TodoList />
          </div>
        </TodoProvider>
      );
    }
    
    return <Auth />;
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-4 sm:pt-8">
      <main className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
