import { 
  ActionIcon, 
  Box, 
  Flex, 
  Card, 
  Divider, 
  Group, 
  ScrollArea, 
  Stack, 
  Text, 
  ThemeIcon,
} from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";
import { IconBell, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { prisma } from "~/utils/prisma.server";

export function loader() {
  return prisma.booking.findMany({
    where: {
      dateTime: {
        gt: dayjs().toDate()
      }
    },
    orderBy: {
      dateTime: 'asc' 
    }
  });
}

export default function Bookings() {
  const bookings = useLoaderData<typeof loader>();

  return (
    <Box maw={500} mx="auto" mt={150}>
      <Card
        w={500}
        shadow="sm" 
        radius="lg" 
        padding="lg"
        withBorder
      >
      <Flex
        align='center'
        justify='space-between'
      >
        <Group>
          <ThemeIcon
            size={50}
            radius="xl" 
            variant="white" 
            color="#974949"
            >
            <IconBell/>
          </ThemeIcon>
          <Text>Upcoming Event</Text>
        </Group>
        <Link to='/'>
          <ActionIcon
            size={50}
            radius="xl" 
            variant="white" 
            color="#974949"
            >
            <IconX/>
          </ActionIcon>
        </Link>
      </Flex>
      <Divider/>
        <div>
          <ScrollArea 
            mt='sm'
            mx='lg'
            pr='sm'
            h={365}  
            scrollbarSize={6} 
          >
          {bookings.map((booking) => (
            <div key={booking.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder mt='sm'>
                <Stack
                  gap='sm'
                >
                  <Flex
                    justify='start'
                  >
                    <Text>
                      Name: {booking.name}
                    </Text>
                    <Text ml='md'>
                      Email: {booking.email}
                    </Text>
                  </Flex>
                  <Text>{
                  dayjs(booking.dateTime).format('YYYY/MM/DD hh:mm A')}
                  - { dayjs(booking.dateTime).add(30, 'minutes').format('hh:mm A')}
                  </Text>
                  <Text>
                    Purpose: {booking.description}  
                  </Text>
                </Stack>
              </Card>
            </div>
          ))}
          </ScrollArea>
        </div>
      </Card>
    </Box>
  );
}
