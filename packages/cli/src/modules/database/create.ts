import { Database, DeploymentTag, DatabaseStatus, ObjectID, ResourceType, DatabaseType } from '../../types'
import { Command } from 'commander';
import R from 'ramda';
import * as client from '../../library/client';
import renderDatabases from '../../library/render-databases';

const command = new Command('create')
  .description('Create a new database.')
  .argument('<name>', 'database name')
  .option('--type <type>', 'Mongodb or postgres, defaults to mongodb.')
  .option('-t, --tag <tag...>', 'Resource tags to help identify the database.')
  .action(async (name: string, options: {
    tag?: string[];
    type? : string;
  }) => {
    const id = new ObjectID();
    
    const tags = R.compose<
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
    )([...(options.tag || []), `name=${name}`]);

    const {dateTimeUpdated} = await client.createOrUpdate({
      type: ResourceType.Database,
      id,
      body: {
        tags,
        type: (options.type?.toLowerCase() === 'postgres')? DatabaseType.PSql : DatabaseType.MongoDb,
      }
    }) as Database;

    console.log(renderDatabases([
      {
        id,
        tags,
        status: DatabaseStatus.Creating,
        dateTimeUpdated,
      }
    ]));
  });

export default command;
