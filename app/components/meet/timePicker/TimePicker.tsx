import { FunctionComponent } from 'react';
import { IconX } from '@tabler/icons-react';
import { ActionIcon, Flex, Select, Stack, Box } from '@mantine/core';

import { TimeSlotData } from '../../availability/AvailabilityScheduler';
import { generateTimeSlots } from '~/utils/weekdaysUtils';

import './timePicker.css';

type TimeSlotsProps = {
  data: string[],
  active: boolean,
  slot?: TimeSlotData,
  checkOverlap: () => void,
  removeSlot: (id: string) => void,
  changeSlot: (newSlot: TimeSlotData) => void
};

const TimeSlots = ({ 
  data, 
  slot, 
  active, 
  changeSlot, 
  checkOverlap, 
  removeSlot 
}: TimeSlotsProps) => (
  <Flex align='flex-start'>
    <Select
      mr={3}
      w={120}
      radius='md'
      data={data}
      value={slot?.start}
      disabled={!active}
      maxDropdownHeight={200}
      error={
        slot?.error !== null
        ? slot?.error
        : ''
      }
      onChange={(_value) => {
        if(_value === null) return;

        if (slot) {
          changeSlot({
            id: slot.id,
            start: _value!,
            end: slot.end,
            error: null
          });
        }
        checkOverlap();
      }} 
    />
    <Box mt={4}>-</Box>
    <Select
      ml={3}
      w={120}
      data={data}
      radius='md'
      value={slot?.end}
      disabled={!active}
      maxDropdownHeight={200}
      error={
        slot?.error != null
        ? slot?.error
        : ''
      }
      onChange={(_value) => {
        if(_value === null) return;

        if(slot) {
          changeSlot({
            id: slot.id,
            start: slot.start,
            end: _value!,
            error: null
          });
        }
        checkOverlap();
      }
    }
    />
    <ActionIcon 
      mt={4}
      ml='sm'
      radius='lg'
      color='#974949' 
      variant='outline' 
      aria-label='Settings'
      onClick={() => removeSlot(slot!.id)}
      disabled={!active}
    >
      <IconX
        stroke={1.5}
        style={{ width: '70%', height: '70%' }}
      />
    </ActionIcon>
  </Flex>
)

const TimePicker:FunctionComponent<{
  active: boolean, 
  timeSlots: TimeSlotData[],
  checkOverlap: () => void,
  removeSlot: (id: string) => void,
  changeSlot: (newSlot: TimeSlotData) => void
}> = ({active, timeSlots, checkOverlap, removeSlot, changeSlot}) => {

  const data: string[] = generateTimeSlots('12:00 AM', '11:30 PM', 30);

  return (
    <Stack mb='md'>
      {timeSlots.length > 0 && active === true? 
        timeSlots.map((slot) =>
          <TimeSlots 
            key={slot.id} 
            data={data}
            slot={slot}
            active={active}
            removeSlot={removeSlot}
            changeSlot={changeSlot}
            checkOverlap={checkOverlap}
          />
        ) : (
          <TimeSlots 
            data={data}
            active={false}
            removeSlot={removeSlot}
            changeSlot={changeSlot}
            checkOverlap={checkOverlap}
          />
        )
      }
    </Stack>
  );
}

export default TimePicker;
