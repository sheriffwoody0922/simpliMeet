import { Box, Button, Flex, ThemeIcon } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconCalendarTime } from "@tabler/icons-react";

export default function Index() {
  return (
    <Box maw={340} mx="auto" mt={150}>
      <Flex
        direction='column'
        align='center'
        justify='center'
      >
        <ThemeIcon
          variant="white" 
          radius="xl" 
          size={100}
          color="#974949"
          >
          <IconCalendarTime style={{ width: '70%', height: '70%' }} />
        </ThemeIcon>
        <h1>
          SimpliMeet
        </h1>
        <Flex
        align='center'
        justify='center'
      >
        <Link to="/availability">
          <Button variant="outline" color="#974949" mr='md'>Availablity</Button>
        </Link>
        <Link to="/meet">
          <Button variant="outline" color="#974949" mr='md'>Calendar</Button>
        </Link>
        <Link to="/bookings">
          <Button variant="outline" color="#974949">Schedules</Button>
        </Link>
      </Flex>
        <Flex
          direction='column'
          justify='center'
          align='center'
          mt={20}
        >
          <code>You can use SimpliMeet to:</code>
          <code>- Schedule meetings and appointments</code>
          <code>- Set and manage your availability</code>
        </Flex>
      </Flex>
    </Box>
  );
}
