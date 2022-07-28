# Requirements
## Deployment
* Your application should run or be served on **port 80**.
## Access Token
* Please contact the hovcli maintainers for the access token

# Usage

## Configure CLI
```
export HOVCLI_API_TOKEN=************
```

## Create deployment
### Go to your current project directory, make sure it was initialized with `git`.
```
cd go/to/your/project/directory
```

Run this command:
```
hovcli deployment create project-name --env PORT 80
```
> This will deploy the project given the current directory

### If you want to specify a remote repository, use `--repository`
```
hovcli deployment create project-name --repository git@github.com:HighOutputVentures/growthdeputy.git --env PORT 80
```
> This will default to your current directory

### If you want to specify a directory, use `--directory`
```
hovcli deployment create project-name --directory backend --env PORT 80
```
> This will default to your current project's repository

### Adding tags and environment variables
```
hovcli deployment create project-name --repository git@github.com:HighOutputVentures/growthdeputy.git --directory directory-name --env PORT=80 --env MONGODB_URI=mongodb://localhost --tag environment=production
```

## Retrieve all deployments
```
hovcli deployment ls
```
## Retrieve deployment details
```
hovcli deployment inspect z420ex24yj7r4
```
## Retrieve deployment logs
```
hovcli deployment logs z420ex24yj7r4
```
## Deploy specific branch or tag
```
hovcli deployment deploy z420ex24yj7r4 --tag v0.1.1
```
## Delete deployment
```
hovcli deployment delete z420ex24yj7r4
```

## Create Database
```
hovcli database create database_name
```
> Defaults to MongoDB

### Creating a database, choosing another database
```
hovcli database create database_name --type postgres
```

## Inspect database
```
hovcli database inspect <database-name-id>
```

## List database
```
hovcli database list
```

## Delete database
```
hovcli database delete <database-name-id>
```

# To Do
- [ ] dependency injection refactoring
- [ ] prevent invalid operations
- [ ] build environment
- [ ] identity and access control
- [ ] audit logs
- [ ] run-time logs
- [ ] filter deployments by tags
- [X] ~~automatic detection of the `--repository` and `--directory` parameters~~
