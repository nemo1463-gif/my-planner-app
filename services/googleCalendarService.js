import type { Todo } from '../types';

// 백엔드 API와 통신하기 위한 함수들

export const fetchTodos = async (): Promise<Todo[]> => {
  // 참고: 이 예제의 백엔드 서버에는 GET /api/todos가 간단하게 구현되어 있습니다.
  // 실제 앱에서는 이 함수가 Google 캘린더에서 이벤트를 가져와야 합니다.
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createTodo = async (title: string, dateTime: Date): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, dateTime: dateTime.toISOString() }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
};

export const removeTodo = async (id: string): Promise<{id: string}> => {
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
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
    // This is a client-side simulation for now.
    // To make this real, you would need a backend endpoint to update the event
    // e.g., changing its color or adding a "[Completed]" prefix to the summary.
    console.log(`Simulating toggle for: ${todo.title}`);
    return { ...todo, completed: !todo.completed };
};
