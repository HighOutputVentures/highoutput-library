import Chance from "chance";
import generateDatabase from "../../__tests__/helpers.next/generate-database";
import renderDatabase from "./render-database";

export const chance = new Chance();
describe('renderDatabase', () => {
  test('database', () => {
    const database = { 
      ...generateDatabase(), 
      tags:[
        { name: 'name', value: 'database' },
      ],
    };

    const output = renderDatabase(database);

    expect(output.includes(database.id.toString())).toBeTruthy();
    expect(output.includes(database.status)).toBeTruthy();
    expect(output.includes(database.uri!)).toBeTruthy();
    expect(output.includes(database.dateTimeCreated.toISOString())).toBeTruthy();
    expect(output.includes(database.dateTimeUpdated.toISOString())).toBeTruthy();
  });

});
