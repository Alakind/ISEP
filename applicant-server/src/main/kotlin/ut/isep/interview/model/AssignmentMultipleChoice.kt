package ut.isep.interview.model

class AssignmentMultipleChoice(
    id: Long,
    description: String,
    var options: List<String>,
    var multipleChoice: Boolean,
    var answer: List<Int>?
) : Assignment(id, description)