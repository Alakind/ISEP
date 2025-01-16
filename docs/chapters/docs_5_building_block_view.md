# 5. Building Block View

## 5.1. Whitebox Asserberus

***\<Overview Diagram>***
![Architecture diagram](/docs/arc42-explanation-template/images/architecture-with-context.png)

Motivation  
Components seperated by clear subsystems.

Contained Building Blocks

| Building Block                    | Description                                                                           |
|-----------------------------------|---------------------------------------------------------------------------------------|
| Applicant Frontend                | React and Typescript web application to render interface for applicants.              |
| Management Frontend               | React and Typescript web application to render interface for management.              |
| Management Server                 | Via a springboot application. Run on azure cloud.                                     |
| Code Execution Server             | Via a springboot application. Run on azure cloud.                                     |
| Code Execution Container          | Docker container used to run coding question code given by the code execution server. |
| User Database                     | PostgreSQL service run on azure cloud.                                                |
| Question Repo                     | Git repository containing questions and the history of them                           |
| Authentication Service (external) | InfoSupport system to login (Unimplemented)                                           |

Important Interfaces

STUB
 
*\<Description of important interfaces. EG Subsystems that don't need more in depth explanation>*

## 5.2. building Blocks Level 2

### 5.2.1. Applicant Frontend (Whitebox)

STUB

### 5.2.2. Management Frontend (Whitebox)

STUB

### 5.2.3. Management Server (Whitebox)

contains:

HTTP database: praat met verschillen
controllers: handles HTTP requests en use services aan
service: uses a repository that talks to database

*\(verplaats naar Level 3: service)* service repository is abstraction of JPH database.

STUB

### 5.2.4. Code execution Server (Whitebox)

STUB

### 5.2.5. Code execution Container (Whitebox)

STUB

### 5.2.6. User Database (Whitebox)

STUB

### 5.2.7. Question Repo (Whitebox)

contains:

pipeline: Checks questions and uploads to the database and only filename and ID

STUB

## 5.3. Level 3

STUB
