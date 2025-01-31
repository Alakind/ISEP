# 3. System Scope and Context

![Architecture diagram](/docs/chapters/images/architecture-with-context.png)

The system stands mostly on its own, apart from the authentication service to log in employees of infoSupport. We have
left the gap open to implement this as we have no access to the auhtentication service.

The 5 types of actors use the system by using one of the 3 sub systems that have interfaces. Question Maintainers
connect to the question
repo to CRUD questions directly. This repository is solely for managing them and is lightweight. The questions are
retrieved from here by the management server so that the other actors can use the questions.

Recruiters, Admins and Interviewers use the Management frontend, whereas the applicant connects to the applicant
frontend to interact with the system. On the management frontend recruiters, admins, and interviewers can see applicant
results, invitation statuses, scores, and admin page. On the applicant page applicants can make an assessment once they
received an encrypted link from a recruiter.