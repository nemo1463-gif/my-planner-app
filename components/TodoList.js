"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TodoContext_1 = require("../context/TodoContext");
var TodoItem_1 = require("./TodoItem");
var Spinner_1 = require("./Spinner");
var TodoList = function () {
    var _a = (0, TodoContext_1.useTodos)(), todos = _a.todos, isLoading = _a.isLoading, error = _a.error;
    if (isLoading) {
        return (<div className="flex justify-center items-center py-10">
        <Spinner_1.default />
      </div>);
    }
    if (error) {
        return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    return (<div className="mt-3 border-t border-slate-200 pt-3">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">나의 할 일</h2>
      {todos.length === 0 ? (<p className="text-slate-500 text-center py-4">
            모든 할 일을 마쳤어요! ✨
        </p>) : (<ul className="space-y-1">
          {todos.map(function (todo) { return (<TodoItem_1.default key={todo.id} todo={todo}/>); })}
        </ul>)}
    </div>);
};
exports.default = TodoList;
