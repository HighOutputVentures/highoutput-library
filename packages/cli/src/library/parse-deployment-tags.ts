import { DeploymentTag } from '../../types';
import R from 'ramda';

export default function(tags: string[]) {
  return R.compose<
    [string[]],
    (DeploymentTag | null)[],
    DeploymentTag[],
    DeploymentTag[]
  >(
    R.uniqBy<DeploymentTag, string>((item) => item.name.toLowerCase()),
    R.filter<DeploymentTag | null, DeploymentTag>(R.identity as never),
    R.map((item) => {
      const match = item.match(/^([a-zA-Z_][a-zA-Z0-9_]+)=(.*)$/);

      if (!match) {
        return null;
      }

      const [, name, value] = match;

      return {
        name: name.toLowerCase(),
        value
      } as DeploymentTag;
    }),
  )(tags);
}