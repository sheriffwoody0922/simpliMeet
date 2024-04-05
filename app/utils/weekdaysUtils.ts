import dayjs, { Dayjs } from 'dayjs';
import { TimeSlotData } from '~/components/availability/AvailabilityScheduler';

export interface WeekdayInfo {
  id: string,
  day: Dayjs;
  weekday: string;
}

export const prefixDate = '2024-04-01 ';

export const generateWeekdaysArray = (start: Dayjs): WeekdayInfo[] => {
  const weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const firstDay = start.startOf('week').add(0, 'day');
  
  const weekdaysArray: WeekdayInfo[] = weekdays.map((weekday, index) => ({
    id: index.toString(),
    day: firstDay.add(index, 'day'),
    weekday,
  }));

  return weekdaysArray;
};

export const generateTimeSlots = (
  startTime: string, 
  endTime: string, 
  gapInMinutes: number
): string[] => {
  const timeSlots: string[] = [];
  const startDateTime = dayjs(`2022-01-01 ${startTime}`);
  const endDateTime = dayjs(`2022-01-01 ${endTime}`);
  
  let currentTime = startDateTime;
  while (!currentTime.isSame(endDateTime)) {
      timeSlots.push(currentTime.format('hh:mm A'));
      currentTime = currentTime.add(gapInMinutes, 'minute');
  }
  timeSlots.push(currentTime.format('hh:mm A'));

  return timeSlots;
};

export const getIndexWeekday = (weekday: string): number => {
  const weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return weekdays.findIndex((day) => day === weekday); 
}

export type TimeSlotsArrayPerWeekday = {
  weekdayId: number,
  weekday: string,
  slotsArray: TimeSlotData[]
}

export const weekdaysArraySkeleton: TimeSlotsArrayPerWeekday[] = [
  {
    weekdayId: 0,
    weekday: 'Sunday', 
    slotsArray: []
  },
  {
    weekdayId: 1,
    weekday: 'Monday', 
    slotsArray: []
  },
  {
    weekdayId: 2,
    weekday: 'Tuesday', 
    slotsArray: []
  },
  {
    weekdayId: 3,
    weekday: 'Wednesday', 
    slotsArray: []
  },
  {
    weekdayId: 4,
    weekday: 'Thursday', 
    slotsArray: []
  },
  {
    weekdayId: 5,
    weekday: 'Friday', 
    slotsArray: []
  },
  {
    weekdayId: 6,
    weekday: 'Saturday', 
    slotsArray: []
  },
];