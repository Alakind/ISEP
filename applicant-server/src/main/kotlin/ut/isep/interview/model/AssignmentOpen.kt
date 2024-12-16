package ut.isep.interview.model

class AssignmentOpen(
    id: Long,
    description: String,
    var answer: String?
) : Assignment(id, description)