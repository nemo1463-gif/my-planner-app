import React, { useState, useEffect } from 'react';
import { TodoProvider } from './context/TodoContext';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const Auth: React.FC = () => {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold text-slate-700 mb-2">환영합니다!</h2>
      <p className="text-slate-500 mb-6">할 일 목록 동기화를 시작하려면 Google 캘린더를 연결하세요.</p>
      {/* 이 버튼은 이제 실제 백엔드의 인증 경로로 연결되는 링크입니다. */}
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
  // 실제 인증은 Google 리디렉션을 통해 서버에서 처리됩니다.
  // 이 상태는 단순히 사용자가 인증 흐름을 거쳤는지 여부를 UI에 표시하기 위한 것입니다.
  // 실제 앱에서는 쿠키나 서버 확인을 통해 더 견고하게 처리할 수 있습니다.
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 페이지 로드 시, 사용자가 이미 인증되었는지 확인하는 간단한 방법.
    // 예를 들어, 서버에 /api/auth/status 같은 엔드포인트를 만들어 확인할 수 있습니다.
    // 이 예제에서는 간단하게, URL에 'code='가 있으면 인증 흐름을 거친 것으로 간주합니다.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
      setIsAuthorized(true);
    }
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen pt-4 sm:pt-8">
      <main className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          {isAuthorized ? (
            <TodoProvider>
              <Header />
              <div className="space-y-4">
                <TodoForm />
                <TodoList />
              </div>
            </TodoProvider>
          ) : (
            <Auth />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
