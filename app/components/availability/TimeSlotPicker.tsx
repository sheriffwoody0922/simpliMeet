import { FunctionComponent, useEffect, useState } from 'react';
import { Text, Card, Center, SimpleGrid, ScrollArea, ThemeIcon, Stack } from '@mantine/core';
import TimeSlot from './timeSlot/TimeSlot';
import { AvailableTime, Booking } from '~/types/canlendlyTypes';
import dayjs, { Dayjs } from 'dayjs';
import { IconCalendarOff } from '@tabler/icons-react';

const TimeSlotPicker:FunctionComponent<{
  availableTimes: AvailableTime[],
  bookings: Booking[],
  selectedDate: string | null,
  selectedSlot: AvailableTime | null,
  handleSelectSlot: (slot: AvailableTime | null) => void
}> = ({
  availableTimes, 
  bookings,
  selectedDate,
  selectedSlot,
  handleSelectSlot
}) => {

  const [slots, setSlots] = useState<AvailableTime[]>([])
  
  useEffect(() => {
    const _slots: AvailableTime[] = [];
    availableTimes.forEach(availableTime => {
      const _startTime: Dayjs = dayjs(`${selectedDate} ${availableTime.start}`);
      const _endTime: Dayjs = dayjs(`${selectedDate} ${availableTime.end}`);
      let _iterateTime = _startTime;

      while(!_iterateTime.isSame(_endTime)) {
        if(bookings.findIndex(book => dayjs(book.dateTime).isSame(_iterateTime)) == -1){
          _slots.push({
            slotId: _iterateTime.valueOf().toString(),
            start: _iterateTime.format('hh:mm A'),
            end: _iterateTime.add(30, 'minutes').format('hh:mm A'),
            weekday: availableTime.weekday
          });
        }

        _iterateTime = _iterateTime.add(30, 'minutes')
      }
    });
    setSlots(_slots);
  }, [availableTimes, selectedDate, bookings])

  useEffect(() => {
    handleSelectSlot(null);
  }, [selectedDate])

  return (
    <Card 
      ml='lg'
      shadow="sm" 
      padding="lg" 
      radius="lg" 
      withBorder
      w={420}
    >
      <Center>
        <Text fw={500} size="lg" mt='sm'>
          SELECT TIME
        </Text>
      </Center>
      <ScrollArea 
        mb="md" 
        pr="sm"
        h={300}  
        scrollbarSize={6} 
      >
          {slots.length > 0 ? 
            (
              <SimpleGrid
                mt={30}
                cols={2} 
              > 
                {slots.map(slot => (
                  <TimeSlot 
                    key={slot.slotId} 
                    start={slot.start} 
                    end={slot.end} 
                    selected={slot.slotId === selectedSlot?.slotId}
                    onSelect={() => handleSelectSlot(slot)} 
                  />)
                )}
              </SimpleGrid>
            ) : (
              <SimpleGrid mt={30}>
                <Center>
                  <Stack>
                    <Center>
                      <ThemeIcon
                        variant="outline"
                        size="xl"
                        aria-label="Gradient action icon"
                        color='#974949'
                        opacity={0.5}
                        >
                        <IconCalendarOff/>
                      </ThemeIcon>
                    </Center>
                    <Text
                      opacity={0.5}
                    >
                      {`You can't book on this day!`}
                    </Text>
                  </Stack>
                </Center>
              </SimpleGrid>
            )}
      </ScrollArea>
    </Card>
  );
}

export default TimeSlotPicker;