import R from 'ramda';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import Chance from 'chance';
import { generateFakeDeployment } from '../../__tests__/helpers';
import renderDeployments from './render-deployments';

const chance = new Chance();

describe('renderDeployments', () => {
  test('single deployment', () => {
    const deployment = generateFakeDeployment();
    const dateTimeUpdated = DateTime.now().minus({minutes: chance.minute() }).toJSDate();
    const output = renderDeployments([{
      ...deployment,
      dateTimeUpdated,
    }]);

    const lines = output.split('\n');

    expect(lines[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));
    expect(R.includes(deployment.id.toString(), lines[1])).toBeTruthy();
    expect(R.includes(deployment.tags[0].value, lines[1])).toBeTruthy();
    expect(R.includes(deployment.status, lines[1])).toBeTruthy();
    expect(R.includes(DateTime.fromJSDate(dateTimeUpdated).toRelative() as string, lines[1])).toBeTruthy();
  });

  test('multiple deployments', () => {
    const deployments = R.times(()=> {
      return {
        ...generateFakeDeployment(),
        dateTimeUpdated: DateTime.now().minus({minutes: chance.minute() }).toJSDate(),
      }
    }, 10);
    const output = renderDeployments(deployments);

    const lines = R.filter(R.identity as never, output.split('\n'));

    expect(lines.length).toBe(deployments.length + 1);
    expect(lines[0]).toBe(chalk.bold('DEPLOYMENT ID       NAME                STATUS              DATE UPDATED        '));

    for (const index of R.range(0, deployments.length)) {
      const deployment = deployments[index];
      const line = lines[index + 1];

      expect(R.includes(deployment.id.toString(), line)).toBeTruthy();
      expect(R.includes(deployment.tags[0].value, line)).toBeTruthy();
      expect(R.includes(deployment.status, line)).toBeTruthy();
      expect(R.includes(DateTime.fromJSDate(deployment.dateTimeUpdated).toRelative() as string, line)).toBeTruthy();
    }
  });
});
