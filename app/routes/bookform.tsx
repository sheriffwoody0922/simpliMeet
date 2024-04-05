import { 
  Box, 
  Flex,
  Text,
  Group, 
  Stack,
  Button, 
  Center,
  Divider, 
  Textarea, 
  TextInput, 
  ThemeIcon,
} from "@mantine/core";
import { 
  IconCalendarCheck, 
  IconClock2 
} from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { notifications } from "@mantine/notifications";
import { 
  json, 
  LoaderFunctionArgs,
 } from "@remix-run/node";
import dayjs from "dayjs";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const start = new URL(request.url).searchParams.get('start');
  const date = new URL(request.url).searchParams.get('date');

  return json({
    start,
    date
  })
}

type BookForm = {
  name: string,
  email: string,
  purpose: string
}

export default function BookForm() {
  const navigate = useNavigate();
  const { start, date } = useLoaderData<typeof loader>();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      purpose: '',
    },

    validate: {
      name: (value) => value.length > 0 ? null: 'Type your name',
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (value: BookForm) => {
    const formData = new FormData();
    formData.append('name', value.name);
    formData.append('email', value.email);
    formData.append('purpose', value.purpose);
    formData.append('date', dayjs(`${date} ${start}`).format('YYYY/MM/DD hh:mm A'));

    const response = await fetch('/api/book', {
      method: 'POST',
      body: formData,
    });

    if(response.status === 200) {
      notifications.show({
        title: 'Success',
        message: 'Hey there, Event is booked! 🤥',
        color: 'green',
        autoClose: 4000,
        onClose: () => {
          navigate('/')
        },
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Oops! There is an error.',
        color: 'red'
      })
    }
  }

  return (
    <Box maw={340} mx="auto" mt={150}>
      <Center>
        <Stack w={'100%'} gap={0}>
          <Center>
            <Text fw={500} size="lg">Event Detail</Text>
          </Center>
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <ThemeIcon
              variant="white" 
              radius="xl" 
              color="#974949"
            >
              <IconClock2 style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            <Text fw={500} size="sm" opacity={0.6}>30 minutes</Text>
          </Flex>
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <ThemeIcon
              variant="white" 
              radius="xl" 
              color="#974949"
            >
              <IconCalendarCheck style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            <Text fw={500} size="sm" opacity={0.6}>
              {dayjs(`${date} ${start}`).format('YYYY/MM/DD hh:mm A')}
            </Text>
          </Flex>
        </Stack>
      </Center>
      <Divider my="md" />
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput 
          withAsterisk
          label="Name" 
          placeholder="Name" 
          {...form.getInputProps('name')} 
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <Textarea
          label="Purpose"
          placeholder="Tell me!"
        />
        <Group justify="flex-end" mt="md">
          <Button 
            type="submit"
            color='#974949'
          >
            Schedule
          </Button>
          <Link
            to='/meet'
          >
            <Button 
              variant="outline"
              color='#974949'
              >
              Cancel
            </Button>
          </Link>
        </Group>
      </form>
    </Box>
  );
}
