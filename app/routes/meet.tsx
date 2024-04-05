import { Center, Stack, Button, Flex } from "@mantine/core";
import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";

import DateSlotPicker from "~/components/meet/calendar/DateSlotPicker";
import TimeSlotPicker from "~/components/availability/TimeSlotPicker";
import { AvailableTime } from "~/types/canlendlyTypes";

export default function Meet() {
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableTime | null>(null);

  const handleClickDate = async (date: Date) => {
    const currentDay = dayjs(date).day();
    const currentDate = dayjs(date).format('YYYY-MM-DD');
    const res = await fetch(`/api/timeslots?day=${currentDay}&date=${currentDate}`);
    const data = await res.json();
    setAvailableTimes(data.timeSlots);
    setBookings(data.bookings);
    setSelectedDate(currentDate);
  }

  const handleSelectSlot = (slot: AvailableTime | null) => {
    setSelectedSlot(slot);
  }

  return (
    <Center mt={130}>
      <Stack>
        <Flex>
            <DateSlotPicker
              handleClickDate={handleClickDate}
            />        
            <TimeSlotPicker
              availableTimes={availableTimes}
              bookings={bookings}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              handleSelectSlot={handleSelectSlot}
            />
        </Flex>
        <Center>
          <Link
            to={`/bookform?start=${selectedSlot?.start}&date=${selectedDate}`}
          >
            <Button
              mt='sm'
              px='xl'
              size='lg'
              radius='xl' 
              color='#974949'
              fw={500}
              disabled={selectedSlot === null}
            >
              Book
            </Button>
          </Link>
        </Center>
      </Stack>
    </Center>
  );
}
