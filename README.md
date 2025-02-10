# ISEP (University of Twente) - Asserberus (InfoSupport)

This project is executed for InfoSupport to make an application to let applicants that want to work at InfoSupport
take an assessment before the actual job interview. This main repository is part of 3 repositories (main, question,
and shared entities). The shared entities repository is used by both the main and the question repository to keep the
shared components synchronized, while the question repository can stay private. The main repository consist of the
management server with its respective front-end which is protected by Microsoft Authentication Library. This systems
manages the applicants with their invites and the InfoSupport users. The application should be deployed in Azure. The
applicant application can be accessed via an UUID as their personal access token. In the applicant application multiple
types of questions can be answered, such as multiple-choice, open, coding (e.g. SQL, Java, Python are supported).
The code and tests are executed on a separate server (execution/applicant server) within their own docker containers.

**Authors:** _A. Ivakin, J. Snoijer, J. Sweers, E. de Vree, and R. te Wierik_

## Contents

- [Links](#links)
- [Installation](#installation)
- [Development](#development)
- [Azure](#azure)
- [Contributing](#contributing)
- [License](#license)

## Links

- https://github.com/Alakind/ISEP.git (public)
- https://github.com/eefscheef/ISEP-shared-entities.git (public)
- https://github.com/eefscheef/ISEP-questions.git (private)

## Installation

1. Clone this repository and its submodules:
   ```bash
   git clone --recurse-submodules https://github.com/Alakind/ISEP.git
   ```
2. Navigate to the project directory
   ```bash
   cd <folder_name>
   ```
3. Install frontend dependencies (npm)
    1. Management
       ```bash
       cd ./frontend/management
       npm install
       ```
    2. Applicant (from management)
        ```bash
        cd ../../frontend/applicant
        npm install
       ```
4. Optional: Install backend dependencies
    - [Docker](https://docs.docker.com/engine/install/) needs to be installed for local PostGreSQL database development

## Development

Each time the shared entities repository has been updated. The following command needs to be
run in the main directory (not the shared-entities directory).

```bash
git submodule update
```

It can happen that the head becomes detached. In this case checkout the master head or the branch head you are
currently on for the shared entities repository.

Furthermore, to be able to use the question repository you need to modify the environment variables of your run
configuration of the springboot application of the management. The following information needs to be added

```txt
GITHUB_TOKEN=xxx;DB_USERNAME=xxx;DB_PASSWORD=xxx;MAIL_PASSWORD=xxx
```

For running the springboot servers the container with the PostGreSQL database needs to be started up first.

```bash
docker compose up
```

In case the database structure has been changed, the docker container needs to be restarted with the following and then started up again with the command above.

```bash 
docker compose down
```

To run the management server application locally with a local PostGreSQL database, use:

```bash
./gradlew run management-server:bootRun
```

and for the applicant/execution server

```bash
./gradlew run applicant-server:bootRun
```

## Azure

For production and development, the PostGreSQL database can be hosted on Azure. Some useful links to configure can be found down below:

Frontend":

- [Deploy React app to Azure App Service. Deploy website to Azure app service. azure website deployment](https://youtu.be/C5rtNyOHhnM?si=upET8fGyyTHeHPnr)
- [MSAL Azure AD Authentication with React](https://www.youtube.com/watch?v=6_wgB8GO1GM)
- [28-Deploy Web Application to Azure App Service using Github Actions](https://www.youtube.com/watch?v=Rp-TMHrwCn4)
- [Auth Made Easy: Connecting App Registrations in Azure](https://www.youtube.com/watch?v=rmXLC-8DGQg)
- [Auth Made Easy: Getting started with MSAL and React (w/ Vite and TypeScript)](https://www.youtube.com/watch?v=0HCOzB0noiI)
  Backend:
- [Securing Web API Data and Functionality using App Roles or Application Permissions in Azure MSAL](https://www.youtube.com/watch?v=cdpouU28Tzk&t=884s)

To use the azure application properties, use the following command to start the management server application

```bash
./gradlew run management-server:bootRun --args="--spring.profiles.active=azure"
```

## Contributing

1. Fork the repository.
2. Create your feature branch (git checkout -b feature-name).
3. Commit your changes (git commit -m 'Add feature').
4. Push to the branch (git push origin feature-name).
5. Open a pull request.

## License

This project is licensed under the APACHE License, see the [LICENSE](./LICENSE) file for details.
