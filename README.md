# EventSync

[![repository: GitHub](https://img.shields.io/badge/repository-_GitHub-black)](https://github.com/Jugendhackt/eventsync/)
[![frontend: typescript](https://img.shields.io/badge/frontend-typescript-blue)](https://www.typescriptlang.org/)
[![framework: next.js](https://img.shields.io/badge/framework-next.js-darkblue)](https://nextjs.org/)
[![backend: python](https://img.shields.io/badge/backend-python-darkgreen)](https://www.python.org/)
[![webapi: fastapi](https://img.shields.io/badge/webapi-fastapi-turquoise)](https://fastapi.tiangolo.com/)
[![map: openstreetmap](https://img.shields.io/badge/map-openstreetmaps-green)](https://www.openstreetmap.de/)
[![linting: pylint](https://img.shields.io/badge/linting-pylint-yellowgreen)](https://github.com/pylint-dev/pylint)

### The idea
Our project - EventSync - provides a platform for event hosters and allows teens to find events in their area.

### Features
- Creation of events
- Admin panel
- User management system
- Interactive map
- Search/filter for events
- Like your favourite events

## Starting

This project is split into a Frontend and a Backend Server. 
Maker sure to have all the requirements installed 
and the configurations set before running both.

### Frontend

#### Initial

- Make sure that [bun](https://bun.sh/) is installed.
- Navigate to the [frontend](./frontend) directory.
- Install the requirements and run using:
  ```bash
  bun install
  bun run dev
  ```

#### Later

- Navigate to the [frontend](./frontend) directory.
- Launch:
  ```bash
  bun run dev
  ```

### Backend

#### Initial

- Make sure that [Python3](https://www.python.org/) is installed.
- Navigate to the [backend](./backend) directory.
- Set configurations in [config.yaml](./backend/config.yaml)
- Install the requirements and launch
  ```bash
  pip install -r requirements.txt
  python main.py
  ```

#### Later
- Navigate to the [backend](./backend) directory.
- Launch: 
  ```bash
  python main.py
  ```

## Contributors

- Tim Arnold (Mr. Frontend)
- Merlin Pritlove (Mr. API aka Mr. Database)
- Konstantin Winskowski (Mr. 422)
- Emil Engelbert (Mr. Datensatz)
- Julian (Ms. Präsentation)
