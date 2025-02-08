# 6. Runtime View

## 6.1. Creating/Updating a question

![Creating A Question flow](/docs/chapters/images/question_creation.drawio.png)

The first pipeline triggers only on creation of a Pull Request (PR). The workflow finds 
which files in the question directory have commits that are not in the main branch, and 
feeds them to the validator. The validator will simply throw an exception and fail the
pipeline when a question file is impossible to parse, blocking the PR.

Next, if all the modified question files are valid, the question maintainers might decide
to merge the PR. This triggers the updater workflow. It feeds the changed question files 
to the AssessmentUpdater, which creates new assessments for all the questions that were
updated. If only a question body was changed, it suffices to just create a new assessment
with the latest commit hash. If a question was deleted, the updater simply creates new 
assessments without this assignment, and if an assignment was added, the updater uploads
the assignment's relevant details and inserts it in the new assessments. Next, the updater
inserts question IDs into the filenames of newly added questions if present, and then 
commits the changes if necessary. Finally, the latest commit hash is retrieved and added
to the assessments that were just modified, making the latest assignments available for 
calls by management-server.

## 6.2. Retrieving a section

![Retrieving a section flow](/docs/chapters/images/GetSectionFlow.png)

Retrieving the questions goes per section. With the applicant front-end requesting all 
the section ID's at the start of the assessment. Then when the applicant moves to a 
section, the front-end will request the questions of the management server. The management
server will retrieve the questions from the database and than retrieve cashed solutions, 
which can be empty. Then the section together with cashed solutions are returned to the front-end.

## 6.3. Creating an Applicant

![Creating an Applicant flow](/docs/chapters/images/CreatingApplicantFlow.png)

First an applicant has to be created and once it exists, an assessment can be assigned to 
the applicant. When an assasment is assigned, the management server retrieves the most
recent version of the questions from the question repository and saves them into the
database. This way, when questions change or get deleted in the repository, they are 
still available for the applicant and thus nothing can break. Also when the question gets
updated, the question will still be the same when you look at the answer of the applicant.

## 6.4. Code Execution

![Code execution flow](/docs/chapters/images/CodeExecutionFlowGeneral.png)

When the applicant starts the assessment with their unique URL, the code execution server 
will start a new code execution container which contains all required technology's for 
code execution. The applicant is provided an in browser IDE for editing code per coding 
assignment. The code can be tested by the applicant, there are unit tests available which
the client can view/edit and thus execute. Running the tests returns per test if it passed
or failed and if it failed, it returns the reason. At the end of the assessment, the 
Management server will execute the public unit-tests, the secret unit-tests and then the
containers are killed and cleaned up.