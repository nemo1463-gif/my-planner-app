export interface Todo {
  id: string;
  eventId: string; // To map with Google Calendar event
  title: string;
  completed: boolean;
  dateTime: Date;
}
