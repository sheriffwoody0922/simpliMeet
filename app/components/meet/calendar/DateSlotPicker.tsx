import { useState, useEffect, FunctionComponent } from 'react';
import { Calendar } from '@mantine/dates';
import { Text, Card, Center } from '@mantine/core';
import dayjs from 'dayjs';

import './dateslotpicker.css';

type AvailableWeekdaysType = {
  weekday: number
}

const DateSlotPicker: FunctionComponent<{ handleClickDate: (date: Date) => void }> = ({ handleClickDate }) => {
  const [selected, setSelected] = useState<Date[]>([]);
  const [availableWeekdays, setAvailableWeekdays] = useState<AvailableWeekdaysType[]>([]);

  const handleSelect = async (date: Date) => {
    handleClickDate(date);
    setSelected(() => [date]);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/available_weekdays');
      const data = await res.json();
      setAvailableWeekdays(data.availableWeekdays)
    }
    fetchData();
  }, [])

  return (
    <Card 
      w={350}
      shadow="sm" 
      radius="lg" 
      padding="lg"
      withBorder
    >
      <Center mt='sm'>
        <Text fw={500} size="lg">
          SELECT DATE
        </Text>
      </Center>
      <Center>
      <Calendar
        firstDayOfWeek={0}
        hideOutsideDates={true}
        minDate={dayjs().startOf('month').toDate()}
        excludeDate={(date: Date) => {
          const currentDay = dayjs(date).day();
          const isExistInSlots: boolean = 
            availableWeekdays.findIndex(element => element.weekday === currentDay) === -1;
          const isBeforeToday: boolean = dayjs().isAfter(dayjs(date));
          return  isBeforeToday || isExistInSlots;
        }}
        getDayProps={(date) => ({
          selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
          onClick: () => handleSelect(date),
        })}
        />
      </Center>
    </Card>
  );
}

export default DateSlotPicker;