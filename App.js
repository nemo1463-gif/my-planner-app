"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TodoContext_1 = require("./context/TodoContext");
var Header_1 = require("./components/Header");
var TodoForm_1 = require("./components/TodoForm");
var TodoList_1 = require("./components/TodoList");
/**
 * NOTE: This is a MOCK authentication component.
 * In a real application, you would use a library like '@react-oauth/google'
 * to handle the OAuth 2.0 flow. The user MUST grant permission for the
 * app to access their calendar. The "no login" requirement means the user
 * doesn't create a separate account for this app; they just authorize
 * it with their existing Google account.
 */
var Auth = function (_a) {
    var onAuthSuccess = _a.onAuthSuccess;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var handleAuthClick = function () {
        setIsLoading(true);
        // Simulate the Google OAuth popup and successful login
        setTimeout(function () {
            onAuthSuccess();
            setIsLoading(false);
        }, 1200);
    };
    return (<div className="text-center p-4">
      <h2 className="text-xl font-bold text-slate-700 mb-2">환영합니다!</h2>
      <p className="text-slate-500 mb-6">할 일 목록 동기화를 시작하려면 Google 캘린더를 연결하세요.</p>
      <button onClick={handleAuthClick} disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50">
        {isLoading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>)}
        {isLoading ? '연결 중...' : 'Google 캘린더 연결'}
      </button>
    </div>);
};
var App = function () {
    var _a = (0, react_1.useState)(false), isAuthorized = _a[0], setIsAuthorized = _a[1];
    return (<div className="flex justify-center items-start min-h-screen pt-4 sm:pt-8">
      <main className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          {isAuthorized ? (<TodoContext_1.TodoProvider>
              <Header_1.default />
              <div className="space-y-4">
                <TodoForm_1.default />
                <TodoList_1.default />
              </div>
            </TodoContext_1.TodoProvider>) : (<Auth onAuthSuccess={function () { return setIsAuthorized(true); }}/>)}
        </div>
      </main>
    </div>);
};
exports.default = App;
