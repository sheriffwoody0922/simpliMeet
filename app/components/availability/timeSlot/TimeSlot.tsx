import { FunctionComponent } from 'react';
import { Button } from '@mantine/core';
import './timeslot.css'

const TimeSlot: FunctionComponent<{
  start: string, 
  end: string, 
  selected: boolean, 
  onSelect: () => void
}> = ({ 
  start, 
  end, 
  selected, 
  onSelect 
}) => {

  const handleClick = () => {
    onSelect();
  };

  return (
    <Button 
      className='time-slot'
      mb='md'
      size='md'
      radius='xl' 
      color='#974949'
      fw={400}
      variant={selected ? 'filled' : 'outline'}
      onClick={handleClick}
    >
      {start} - {end}
    </Button>    
  );
}

export default TimeSlot
