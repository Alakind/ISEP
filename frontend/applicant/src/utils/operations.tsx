export default function scrollToAssignment(id: string) {
    const assignmentElement:HTMLElement = document.getElementById(id);
    console.log(assignmentElement);
    if (assignmentElement) {
        assignmentElement.scrollIntoView({behavior: "instant", block: "start"});
    }
}
