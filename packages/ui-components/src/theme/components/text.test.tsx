import '@testing-library/jest-dom';
import { sizeText } from './text';

describe('Text sizes values', () => {
  it('should renders input field form container', async () => {
    expect(sizeText['heading-web-1']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '80px',
      lineHeight: '88px',
      letterSpacing: '-0.02em',
    });

    expect(sizeText['heading-web-2']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '56px',
      lineHeight: '64px',
      letterSpacing: '-0.02em',
    });
    expect(sizeText['heading-web-3']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '40x',
      lineHeight: '44x',
      letterSpacing: '-0.02em',
    });
    expect(sizeText['heading-web-4']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '32x',
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    });
    expect(sizeText['heading-web-5']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '24px',
      lineHeight: '28px',
      letterSpacing: '-0.02em',
    });
    expect(sizeText['heading-web-6']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '-0.02em',
    });

    expect(sizeText['heading-mobile-1']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '44px',
      lineHeight: '48px',
      letterSpacing: '-0.012em',
    });
    expect(sizeText['paragraph-xxl-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '32px',
      lineHeight: '48px',
    });
    expect(sizeText['paragraph-xl-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '34px',
      lineHeight: '36px',
    });
    expect(sizeText['paragraph-lg-default']).toBe({
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '20px',
      lineHeight: '32px',
    });
    expect(sizeText['paragraph-md-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '18px',
      lineHeight: '28px',
    });
    expect(sizeText['paragraph-xxl-italic']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'italic',
      fontWeight: '400',
      fontSize: '32px',
      lineHeight: '48px',
    });
    expect(sizeText['paragraph-xl-italic']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'italic',
      fontWeight: '400',
      fontSize: '34px',
      lineHeight: '36px',
    });
    expect(sizeText['paragraph-xxl-bold']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '32px',
      lineHeight: '48px',
    });
    expect(sizeText['paragraph-xl-bold']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '34px',
      lineHeight: '36px',
    });

    expect(sizeText['paragraph-xs-bold']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.02em',
    });

    expect(sizeText['label-xl-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '32px',
      lineHeight: '32px',
    });

    expect(sizeText['label-lg-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '28px',
      lineHeight: '28px',
    });

    expect(sizeText['label-md-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '20px',
      lineHeight: '20px',
    });

    expect(sizeText['label-sm-default']).toBe({
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '18px',
      lineHeight: '18px',
    });

    expect(sizeText['uppercase-md-default']).toBe({
      textTransform: 'upperCase',
      letterSpacing: '0.05em',
      fontFamily: 'Helvetica Neue',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '20px',
      lineHeight: '20px',
    });
  });
});
``;
