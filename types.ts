export interface Todo {
  id: string | null | undefined;
  eventId: string | null | undefined; // To map with Google Calendar event
  title: string | null | undefined;
  completed: boolean;
  dateTime: Date;
}

