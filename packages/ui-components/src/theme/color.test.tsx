import '@testing-library/jest-dom';
import colors from './colors';

describe('Test color theme values', () => {
  test('alpha.white correct colors set json', async () => {
    expect(JSON.stringify(colors['alpha.white'])).toBe(
      JSON.stringify({ 500: '#FFFFFF' })
    );
  });

  test('alpha.black correct colors set json', async () => {
    expect(JSON.stringify(colors['alpha.black'])).toBe(
      JSON.stringify({ 500: '#000000' })
    );
  });

  test('canvas.light correct colors set json', async () => {
    expect(JSON.stringify(colors['canvas.light'])).toBe(
      JSON.stringify({ 500: '#E5E5E5' })
    );
  });

  test('canvas.dark correct colors set json', async () => {
    expect(JSON.stringify(colors['canvas.dark'])).toBe(
      JSON.stringify({ 500: '#1F1E1F' })
    );
  });

  test('brand.primary correct colors set json', async () => {
    expect(JSON.stringify(colors['brand.primary'])).toBe(
      JSON.stringify({
        900: '#414180',
        800: '#5353A3',
        700: '#7070DD',
        600: '#C0C0FC',
        500: '#E3E3FC',
      })
    );
  });

  test('brand.secondary correct colors set json', async () => {
    expect(JSON.stringify(colors['brand.secondary'])).toBe(
      JSON.stringify({
        900: '#57805D',
        800: '#62A36B',
        700: '#BAEFC2',
        600: '#DEFCE3',
        500: '#F2FCF4',
      })
    );
  });

  test('brand.tertiary correct colors set json', async () => {
    expect(JSON.stringify(colors['brand.tertiary'])).toBe(
      JSON.stringify({
        900: '#295580',
        800: '#346DA3',
        700: '#75AEE4',
        600: '#CAE5FC',
        500: '#E8F3FC',
      })
    );
  });

  test('neutrals correct colors set json', async () => {
    expect(JSON.stringify(colors['neutrals'])).toBe(
      JSON.stringify({
        900: '#0F0F0F',
        800: '#2E2E2E',
        700: '#525252',
        600: '#7A7A7A',
        500: '#A3A3A3',
        400: '#B8B8B8',
        300: '#D1D1D1',
        200: '#E6E6E6',
        100: '#FAFAFA',
      })
    );
  });

  test('interface.error correct colors set json', async () => {
    expect(JSON.stringify(colors['interface.error'])).toBe(
      JSON.stringify({
        900: '#800C05',
        800: '#9E241C',
        700: '#DC180C',
        600: '#FCD2CF',
        500: '#FCEAE8',
      })
    );
  });

  test('interface.success correct colors set json', async () => {
    expect(JSON.stringify(colors['interface.success'])).toBe(
      JSON.stringify({
        900: '#008005',
        800: '#139E19',
        700: '#00C408',
        600: '#A3F0A7',
        500: '#E8FCE9',
      })
    );
  });

  test('interface.warning correct colors set json', async () => {
    expect(JSON.stringify(colors['interface.warning'])).toBe(
      JSON.stringify({
        900: '#CC8900',
        800: '#E59A00',
        700: '#FFAB00',
        600: '#FCDFA2',
        500: '#FCEFD4',
      })
    );
  });
});
