import { FunctionComponent, useEffect, useState } from 'react';
import { Flex, Group, Switch, ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';

import TimePicker from '../meet/timePicker/TimePicker';
import { prefixDate } from '~/utils/weekdaysUtils';

export type TimeSlotData = {
  id: string, 
  start: string, 
  end: string,
  error: string | null
  weekday?: string
};

const AvailabilityScheduler:FunctionComponent<{
  weekday: string,
  slotsArray: TimeSlotData[],
  handleX: () => void,
  addSlots: (newSlot: TimeSlotData[], weekday: string) => void,
}> = ({
  weekday,
  slotsArray,
  addSlots,
  handleX
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [prevTimeSlots, setPrevTimeSlots] = useState<TimeSlotData[]>([]);

  useEffect(() => {
    setTimeSlots([...slotsArray]);
    if(slotsArray.length > 0) setIsActive(true);
  }, [slotsArray]);

  const handleToggle = (isChecked: boolean) => {
    const initialSlot:TimeSlotData = {
      id: dayjs().valueOf().toString(),
      start: '09:00 AM',
      end: '05:00 PM',
      error: null,
      weekday: weekday
    };

    if(isChecked && slotsArray.length === 0) {
      setTimeSlots([initialSlot]);
    }
     else if (isChecked && prevTimeSlots.length > 0) {
      setTimeSlots(prevTimeSlots);
    } 
    else {
      handleX();
      setPrevTimeSlots(timeSlots);
      setTimeSlots([]);
    }

    setIsActive(isChecked);
  }

  const addSlot = () => {
    const beforeSlot: TimeSlotData = timeSlots[timeSlots.length - 1];
    const endSlot: Dayjs = dayjs(prefixDate + beforeSlot.end);

    if(
      endSlot.isSame(prefixDate + '12:00 AM') || 
      ( endSlot.isAfter(prefixDate + '11:00 PM') && endSlot.isBefore(prefixDate + '12:00 PM'))
    ) return;

    const start: Dayjs = endSlot.add(1, 'hour');
    const end: Dayjs = endSlot.add(1.5, 'hour');

    const newSlot: TimeSlotData = {
      id: dayjs().valueOf().toString(),
      start: start.format('hh:mm A'),
      end: end.format('hh:mm A'),
      error: null,
      weekday: weekday
    };

    setTimeSlots([...timeSlots, newSlot]);
  };

  const changeSlot = (newSlot: TimeSlotData) => {
    const newTimeSlots = [...timeSlots];
    const index = newTimeSlots.findIndex(slot => slot.id === newSlot.id);
    
    if(index < 0) return;

    newTimeSlots[index].start = newSlot.start;
    newTimeSlots[index].end = newSlot.end;

    if(newSlot?.end !== '12:00 AM' && 
      (dayjs(prefixDate+newSlot?.start).isAfter(prefixDate+newSlot?.end) || 
      dayjs(prefixDate+newSlot?.start).isSame(prefixDate+newSlot?.end)))
    {
      newTimeSlots[index] = {
        ...newTimeSlots[index],
        error: "Choose the correct time."
      };
    }
    
    setTimeSlots(newTimeSlots);
  };

  const removeSlot = (id: string) => {
    const newTimeSlots = [...timeSlots];
    const indexToRemove = newTimeSlots.findIndex(slot => slot.id === id);
    
    if (indexToRemove !== -1) {
      newTimeSlots.splice(indexToRemove, 1)[0];
      setTimeSlots(newTimeSlots);
    }

    checkOverlap(newTimeSlots);
    handleX();
  };

  const checkOverlap = (_timeSlots?: TimeSlotData[]) => {
    let newTimeSlots: TimeSlotData[] = [];

    if(_timeSlots) {
      newTimeSlots = sortTimeSlotsByStart(_timeSlots);
    } else {
      newTimeSlots = sortTimeSlotsByStart(timeSlots);
    }
    const overlapIds: string[] = [];

    for (let i = 0; i < newTimeSlots.length; i++) {
      for (let j = i + 1; j < newTimeSlots.length; j++) {
        const first = prefixDate + newTimeSlots[i].end;
        const second = prefixDate + newTimeSlots[j].start;

        if (dayjs(first).isAfter(second) || first === prefixDate + '12:00 AM') {
          overlapIds.push(newTimeSlots[i].id);
          overlapIds.push(newTimeSlots[j].id);
        }
      }
    }
    
    const addedErrorSlots = [...timeSlots];
    addedErrorSlots.forEach((slot: TimeSlotData) => {
      if(overlapIds.findIndex((element: string) => element === slot.id) >= 0)
      {
        slot.error = 'Times overlap';
      } else {
        slot.error = null;
      }
    });
  }    

  const sortTimeSlotsByStart = (timeSlots: TimeSlotData[]): TimeSlotData[] => {
    return timeSlots.slice().sort((slot1, slot2) => {
      const start1 = dayjs(prefixDate + slot1.start, 'hh:mm A');
      const start2 = dayjs(prefixDate + slot2.start, 'hh:mm A');
      return start1.diff(start2);
    });
  };


  useEffect(() => {
    addSlots(timeSlots, weekday);

    if(timeSlots.length == 0) 
    {
      setIsActive(false);
    }
    else {
      setIsActive(true);    
    }
  }, [timeSlots, weekday]);

  return (
    <div>
      <Flex
        mih={50}
        gap='xl'
        wrap='wrap'
        align='flex-start'
        direction='row'
        justify='space-between'
      >
        <Switch
          mt={4}
          color='#974949'
          defaultChecked
          label={weekday}
          checked={isActive}
          onChange={event => handleToggle(event.currentTarget.checked)}
        />
          <Group align='flex-start'>
            <TimePicker
              active={isActive}
              timeSlots={timeSlots}
              changeSlot={changeSlot}
              removeSlot={removeSlot}
              checkOverlap={checkOverlap}
            />
            <ActionIcon 
              mt={4}
              radius='lg'
              color='#974949' 
              variant='outline' 
              aria-label='Settings' 
              disabled={!isActive}
              onClick={()=>addSlot()}
            >
              <IconPlus 
                style={{ width: '70%', height: '70%' }} 
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
      </Flex>
    </div>
  );
}

export default AvailabilityScheduler
