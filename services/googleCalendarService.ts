import type { Todo } from '../types';

// API 응답(문자열 날짜)을 앱의 Todo 타입(Date 객체)으로 변환하는 헬퍼 함수
const mapApiDataToTodo = (data: any): Todo => {
    if (!data.id || !data.title || !data.dateTime) {
        throw new Error("Invalid data received from API");
    }
    return {
        ...data,
        dateTime: new Date(data.dateTime),
    };
};


export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // 배열의 각 항목을 변환합니다.
  return data.map(mapApiDataToTodo);
};

export const createTodo = async (title: string, dateTime: Date): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ title, dateTime: dateTime.toISOString() }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  const data = await response.json();
  // API 응답을 앱의 Todo 타입으로 변환합니다.
  return mapApiDataToTodo(data);
};

export const removeTodo = async (id: string): Promise<{id: string}> => {
    // ID가 null이거나 undefined일 경우 요청을 보내지 않습니다.
    if (!id) {
        throw new Error("Invalid ID for deletion");
    }
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to delete todo');
    }
    return response.json();
};


// 토글 기능은 Google Calendar API의 이벤트 업데이트와 관련되므로,
// 이 예제에서는 간단함을 위해 프론트엔드에서만 상태를 변경합니다.
// 실제 앱으로 확장하려면 백엔드에 PATCH /api/todos/:id 같은 엔드포인트를 만들어야 합니다.
export const toggleTodoCompletion = async (todo: Todo): Promise<Todo> => {
    console.log(`Simulating toggle for: ${todo.title}`);
    return { ...todo, completed: !todo.completed };
};
