import { json } from "@remix-run/node";

import { prisma } from "~/utils/prisma.server";

export const loader = async () => {
  const availableWeekdays = await prisma.timeSlot.findMany({
    distinct: ['weekday'],
    select: {
      weekday: true,
    },
  });

  return json({
    availableWeekdays,
  });
};
