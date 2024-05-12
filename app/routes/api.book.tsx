import { ActionFunctionArgs } from "@remix-run/node";
import dayjs from "dayjs";
import { prisma } from "~/utils/prisma.server";

export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const formData = await request.formData();
  
    const name = formData.get("name");
    const email = formData.get("email");
    const purpose = formData.get("purpose");
    const date: Date = dayjs(formData.get("date")?.toString()).toDate()

    if(name === null) return;
    if(email === null) return;

    try {
      const anyBeforeBook = await prisma.booking.findMany({
        where: {
          dateTime: date
        }
      })

      if (anyBeforeBook.length > 0 ) {
        return new Response('This slot was already booked!', {
          status: 400
        })
      } 
    } catch (e) {
      console.error(e);
    }
  
    try {
      await prisma.$transaction(async (prisma) => {
        const anyBeforeBook = await prisma.booking.findMany({
          where: {
            dateTime: date
          }
        });

        if (anyBeforeBook.length > 0 ) {
          throw new Error('Appointment time is already booked for this user.');
        } 

        return prisma.booking.create({
          data: {
            name: name.toString(),
            email: email.toString(),
            description: purpose ? purpose.toString() : '',
            dateTime: date
          }
        })
      });
    } catch (error) {
      return new Response("This slot was already booked!", { status: 409 });
    }
    return 'success';
};