# 4. Solution Strategy

- Separation of concerns by keeping the code component based. This will help with expandability and modularity. In the
  CSS styling this is taking a step further with the BEM naming convention in the frontend.

- Invite links are implemented with a UUID, so that applicants have their own personalized link. This is non-guessable
  and allows applicants to use the system securely without logging in, as the link is the identification part.
- Users on the management side have different roles. This denies interviewers and recruiters from performing
  administrator related actions, such as (accidentally) editing, deleting or adding users. Interviewers might not have
  the technical qualifications to be allowed to perform actions such as these.
- The design has left it open to expand this to API Keys. So that only specific calls can call the API, instead of evry
  part of the application. This should provide more secure communication between the fronted and backend as not every
  call is permitted.
- The design has left it open to expand security in the form of management authentication.

- Speed by not starting up new containers, but reusing containers. Separation of concerns of having two servers helps
  with speed as well. The dedicated code execution server helps with efficient code execution.

- For fast development we use a iterative development like Scrum. Where sprint goals are divided into trontand and
  backend.