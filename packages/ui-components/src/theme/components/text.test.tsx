import '@testing-library/jest-dom';
import { sizeText } from './text';

describe('Test text sizes values', () => {
  test('heading-web-1 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-1'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '80px',
        lineHeight: '88px',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-web-2 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-2'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '56px',
        lineHeight: '64px',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-web-3 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-3'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '40x',
        lineHeight: '44x',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-web-4 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-4'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '32x',
        lineHeight: '36px',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-web-5 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-5'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '28px',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-web-6 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-web-6'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '-0.02em',
      })
    );
  });

  test('heading-mobile-1 correct style json', async () => {
    expect(JSON.stringify(sizeText['heading-mobile-1'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '44px',
        lineHeight: '48px',
        letterSpacing: '-0.012em',
      })
    );
  });

  test('paragraph-xxl-default correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xxl-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '32px',
        lineHeight: '48px',
      })
    );
  });

  test('paragraph-xl-default correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xl-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '34px',
        lineHeight: '36px',
      })
    );
  });

  test('paragraph-lg-default correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-lg-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '20px',
        lineHeight: '32px',
      })
    );
  });

  test('paragraph-lg-default correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-lg-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '20px',
        lineHeight: '32px',
      })
    );
  });

  test('paragraph-md-default correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-md-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '18px',
        lineHeight: '28px',
      })
    );
  });

  test('paragraph-xxl-italic correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xxl-italic'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'italic',
        fontWeight: '400',
        fontSize: '32px',
        lineHeight: '48px',
      })
    );
  });

  test('paragraph-xxl-italic correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xxl-italic'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'italic',
        fontWeight: '400',
        fontSize: '32px',
        lineHeight: '48px',
      })
    );
  });

  test('paragraph-xl-italic correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xl-italic'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'italic',
        fontWeight: '400',
        fontSize: '34px',
        lineHeight: '36px',
      })
    );
  });

  test('paragraph-xxl-bold correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xxl-bold'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '32px',
        lineHeight: '48px',
      })
    );
  });

  test('paragraph-xl-bold correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xl-bold'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '34px',
        lineHeight: '36px',
      })
    );
  });

  test('paragraph-xs-bold correct style json', async () => {
    expect(JSON.stringify(sizeText['paragraph-xs-bold'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.02em',
      })
    );
  });

  test('label-xl-default correct style json', async () => {
    expect(JSON.stringify(sizeText['label-xl-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '32px',
        lineHeight: '32px',
      })
    );
  });

  test('label-lg-default correct style json', async () => {
    expect(JSON.stringify(sizeText['label-lg-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '28px',
        lineHeight: '28px',
      })
    );
  });

  test('label-md-default correct style json', async () => {
    expect(JSON.stringify(sizeText['label-md-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '20px',
        lineHeight: '20px',
      })
    );
  });

  test('label-sm-default correct style json', async () => {
    expect(JSON.stringify(sizeText['label-sm-default'])).toBe(
      JSON.stringify({
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '18px',
        lineHeight: '18px',
      })
    );
  });

  test('uppercase-md-default correct style json', async () => {
    expect(JSON.stringify(sizeText['uppercase-md-default'])).toBe(
      JSON.stringify({
        textTransform: 'upperCase',
        letterSpacing: '0.05em',
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '20px',
        lineHeight: '20px',
      })
    );
  });
});
