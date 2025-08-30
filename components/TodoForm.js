"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TodoContext_1 = require("../context/TodoContext");
var icons_1 = require("./icons");
// Helper function to get today's date in YYYY-MM-DD format
var getTodayDateString = function () {
    var today = new Date();
    return today.toISOString().split('T')[0];
};
// Helper function to get current time in HH:MM format
var getCurrentTimeString = function () {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    return "".concat(hours, ":").concat(minutes);
};
var TodoForm = function () {
    var _a = (0, react_1.useState)(''), title = _a[0], setTitle = _a[1];
    var _b = (0, react_1.useState)(getTodayDateString()), date = _b[0], setDate = _b[1];
    var _c = (0, react_1.useState)(getCurrentTimeString()), time = _c[0], setTime = _c[1];
    var addTodo = (0, TodoContext_1.useTodos)().addTodo;
    var _d = (0, react_1.useState)(false), isAdding = _d[0], setIsAdding = _d[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!title.trim() || !date || !time)
                        return [2 /*return*/];
                    setIsAdding(true);
                    return [4 /*yield*/, addTodo(title, date, time)];
                case 1:
                    _a.sent();
                    setTitle('');
                    setIsAdding(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="todo-title" className="sr-only">새 할 일</label>
        <input id="todo-title" type="text" value={title} onChange={function (e) { return setTitle(e.target.value); }} placeholder="무엇을 해야 하나요?" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required/>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="todo-date" className="sr-only">날짜</label>
          <input id="todo-date" type="date" value={date} onChange={function (e) { return setDate(e.target.value); }} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required/>
        </div>
        <div className="flex-1">
          <label htmlFor="todo-time" className="sr-only">시간</label>
          <input id="todo-time" type="time" value={time} onChange={function (e) { return setTime(e.target.value); }} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required/>
        </div>
      </div>
      <button type="submit" disabled={isAdding} className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:bg-blue-300">
        {isAdding ? '추가 중...' : <><icons_1.PlusIcon /> 할 일 추가</>}
      </button>
      <p className="text-xs text-center text-slate-500 pt-1">
        💡 캘린더에 1일, 2시간, 30분 전 알림이 자동 설정됩니다.
      </p>
    </form>);
};
exports.default = TodoForm;
