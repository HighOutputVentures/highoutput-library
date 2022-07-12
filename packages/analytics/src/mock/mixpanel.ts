import { Mixpanel } from 'mixpanel';
import { logger } from '../lib/logger';

export const mixpanelMock = <Mixpanel>(<unknown>{
  people: {
    set: (params: any): void => {
      logger.silly(params);

      return;
    },
  },
  track: (params: any): void => {
    logger.silly(params);

    return;
  },
});
