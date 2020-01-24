import ms from 'ms';

export default async function(param: string | number): Promise<void> {
  const duration = typeof param === 'string' ? ms(param) : param;

  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}
