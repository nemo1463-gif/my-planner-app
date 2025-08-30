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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTodos = exports.TodoProvider = void 0;
var react_1 = require("react");
var api = require("../services/googleCalendarService");
var TodoContext = (0, react_1.createContext)(undefined);
var TodoProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), todos = _b[0], setTodos = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var loadTodos = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedTodos, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    setError(null);
                    return [4 /*yield*/, api.fetchTodos()];
                case 1:
                    fetchedTodos = _a.sent();
                    setTodos(fetchedTodos);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError('할 일 목록을 불러오지 못했습니다.');
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        loadTodos();
    }, [loadTodos]);
    var addTodo = function (title, date, time) { return __awaiter(void 0, void 0, void 0, function () {
        var dateTime, newTodo_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dateTime = new Date("".concat(date, "T").concat(time));
                    return [4 /*yield*/, api.createTodo(title, dateTime)];
                case 1:
                    newTodo_1 = _a.sent();
                    setTodos(function (prevTodos) { return __spreadArray(__spreadArray([], prevTodos, true), [newTodo_1], false).sort(function (a, b) { return a.dateTime.getTime() - b.dateTime.getTime(); }); });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setError('할 일을 추가하지 못했습니다.');
                    console.error(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var deleteTodo = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.removeTodo(id)];
                case 1:
                    _a.sent();
                    setTodos(function (prevTodos) { return prevTodos.filter(function (todo) { return todo.id !== id; }); });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    setError('할 일을 삭제하지 못했습니다.');
                    console.error(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var toggleTodo = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedTodo_1, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.toggleTodoCompletion(id)];
                case 1:
                    updatedTodo_1 = _a.sent();
                    setTodos(function (prevTodos) { return prevTodos.map(function (todo) { return todo.id === id ? updatedTodo_1 : todo; }); });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    setError('할 일을 업데이트하지 못했습니다.');
                    console.error(err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<TodoContext.Provider value={{ todos: todos, isLoading: isLoading, error: error, addTodo: addTodo, deleteTodo: deleteTodo, toggleTodo: toggleTodo }}>
      {children}
    </TodoContext.Provider>);
};
exports.TodoProvider = TodoProvider;
var useTodos = function () {
    var context = (0, react_1.useContext)(TodoContext);
    if (context === undefined) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};
exports.useTodos = useTodos;
