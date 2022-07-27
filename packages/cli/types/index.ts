import ObjectID from './object-id';

export enum ObjectType {
  User = 0,
  Database = 1,
  Deployment = 2,
}

export enum ResourceType {
  Database = 'database',
  Deployment = 'deployment',
  User = 'user',
}

export type Resource = {
  id: ObjectID;
} & Record<string, unknown>;

export type DeploymentTag = {
  name: string;
  value: string;
};

export type EnvironmentVariable = {
  name: string;
  value: string;
};

export enum DeploymentStatus {
  Creating = 'CREATING',
  Ready = 'READY',
  Deploying = 'DEPLOYING',
  Updating = 'UPDATING',
  Running = 'RUNNING',
  Deleting = 'DELETING',
  Failed = 'FAILED',
  PendingCreate = 'PENDING_CREATE',
  PendingDeploy = 'PENDING_DEPLOY',
  PendingUpdate = 'PENDING_UPDATE',
}

export enum DatabaseStatus {
  Creating = 'CREATING',
  Ready = 'READY',
  Deploying = 'DEPLOYING',
  Running = 'RUNNING',
  Deleting = 'DELETING',
  Failed = 'FAILED',
}

export enum DatabaseType {
  MongoDb = 'MONGO_DB',
  PSql = 'POSTGRES_SQL',
}

export type Deployment = Resource & {
  tags: DeploymentTag[];
  status: DeploymentStatus;
  repository: string;
  directory?: string;
  environment?: EnvironmentVariable[];
  url?: string;
  dateTimeCreated: Date;
  dateTimeUpdated: Date;
};

export type Database = Resource & {
  tags: DeploymentTag[];
  status: DatabaseStatus;
  uri?: string;
  type: DatabaseType;
  dateTimeCreated: Date;
  dateTimeUpdated: Date;
};

export type User = Resource & {
  name: string;
  apiToken: string;
  dateTimeCreated: Date;
  dateTimeUpdated: Date;
};

export { default as ObjectID } from './object-id';