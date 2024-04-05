import { useEffect, useState } from 'react';
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Card, Text, Center, ScrollArea, Button, Flex, Stack} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowBackUp, IconCalendar } from '@tabler/icons-react';

import { prisma } from "~/utils/prisma.server";
import AvailabilityScheduler, { TimeSlotData } from '~/components/availability/AvailabilityScheduler';
import { TimeSlotsArrayPerWeekday, weekdaysArraySkeleton } from '~/utils/weekdaysUtils';

export const loader = async () => {
  const timeSlots = await prisma.timeSlot.findMany({});
  return json({
    timeSlots,
  });
};

export default function Availability() {
  const [isValidate, setIsValidate] = useState(false);
  const [timeSlotsPerWeek, setTimeSlotsPerWeek] = useState<TimeSlotData[]>([]);
  const [previousSlotsPerWeek, setPreviousSlotsPerWeek] = useState<TimeSlotData[]>([]);
  const [weekdaysArray, setWeekdaysArray] = 
    useState<TimeSlotsArrayPerWeekday[]>(JSON.parse(JSON.stringify(weekdaysArraySkeleton)));

  const prismaData = useLoaderData<typeof loader>();

  const addSlots = (newSlots: TimeSlotData[], weekday: string) => {
    const _mockTimeSlotsPerWeek = [...timeSlotsPerWeek];

    const _newSlotsPerWeek = _mockTimeSlotsPerWeek.filter((slot) => {
      return slot.weekday !== weekday;
    }).concat(newSlots);

    setTimeSlotsPerWeek(_newSlotsPerWeek);
  }

  const saveSlots = () => {
    const _array1 = previousSlotsPerWeek;
    const _array2 = timeSlotsPerWeek;

    const _removedItems = _array1.filter((_obj1) => _array2.findIndex(_obj2 => _obj2.id === _obj1.id) === -1);
    const _addedItems = _array2.filter((_obj2) => _array1.findIndex(_obj1 => _obj1.id === _obj2.id) === -1);
    const _changedItems = findChangedItems(_array1, _array2);
    const _fetchArray = [];
    if(_addedItems.length > 0) {
      const addRequest = { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_addedItems)
      };
      _fetchArray.push(addRequest);
    }
    
    if(_removedItems.length > 0) {
      const deleteRequest = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_removedItems)
      };
      _fetchArray.push(deleteRequest);
    }

    if(_changedItems.length > 0) {
      const changeRequest = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_changedItems)
      };
      _fetchArray.push(changeRequest);
    }
    
    Promise.all(_fetchArray.map(request => {
      fetch('/api/timeslots', request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error; 
      });
    }))
    .then(() => {
      notifications.show({
        title: 'Saved',
        message: 'Requestors now have access to your updated availability! 📅✨',
        color: '#4CAF50'
      });
    })
    .catch(error => {
      console.error('One or more requests failed:', error);
      notifications.show({
        title: 'Failed',
        message: 'Something went wrong! 😔',
        color: '#FF5722'
      });
    });

    setPreviousSlotsPerWeek(JSON.parse(JSON.stringify(timeSlotsPerWeek)));
  }

  const handleX = () => {
    if(timeSlotsPerWeek.length == 1)
    { 
      const deleteRequest = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      };
      fetch('/api/timeslots', deleteRequest);
      setPreviousSlotsPerWeek([]);
    }
  }

  const findChangedItems = (arr1: TimeSlotData[], arr2: TimeSlotData[]): TimeSlotData[] => {
    const changedItems: TimeSlotData[] = [];
    
    arr1.forEach(_obj1 => {
      const _obj2 = arr2.find(_obj2 => _obj2.id === _obj1.id);
      if (_obj2 && (_obj1.start !== _obj2.start || _obj1.end !== _obj2.end)) {
        changedItems.push(_obj2);
      }
    });
  
    return changedItems;
  };

  useEffect(() => {
    const _weekdayIds: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const _weekdaysArray: TimeSlotsArrayPerWeekday[] = JSON.parse(JSON.stringify(weekdaysArraySkeleton));
    const _previousSlots: TimeSlotData[] = [];

    prismaData.timeSlots.forEach((slot) => {
      _weekdaysArray[slot.weekday].slotsArray.push({
        id: slot.slotId,
        start: slot.start,
        end: slot.end,
        error: null,
        weekday: _weekdayIds[slot.weekday]
      });
      _previousSlots.push({
        id: slot.slotId,
        start: slot.start,
        end: slot.end,
        error: null,
        weekday: _weekdayIds[slot.weekday]
      });
    });

    setTimeSlotsPerWeek(_previousSlots);
    setPreviousSlotsPerWeek(_previousSlots);
    setWeekdaysArray(_weekdaysArray);
  }, [prismaData]);
  
  useEffect(() => {
    const isError = timeSlotsPerWeek.some(slot => slot.error !== null);
    const isEmpty = timeSlotsPerWeek.length === 0;
    setIsValidate(!(isError || isEmpty));
  }, [timeSlotsPerWeek]);


  return (
    <Center mt={100}>
      <Stack gap='sm'>
        <Card 
          shadow='sm' 
          radius='lg' 
          withBorder
        >
          <Center my='sm'>
            <Text fw={500} size='lg'>
              SELECT AVAILABLE HOURS
            </Text>
          </Center> 
          <ScrollArea 
            mt='sm'
            mx='lg'
            pr='sm'
            h={365}  
            scrollbarSize={6} 
          >
            {weekdaysArray.map((timeSlots: TimeSlotsArrayPerWeekday) => 
              <AvailabilityScheduler
                key={timeSlots.weekdayId}
                weekday={timeSlots.weekday}
                slotsArray={timeSlots.slotsArray}
                addSlots={addSlots}
                handleX={handleX}
              />
            )}
          </ScrollArea>
          <Center>
            <Button
                mt='sm'
                px='xl'
                size='md'
                radius='xl' 
                color='#974949'
                disabled={!isValidate}
                onClick={() => saveSlots()}
                fw={500}
              >
              SAVE
            </Button>
          </Center> 
        </Card>
        <Flex
          justify='space-around'
        >
          <Link to="/">
            <Button
              mt='sm'
              px='xl'
              size='md'
              radius='xl' 
              color='#974949'
              variant='outline'
              fw={500}
            >
              <IconArrowBackUp/>
            </Button>
          </Link>
          <Link to="/meet">
            <Button
                mt='sm'
                px='xl'
                size='md'
                radius='xl' 
                variant='outline'
                color='#974949'
                fw={500}
              >
              <IconCalendar/>
            </Button>
          </Link>
        </Flex>
      </Stack>
    </Center>
  );
}
