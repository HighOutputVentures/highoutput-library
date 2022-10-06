import '@testing-library/jest-dom';
import { sizeText } from './text';

interface ExpectedTextSize {
  textTransform?: string;
  letterSpacing?: string;
  fontFamily?: string;
  fontStyle: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
}

type SizeTypes =
  | 'heading-web-1'
  | 'heading-web-2'
  | 'heading-web-3'
  | 'heading-web-4'
  | 'heading-web-5'
  | 'heading-web-6'
  | 'heading-mobile-1'
  | 'heading-mobile-2'
  | 'heading-mobile-3'
  | 'heading-mobile-4'
  | 'heading-mobile-5'
  | 'heading-mobile-6'
  | 'paragraph-xxl-default'
  | 'paragraph-xl-default'
  | 'paragraph-lg-default'
  | 'paragraph-md-default'
  | 'paragraph-sm-default'
  | 'paragraph-xs-default'
  | 'paragraph-xxs-default'
  | 'paragraph-xxl-italic'
  | 'paragraph-xl-italic'
  | 'paragraph-lg-italic'
  | 'paragraph-md-italic'
  | 'paragraph-sm-italic'
  | 'paragraph-xs-italic'
  | 'paragraph-xxs-italic'
  | 'paragraph-xxl-bold'
  | 'paragraph-xl-bold'
  | 'paragraph-lg-bold'
  | 'paragraph-md-bold'
  | 'paragraph-sm-bold'
  | 'paragraph-xs-bold'
  | 'paragraph-xxs-bold'
  | 'label-xl-default'
  | 'label-lg-default'
  | 'label-md-default'
  | 'label-sm-default'
  | 'label-xs-default'
  | 'label-xxs-default'
  | 'label-xl-italic'
  | 'label-lg-italic'
  | 'label-md-italic'
  | 'label-sm-italic'
  | 'label-xs-italic'
  | 'label-xxs-italic'
  | 'label-xl-medium'
  | 'label-lg-medium'
  | 'label-md-medium'
  | 'label-sm-medium'
  | 'label-xs-medium'
  | 'label-xxs-medium'
  | 'label-xl-bold'
  | 'label-lg-bold'
  | 'label-md-bold'
  | 'label-sm-bold'
  | 'label-xs-bold'
  | 'label-xxs-bold'
  | 'uppercase-xl-default'
  | 'uppercase-lg-default'
  | 'uppercase-md-default'
  | 'uppercase-sm-default'
  | 'uppercase-xs-default'
  | 'uppercase-xxs-default'
  | 'uppercase-xl-italic'
  | 'uppercase-lg-italic'
  | 'uppercase-md-italic'
  | 'uppercase-sm-italic'
  | 'uppercase-xs-italic'
  | 'uppercase-xxs-italic'
  | 'uppercase-xl-medium'
  | 'uppercase-lg-medium'
  | 'uppercase-md-medium'
  | 'uppercase-sm-medium'
  | 'uppercase-xs-medium'
  | 'uppercase-xxs-medium'
  | 'uppercase-xl-bold'
  | 'uppercase-lg-bold'
  | 'uppercase-md-bold'
  | 'uppercase-sm-bold'
  | 'uppercase-xs-bold'
  | 'uppercase-xxs-bold'
  | 'monospace-xl-default'
  | 'monospace-lg-default'
  | 'monospace-md-default'
  | 'monospace-sm-default'
  | 'monospace-xs-default'
  | 'monospace-xxs-default'
  | 'monospace-xl-italic'
  | 'monospace-lg-italic'
  | 'monospace-md-italic'
  | 'monospace-sm-italic'
  | 'monospace-xs-italic'
  | 'monospace-xxs-italic'
  | 'monospace-xl-medium'
  | 'monospace-lg-medium'
  | 'monospace-md-medium'
  | 'monospace-sm-medium'
  | 'monospace-xs-medium'
  | 'monospace-xxs-medium'
  | 'monospace-xl-bold'
  | 'monospace-lg-bold'
  | 'monospace-md-bold'
  | 'monospace-sm-bold'
  | 'monospace-xs-bold'
  | 'monospace-xxs-bold'
  | 'button-default'
  | 'button-uppercase';

describe('Test text sizes values', () => {
  const TestTextSize = (size: SizeTypes, expected: ExpectedTextSize) => {
    test(`${size} correct style json`, async () => {
      expect(JSON.stringify(sizeText[size])).toBe(JSON.stringify(expected));
    });
  };

  const headingweb1 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '80px',
    lineHeight: '88px',
    letterSpacing: '-0.02em',
  };
  const headingweb2 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '56px',
    lineHeight: '64px',
    letterSpacing: '-0.02em',
  };
  const headingweb3 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '40px',
    lineHeight: '44px',
    letterSpacing: '-0.02em',
  };
  const headingweb4 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '36px',
    letterSpacing: '-0.02em',
  };
  const headingweb5 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '28px',
    letterSpacing: '-0.02em',
  };
  const headingweb6 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: '-0.02em',
  };
  const headingmobile1 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '44px',
    lineHeight: '48px',
    letterSpacing: '-0.012em',
  };
  const headingmobile2 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '36px',
    letterSpacing: '-0.012em',
  };
  const headingmobile3 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '28px',
    letterSpacing: '-0.012em',
  };
  const headingmobile4 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: '-0.012em',
  };
  const headingmobile5 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '20px',
    letterSpacing: '-0.012em',
  };
  const headingmobile6 = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '18px',
    letterSpacing: '-0.012em',
  };
  const paragraphxxldefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '48px',
  };
  const paragraphxldefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '34px',
    lineHeight: '36px',
  };
  const paragraphlgdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '32px',
  };
  const paragraphmddefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '28px',
  };
  const paragraphsmdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
  };
  const paragraphxsdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
  };
  const paragraphxxsdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
  };
  const paragraphxxlitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '48px',
  };
  const paragraphxlitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '34px',
    lineHeight: '36px',
  };
  const paragraphlgitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '32px',
  };
  const paragraphmditalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '28px',
  };
  const paragraphsmitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.02em',
  };
  const paragraphxsitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.02em',
  };
  const paragraphxxsitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.02em',
  };
  const paragraphxxlbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '48px',
  };
  const paragraphxlbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '34px',
    lineHeight: '36px',
  };
  const paragraphlgbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '32px',
  };
  const paragraphmdbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '28px',
  };
  const paragraphsmbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.02em',
  };
  const paragraphxsbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.02em',
  };
  const paragraphxxsbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.02em',
  };
  const labelxldefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const labellgdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const labelmddefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const labelsmdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const labelxsdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const labelxxsdefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
  };
  const labelxlitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const labellgitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const labelmditalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const labelsmitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const labelxsitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const labelxxsitalic = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
  };
  const labelxlmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const labellgmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const labelmdmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const labelsmmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const labelxsmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const labelxxsmedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
  };
  const labelxlbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const labellgbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const labelmdbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const labelsmbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const labelxsbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const labelxxsbold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
  };
  const uppercasexldefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const uppercaselgdefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const uppercasemddefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const uppercasesmdefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const uppercasexsdefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const uppercasexxsdefault = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const uppercasexlitalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const uppercaselgitalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const uppercasemditalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const uppercasesmitalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const uppercasexsitalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const uppercasexxsitalic = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const uppercasexlmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const uppercaselgmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const uppercasemdmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const uppercasesmmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const uppercasexsmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const uppercasexxsmedium = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const uppercasexlbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const uppercaselgbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const uppercasemdbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const uppercasesmbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const uppercasexsbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const uppercasexxsbold = {
    textTransform: 'upperCase',
    letterSpacing: '0.05em',
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const monospacexldefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const monospacelgdefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const monospacemddefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const monospacesmdefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const monospacexsdefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const monospacexxsdefault = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const monospacexlitalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const monospacelgitalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const monospacemditalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const monospacesmitalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const monospacexsitalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const monospacexxsitalic = {
    fontFamily: 'SF Mono',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const monospacexlmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const monospacelgmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const monospacemdmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const monospacesmmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const monospacexsmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const monospacexxsmedium = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const monospacexlbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '32px',
  };
  const monospacelgbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '28px',
    lineHeight: '28px',
  };
  const monospacemdbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '20px',
  };
  const monospacesmbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '18px',
  };
  const monospacexsbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '14px',
  };
  const monospacexxsbold = {
    fontFamily: 'SF Mono',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '12px',
  };
  const buttondefault = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '24px',
  };
  const buttonuppercase = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '18px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  TestTextSize('heading-web-1', headingweb1);
  TestTextSize('heading-web-2', headingweb2);
  TestTextSize('heading-web-3', headingweb3);
  TestTextSize('heading-web-4', headingweb4);
  TestTextSize('heading-web-5', headingweb5);
  TestTextSize('heading-web-6', headingweb6);

  TestTextSize('heading-mobile-1', headingmobile1);
  TestTextSize('heading-mobile-2', headingmobile2);
  TestTextSize('heading-mobile-3', headingmobile3);
  TestTextSize('heading-mobile-4', headingmobile4);
  TestTextSize('heading-mobile-5', headingmobile5);
  TestTextSize('heading-mobile-6', headingmobile6);

  TestTextSize('paragraph-xxl-default', paragraphxxldefault);
  TestTextSize('paragraph-xl-default', paragraphxldefault);
  TestTextSize('paragraph-lg-default', paragraphlgdefault);
  TestTextSize('paragraph-md-default', paragraphmddefault);
  TestTextSize('paragraph-sm-default', paragraphsmdefault);
  TestTextSize('paragraph-xs-default', paragraphxsdefault);
  TestTextSize('paragraph-xxs-default', paragraphxxsdefault);
  TestTextSize('paragraph-xxl-italic', paragraphxxlitalic);
  TestTextSize('paragraph-xl-italic', paragraphxlitalic);
  TestTextSize('paragraph-lg-italic', paragraphlgitalic);
  TestTextSize('paragraph-md-italic', paragraphmditalic);
  TestTextSize('paragraph-sm-italic', paragraphsmitalic);
  TestTextSize('paragraph-xs-italic', paragraphxsitalic);
  TestTextSize('paragraph-xxs-italic', paragraphxxsitalic);
  TestTextSize('paragraph-xxl-bold', paragraphxxlbold);
  TestTextSize('paragraph-xl-bold', paragraphxlbold);
  TestTextSize('paragraph-lg-bold', paragraphlgbold);
  TestTextSize('paragraph-md-bold', paragraphmdbold);
  TestTextSize('paragraph-sm-bold', paragraphsmbold);
  TestTextSize('paragraph-xs-bold', paragraphxsbold);
  TestTextSize('paragraph-xxs-bold', paragraphxxsbold);

  TestTextSize('label-xl-default', labelxldefault);
  TestTextSize('label-lg-default', labellgdefault);
  TestTextSize('label-md-default', labelmddefault);
  TestTextSize('label-sm-default', labelsmdefault);
  TestTextSize('label-xs-default', labelxsdefault);
  TestTextSize('label-xxs-default', labelxxsdefault);
  TestTextSize('label-xl-italic', labelxlitalic);
  TestTextSize('label-lg-italic', labellgitalic);
  TestTextSize('label-md-italic', labelmditalic);
  TestTextSize('label-sm-italic', labelsmitalic);
  TestTextSize('label-xs-italic', labelxsitalic);
  TestTextSize('label-xxs-italic', labelxxsitalic);
  TestTextSize('label-xl-medium', labelxlmedium);
  TestTextSize('label-lg-medium', labellgmedium);
  TestTextSize('label-md-medium', labelmdmedium);
  TestTextSize('label-sm-medium', labelsmmedium);
  TestTextSize('label-xs-medium', labelxsmedium);
  TestTextSize('label-xxs-medium', labelxxsmedium);
  TestTextSize('label-xl-bold', labelxlbold);
  TestTextSize('label-lg-bold', labellgbold);
  TestTextSize('label-md-bold', labelmdbold);
  TestTextSize('label-sm-bold', labelsmbold);
  TestTextSize('label-xs-bold', labelxsbold);
  TestTextSize('label-xxs-bold', labelxxsbold);

  TestTextSize('uppercase-xl-default', uppercasexldefault);
  TestTextSize('uppercase-lg-default', uppercaselgdefault);
  TestTextSize('uppercase-md-default', uppercasemddefault);
  TestTextSize('uppercase-sm-default', uppercasesmdefault);
  TestTextSize('uppercase-xs-default', uppercasexsdefault);
  TestTextSize('uppercase-xxs-default', uppercasexxsdefault);
  TestTextSize('uppercase-xl-italic', uppercasexlitalic);
  TestTextSize('uppercase-lg-italic', uppercaselgitalic);
  TestTextSize('uppercase-md-italic', uppercasemditalic);
  TestTextSize('uppercase-sm-italic', uppercasesmitalic);
  TestTextSize('uppercase-xs-italic', uppercasexsitalic);
  TestTextSize('uppercase-xxs-italic', uppercasexxsitalic);
  TestTextSize('uppercase-xl-medium', uppercasexlmedium);
  TestTextSize('uppercase-lg-medium', uppercaselgmedium);
  TestTextSize('uppercase-md-medium', uppercasemdmedium);
  TestTextSize('uppercase-sm-medium', uppercasesmmedium);
  TestTextSize('uppercase-xs-medium', uppercasexsmedium);
  TestTextSize('uppercase-xxs-medium', uppercasexxsmedium);
  TestTextSize('uppercase-xl-bold', uppercasexlbold);
  TestTextSize('uppercase-lg-bold', uppercaselgbold);
  TestTextSize('uppercase-md-bold', uppercasemdbold);
  TestTextSize('uppercase-sm-bold', uppercasesmbold);
  TestTextSize('uppercase-xs-bold', uppercasexsbold);
  TestTextSize('uppercase-xxs-bold', uppercasexxsbold);

  TestTextSize('monospace-xl-default', monospacexldefault);
  TestTextSize('monospace-lg-default', monospacelgdefault);
  TestTextSize('monospace-md-default', monospacemddefault);
  TestTextSize('monospace-sm-default', monospacesmdefault);
  TestTextSize('monospace-xs-default', monospacexsdefault);
  TestTextSize('monospace-xxs-default', monospacexxsdefault);
  TestTextSize('monospace-xl-italic', monospacexlitalic);
  TestTextSize('monospace-lg-italic', monospacelgitalic);
  TestTextSize('monospace-md-italic', monospacemditalic);
  TestTextSize('monospace-sm-italic', monospacesmitalic);
  TestTextSize('monospace-xs-italic', monospacexsitalic);
  TestTextSize('monospace-xxs-italic', monospacexxsitalic);
  TestTextSize('monospace-xl-medium', monospacexlmedium);
  TestTextSize('monospace-lg-medium', monospacelgmedium);
  TestTextSize('monospace-md-medium', monospacemdmedium);
  TestTextSize('monospace-sm-medium', monospacesmmedium);
  TestTextSize('monospace-xs-medium', monospacexsmedium);
  TestTextSize('monospace-xxs-medium', monospacexxsmedium);
  TestTextSize('monospace-xl-bold', monospacexlbold);
  TestTextSize('monospace-lg-bold', monospacelgbold);
  TestTextSize('monospace-md-bold', monospacemdbold);
  TestTextSize('monospace-sm-bold', monospacesmbold);
  TestTextSize('monospace-xs-bold', monospacexsbold);
  TestTextSize('monospace-xxs-bold', monospacexxsbold);

  TestTextSize('button-default', buttondefault);
  TestTextSize('button-uppercase', buttonuppercase);
});
