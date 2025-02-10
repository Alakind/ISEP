package ut.isep.management.service.solution

import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import ut.isep.management.model.entity.Assignment
import ut.isep.management.model.entity.Invite
import ut.isep.management.model.entity.SolvedAssignment
import ut.isep.management.model.entity.SolvedAssignmentId

@Entity
@DiscriminatorValue("TEST")
open class SolvedAssignmentTest(
    id: SolvedAssignmentId = SolvedAssignmentId(),
    invite: Invite? = null,
    assignment: Assignment? = null,

    @Column(columnDefinition = "text")
    open var test: String? = null,

    ) : SolvedAssignment(id, invite, assignment)