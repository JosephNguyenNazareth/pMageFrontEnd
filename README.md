# pMage

## Download backend service

Download the backend project from `https://github.com/JosephNguyenNazareth/pMage`. Access to the project directory, to build the jar file
``` bash
mvn clean install
```

To run the jar file
``` bash
java -jar mage-0.0.1-SNAPSHOT.jar
```
The service will run at `http://localhost:8082` by default

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Usage
Click `Add Connector` on the navigator bar to add the new connector to pMage. User then indicate the configuration of both application and PMS.

The saved connector then appears on the dashboard. User can:
- Add the action linkage table. This action should be done before starting mornitoring the connector. The connector requires this table to detect the related task from the PMS.
- Start monitoring the connector
- Stop monitoring the connector
- Edit the connector configuration
- Delete the connector