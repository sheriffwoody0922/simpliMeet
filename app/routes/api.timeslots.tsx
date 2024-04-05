import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { TimeSlotData } from "~/components/availability/AvailabilityScheduler";
import dayjs from 'dayjs';

import { prisma } from "~/utils/prisma.server";
import { getIndexWeekday } from "~/utils/weekdaysUtils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const day = new URL(request.url).searchParams.get('day');
  const date = new URL(request.url).searchParams.get('date');
  if (day && date) {
    const bookings = await prisma.booking.findMany({
      where: {
        dateTime: {
          gt: new Date(date),
          lt: dayjs(date).add(1, 'day').toDate(),
        }
      }
    });
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        weekday: parseInt(day),
      }
    });
  
    return json({
      timeSlots,
      bookings,
    });
  }

  const timeSlots = await prisma.timeSlot.findMany();
  return json({
    timeSlots,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  if (request.method === 'POST') {
    handlePostRequest(body);
  } else if (request.method === 'DELETE') {
    handleDeleteRequest(body);
  } else {
    handlePutRequest(body);
  }
  return null;
}

const handlePostRequest = async (body: TimeSlotData[]) => {
  const addedTimeSlots: TimeSlotData[] = body;

  await Promise.all(
    addedTimeSlots.map(slot => {
      const field = {
        slotId: slot.id,
        start: slot.start,
        end: slot.end,
        weekday: getIndexWeekday(slot.weekday!)
      }
      return prisma.timeSlot.create({ data: field });
    })
  );
}

const handlePutRequest = async (body: TimeSlotData[]) => {
  const changedTimeSlots: TimeSlotData[] = body;

  await Promise.all(
    changedTimeSlots.map(slot => {
      return prisma.timeSlot.update({ 
        where: { slotId: slot.id},
        data: {
          start: slot.start,
          end: slot.end,
        } 
      });
    })
  );
}

const handleDeleteRequest = async (body: TimeSlotData[]) => {
  const deletedTimeSlots: TimeSlotData[] = body;
  if(deletedTimeSlots.length > 0) {
    await Promise.all(
      deletedTimeSlots.map(slot => {
        return prisma.timeSlot.delete({ where: { slotId: slot.id} });
      })
    );
  } else {
    if((await prisma.timeSlot.findMany()).length != 0)
      return prisma.timeSlot.deleteMany({});
    return null;
  }
}