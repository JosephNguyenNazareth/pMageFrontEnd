# pMage

## Run backend service

When accessing `background` directory, there are 4 files in this folder
- `pmage-v2.jar`: the backend service
- `application.properties`: the configuration file for settting the 
  - `spring.data.mongodb.uri` : URI of the mongodb storing the data of the integrations. By default is my cloud mongodb uri. You can replace by your desired mongodb location (local or cloud)
  - `spring.data.mongodb.database` : Name of the database within the mongodb uri
  - `server.error.include-message` : if you want to see the message of the errors returned by the spring boot server, by default is `always`
  - `server.port` : the port of the backend service, by default is `8082`
  - `appconfig` : path to the file containing the configuration of applications in end-user workspace. By default, it is the same directory with `application.properties`.
  - `pmsconfig` : path to the file containing the configuration of process management systems in end-user workspace. By default, it is the same directory with `application.properties`.
- `app_config.json` : the file containing the configuration of applications in end-user workspace
- `pms_config.json` : the file containing the configuration of process management systems in end-user workspace


To run the backend service for pmage, at project's background directory
``` bash
java -jar pmage-v2.jar --spring.config.name=application
```

The backend service runs at `http://localhost:8082` by default

## Run frontend application

At project's root directory, to run the frontend pmage
```  bash
ng serve
```

The frontend pmage application runs at `http://localhost:4200/`.
The application will automatically reload if you change any of the source files.

## Usage
Click `Add Connector` on the navigator bar to add the new connector to pMage. User then indicate the configuration of both application and PMS.

The saved connector then appears on the dashboard. User can:
- Add the action linkage table. This action should be done before starting mornitoring the connector. The connector requires this table to detect the related task from the PMS.
- Start monitoring the connector
- Stop monitoring the connector
- Edit the connector configuration
- Delete the connector