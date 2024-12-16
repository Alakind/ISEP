# 4. Solution Strategy

## Communication
### Applicant-server <-> front-end
We tried to minimize the amount of api calls necessary without big loading times. 
For example we cashe answers while the client fills out the assessment.
So, when the client loads the questions, they also need to check if answers are cashed.
This results in two API calls standard after each other. This was combined by sending the cashed answers directly with the questions.
