export type AvailableTime = {
  slotId: string;
  start: string;
  end: string;
  weekday: number;
}

export type Booking = {
  name: string,
  email: string,
  description: string
  dateTime: string
}