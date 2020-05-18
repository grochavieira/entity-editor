# SWAMP Platform Services

![APM](https://img.shields.io/badge/swamp-v1.0.1-green.svg)

## Using the services 

To start use the services, simply clone this Repo on your desktop. After this, type the following command to start the compose.

```bash
docker-compose up -d
```

With this command the services must be started. At the end of the task, run the following command to execute.

```bash
docker-compose ps
```

The terminal must show something like this.

```bash
          Name                        Command               State                                        Ports
--------------------------------------------------------------------------------------------------------------------------------------------------
db-mongo                          docker-entrypoint.sh --bin ...   Up                      0.0.0.0:27017->27017/tcp
db-mysql                          docker-entrypoint.sh mysqld      Up                      0.0.0.0:3306->3306/tcp, 33060/tcp
fiware-draco                      ../scripts/start.sh              Up (health: starting)   10000/tcp, 0.0.0.0:5050->5050/tcp, 8080/tcp, 8443/tcp, 0.0.0.0:9090->9090/tcp
fiware-orion                      /usr/bin/contextBroker -fg ...   Up (health: starting)   0.0.0.0:1026->1026/tcp
grafana                           /run.sh                          Up                      0.0.0.0:3000->3000/tcp
swamp-platform_iot-agent-json_1   docker/entrypoint.sh --  c ...   Up                      0.0.0.0:4041->4041/tcp, 0.0.0.0:7896->7896/tcp
swamp-platform_iot-agent-ul_1     pm2-runtime bin/iotagent-u ...   Up (health: starting)   0.0.0.0:4042->4042/tcp, 0.0.0.0:7897->7897/tcp
swamp-sepa                        /bin/sh -c java -jar SEPAE ...   Up                      0.0.0.0:8000->8000/tcp, 0.0.0.0:9000->9000/tcp
swamp-virtuoso-db                 /bin/bash /virtuoso.sh           Up                      0.0.0.0:1111->1111/tcp, 0.0.0.0:8890->8890/tcp
```

## Services Configured

- Orion Context Broker 
- Mongo DB
- Draco
- MySQL 
- IoT-Agent Ultralight
- IoT-Agent JSON
- Virtuoso DB
- SEPA

![Services_Stack_Layers_FEI_v2 0 2](https://user-images.githubusercontent.com/9273551/59941981-f750f900-9434-11e9-95ec-8c03c8379574.png)



