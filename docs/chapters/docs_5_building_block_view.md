# 5. Building Block View

## 5.1. Whitebox Asserberus

***\<Overview Diagram>***
![Architecture diagram](/docs/chapters/images/architecture-with-context.png)

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

## 5.2. building Blocks Level 2

### 5.2.1. Applicant Frontend (Whitebox)

![Applicant Frontend diagram](/docs/chapters/images/applicant-front-end.png)

| Building Block           | Description                                                                                                                                                                                                                                                                                                   |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Welcome Page             | Page for default page containing summary information and quicklinks.                                                                                                                                                                                                                                          |
| Section 1..n             | A section with questions                                                                                                                                                                                                                                                                                      |
| Question Picker          | Allows for quick navigation to questions by clicking on the question or section number. On t0op of switching to the page it scroll to the clicked question.                                                                                                                                                   |
| Finish Page              | Page for displaying                                                                                                                                                                                                                                                                                           |
| Multiple Choice Question | Question where applicant has to answer 1 or more answers.                                                                                                                                                                                                                                                     |
| Open Choice Question     | Question where the applicant has to write an answer. These have to be graded manually.                                                                                                                                                                                                                        |
| Coding Question          | Question where the applicant has to write code from an original file. Comments are written in the code as comments. There are tests u8nderneath the coding block, which the results of only public tests are displayed underneath. Secret test results stay hidden and can only be viewed on management side. |

### 5.2.2. Management Frontend (Whitebox)

![Managment Frontend diagram](/docs/chapters/images/management-server.png)

Contained Building Blocks:

| Building Block | Description                                                          |
|----------------|----------------------------------------------------------------------|
| Dashboard      | Page for default page containing summary information and quicklinks. |
| Applicants     | Page for CRUD-ing applicants and invitations.                        |
| Users          | Page for CRUD-ing other managers and their roles.                    |
| Login          | Page for logging with the authentication service                     |

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

## 5.3.1. Dashboard

![Dashboard diagram](/docs/chapters/images/dashboard.png)

| Building Block | Description                                                                                                                                                                                                                                          |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Statistics     | A flex element containing 3 basic statistics. # of total applicants, # of invites expiring in 2 days, # of invites that have expired.                                                                                                                |
| Quicklinks     | A small element in which useful resource could be supplied to users. Examples are documentation, user manual, or help/contact link.                                                                                                                  |
| Tables         | Tables based on the statistics, providing extra information. Top table is filtered by the newest assessments that are finished. Second table is filtered by invitations that expire in 2 days. Bottom table is filtered on invites that are expired. |

The dashboard is designed with showing statistics and areas of needed action for recruiters in particular.

## 5.3.2. Applicants

![Architecture diagram](/docs/chapters/images/applicants.png)
The arrows in the image visualize the flow between the building blocks.

| Building Block             | Description                                                                                                                                                                                                                                                                                                             |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| applicants                 | Contains a button to add a new user. Additionally contains a table for showing all users that can be sorted and filtered.                                                                                                                                                                                               |
| applicants/add             | A simple page for adding a new user to the database. Fields to be filled are name, email and coding language.                                                                                                                                                                                                           |
| applicants/{id}/info       | View of applicant information. Specifically it shows their name, email and coding language along with their invites. The results and summary are tabbed in case of multiple assessments. The skills are retrieved from the sections. The assessment summary is populated with the sections and corresponding questions. |
| applicants/{id}/invite/add |                                                                                                                                                                                                                                                                                                                         |
| Multiple Choice Question   | Question where applicant has answered 1 or more answers. If multiple answers are correct and one is wrong, all points are deducted.                                                                                                                                                                                     |
| Open Choice Question       | Question where the applicant has written their answer. These have to be graded manually.                                                                                                                                                                                                                                |
| Coding Question            | Question where the applicant has added and/or removed code from an original file. Comments are written in the code as comments. The results of the tests, both public and hidden, are displayed underneath.                                                                                                             |

- applicants
    - Table (rows, name, email, statuses, score, can all be sorted) below the table you can select more rows. Limited
      amount of entries per page (default is 10, can be changed). You can filter on name, email and both. backend
      Functionality for sorting on dates, statuses exists n the endpoint.
    - personal applicant page (you get here by clicking on name)
        - details, invites (horizontal)
        - results overview (score, comparison and skills) (horizontal)
        - Summary assessment (by section) (tabs for multiple)
    - add applicant button
        - details: you add then it just creates the user if you press "add and invite" then you are redirected to
          InviteAdd page
            - invite add: Invite details (Choose assessment, send mail, set expiration date, additional mail message.

## 5.3.3. Users

![Users diagram](/docs/chapters/images/users.png)

This page shows a table of all users and their security levels. See table below for permission specifics. The different
security levels are Interviewer, Recruiter, Admin and NULL (Which it is defaulted to when a new user logs in). An admin
can change a role of every level of user by clicking on their role in the table and selecting their new one from the
dropdown menu. Furthermore, an Admin can batch select users and with the action button batch delete users if necessary.

![Management users permission table](/docs/chapters/images/management-permission-table.png)

## 5.3.4. Login

Whenever a user is not logged in they will be shown the login page. They can log in with
their Microsoft account by selecting an account and entering their password. Once they are successfully
authenticated they will be shown the dashboard of the system. Depending on the role they are allowed
to see some of the pages.

To log out the user has to click on their name/profile in the header and click log out. This will redirect
to the Microsoft authentication service™ where they can select the account to log out. After this they
are returned to the log in screen.

![Users diagram](/docs/chapters/images/log-in-and-out.png)
