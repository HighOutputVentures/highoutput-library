import Chance from "chance";
import generateDeployment from "../../__tests__/helpers.next/generate-deployment";
import renderDeployment from "./render-deployment";

export const chance = new Chance();
describe('renderDeployment', () => {
  test('deployment', () => {
    const deployment = { 
      ...generateDeployment(), 
      tags:[
        { name: 'name', value: 'deployment' },
        { name: 'environment', value: 'production'},
      ],
    };

    const output = renderDeployment(deployment);

    expect(output.includes(deployment.id.toString())).toBeTruthy();
    expect(output.includes(deployment.status)).toBeTruthy();
    expect(output.includes(deployment.url!)).toBeTruthy();
    expect(output.includes(deployment.repository)).toBeTruthy();
    expect(output.includes(deployment.directory!)).toBeTruthy();
    expect(output.includes(deployment.dateTimeCreated.toISOString())).toBeTruthy();
    expect(output.includes(deployment.dateTimeUpdated.toISOString())).toBeTruthy();
  });

});
