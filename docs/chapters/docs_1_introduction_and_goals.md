# 1. Introduction and Goals

This document explains the design decision for the

## 1.1. Requirements Overview

All functional and non-functional requirements are listed down below:

### Stakeholder Analysis

- Applicants: They potentially want to work at Info Support and make a questionnaire as prerequisite of the interview process. Since the questionnaire program is the first software they interact
  with. It needs to leave a good impression on the technical capabilities of Info Support, as potentially new developers want to work at a place where it gives the impression that software is up to industrial standards.
- Recruiters: Employees which don’t need a technical background, but can manage applicants statuses and invites.
- Interviewer: Employee with a technical background who conducts the interview after the applicant has completed the questionnaire. The interviewer uses the results of the applicant during the
  interview.
- Question maintainers: Employees who maintain the questions in the repository, by updating, reviewing and deleting them. There is overlap between question maintainers and interviewers.
- Developers: An Info Support employee with a technical background in Azure, TypeScript and/or Java

### Functional Requirements

#### Must have

##### Priority level 1

1. Applicants must be able to make multiple choice questions.
2. Applicants must be able to make code-related questions by edititing or reviewing code.
   <!-- 2. Applicants must be able to work in a browser based code editor. -->
   <!-- 3. Applicants must be able to make code review questions. -->
   <!-- 4. Applicants must be able to execute an SQL queries for SQL questions and validate the result. -->
3. Applicants that are making a questionnaire must not be bothered by question maintainers making changes.
4. Recruiters must be able to check the status of the applicant interview questionnaire.
5. Recruiters must be able to send an invitation link to applicants.
6. Recruiters must be able to see applicant results (TODO: research best option PDF or HTML, PDF in DevSkiller).
   - Interviewers must be able to view the submitted applicants’ questionnaire results. (FIXME: same as Priority 1 point 8)
7. Recruiters must be able to make a new applicant user and assign them a questionnaire with their preferred coding languages (???maybe a minimum amount).
<!-- 10. Interviewers and recruiters must be able to log in with their Info Support account. -->
8. Interviewers must be able to see the difference between the starting code and the submitted code.
9. Question maintainers must be able to create, review, update, and delete questions to a repository in Markdown.
10. The main repository must be able to send a pull request to the question repository to retrieve the new questions.

##### Priority level 2

1. Applicants must be able to have access to IntelliSense capabilities when working on code questions.
2. Applicants must be able to see diagrams (e.g. of a database schema) in a question.
3. Applicants must not able to take the questionnaire again and thus not being able to use the link again.
   <!-- 4. Applicants must be able to add comments to lines in code review questions. (FIXME: partially the same as priority 1 point 3) -->
   <!-- 5. Recruiters must be able to edit the status of the applicant interview questionnaire. (In case of error, applicant not being able to finish their questionnaire) -->
4. Recruiters should be able to edit the status and send new invite links to existing applicants.
5. Recruiters must be able to set the assessment deadline, with a default of 7 days.
6. Question maintainers must be able to create example answers for the questions.
7. Question maintainers must be able to compose questionnaires from the available questions.
8. The question repository should have a pipeline that checks for valid Markdown formatting.

##### Priority level 3

1. Applicants must be able to add additional unit tests.
2. Applicants must be able to make the questionnaire in any order with the specified order by the screener. (TODO: Might be that multiple choice questions will be closed after taking them)
3. Recruiters must be able to set an expiration date for the questionnaire.

##### Priority level 4

1. Applicants must have a time limit for the entire questionnaire.
<!-- 2. Applicants must only be able to see their questionnaire completion time after questionnaire submission. -->
2. Recruiters must be able to include or exclude some questions in the selected questionnaire.
   <!-- 4. Recruiters must be able to see the time per section of applicants. -->
   <!-- 5. Question maintainers must be able to mark a question as an open question. -->
3. Each section must have a suggested time limit. If it is exceeded, the time is visually marked in red.

#### Should have

1. Recruiters must be able to filter the applicants on:
   - name, email or token;
   - invitation date;
   - the selected interview questionnaire;
   - tags;
   - scores;
2. The system should have the ability to assign different roles such as recruiter and code reviewer.

#### Could have

1. Recruiters could be able to see if applicants paste a large amount of text (recognizing cheaters).
2. Recruiters could be able to see if applicants switch to another tab (recognizing cheaters).
<!-- 3. The system could have a note-taking functionality for each question. Flag it in the interface. -->
3. Recruiters could be able to see a timeline of various steps of the recruitment process.
4. Recruiters could be able to filter various candidates based on status aspects such as total, waiting for answers, evaluation, etc.

#### Won't have

<!-- 1. Question maintainers will not be able to create open questions. -->

### Non-functional Requirements

#### Must have

1. Applicants must be able to switch between dark mode and light mode. (dark mode default)
2. The program must be able to be maintained by Info Support developers. (code language C#, Java, Typescript, React, Vue, Angular)
3. Project must be provided with documentation in ARC 42 format.
<!-- 4. Developers must write down their architectural decisions. -->
4. The system must have links be long hashes that are not guessable (security).
5. The system must store the state of the current questions and the answers, in case the questins are changed in a future test.
<!-- 7. The system must not apply changes to open and closed questionnaires if the used questions are changed. -->
6. The system must be able to respond to the validity/results of tests within +-2 seconds for a quick response time. (2 second could be changed to what the standard is at Info Support.
7. The system must support Python, C#, SQL, Java, and JavaScript within the coding questions.
8. The front-end must have a wide array of browser support (Chrome, Edge, Firefox, Opera, Safari).
<!-- 11. The system must have interfaces in English. -->

#### Should have

1. The interface for the questionnaire should have a user acceptance of at least 80%. User acceptance is reached by testing with potential users in a usability test group.
2. The interface for the recruiters should have a user acceptance of at least 80%.
3. The results overview should be concise and readable.
4. Then front-end should perform fast, no page or feature should stall for more than 5 seconds.
5. The questionnaire environment should be hosted in the cloud (e.g. Microsoft Azure).
<!-- 6. Applicants should only be able to make the questionnaire in a desktop browser (security). (TODO: review by Jurre as mobile touch events can create unprecedented errors.) -->

#### Could have

1. None

#### Won't have

1. None

## 1.2. Quality Goals

## 1.3. Stakeholders

| Role/Name   | Contact        | Expectations       |
| ----------- | -------------- | ------------------ |
| _\<Role-1>_ | _\<Contact-1>_ | _\<Expectation-1>_ |
| _\<Role-2>_ | _\<Contact-2>_ | _\<Expectation-2>_ |
