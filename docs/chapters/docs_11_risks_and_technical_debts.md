# 11. Risks and Technical Debts

### Executing code for own purposes on Execution Server

Creating endpoints for arbitrary code-execution brings risks. You of course do not
want that everyone can just initialize a container and run code in it. Someone
could use your entire server resources for own use. This risk could be mitigated
by only letting the management-server initialize containers. The management-server
will than only create a container when an applicant logs in. This container can only
be accessed by providing the UUID which is very hard to bruteforce. To prevent
applicants from executing code at all times. This UUID also should expire within a
reasonable time.

### Applicants Influencing each other

Code executed by one applicant should never influence the result of code executed
by another applicant. If applicants can influence each other's result, an unfair
competition will be created. To mitigate this risk, each applicant should get
their own execution environment with no way to break out of the execution environment.

### Questions leaked

Applicants get a limited time to answer the interview. If they beforehand know the
questions, they get an unfair advantage on other applicants. To mitigate this risk, 
the git repository managing the question must be private. Only the management-server
and the question maintainers should have access to it.
