import { EnvironmentVariable } from '../../types';
import R from 'ramda';

export default function(environment: string[]) {
  return R.compose<
    [string[]],
    (EnvironmentVariable | null)[],
    EnvironmentVariable[],
    EnvironmentVariable[]
  >(
    R.uniqBy<EnvironmentVariable, string>((item) => item.name.toLowerCase()),
    R.filter<EnvironmentVariable | null, EnvironmentVariable>(R.identity as never),
    R.map((item) => {
      const match = item.match(/^([a-zA-Z_][a-zA-Z0-9_]+)=(.*)$/);

      if (!match) {
        return null;
      }

      const [, name, value] = match;

      return {
        name: name.toUpperCase(),
        value
      } as EnvironmentVariable;
    }),
  )(environment);
}