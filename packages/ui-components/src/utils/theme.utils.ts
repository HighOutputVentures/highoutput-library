import { extendTheme as chakraExtendTheme } from '@chakra-ui/react';
import merge from 'lodash/merge';

import defaultTheme from '../theme';

export const extendTheme = (customTheme: any) =>
  chakraExtendTheme(merge(defaultTheme, customTheme));
