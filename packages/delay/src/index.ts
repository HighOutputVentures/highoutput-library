import ms from 'ms';

const delay = (duration: string): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms(duration));
});

export default delay;
