export function scrollToAssignment(id: string) {
  const assignmentElement: HTMLElement | null = document.getElementById(id);
  if (assignmentElement) {
    assignmentElement.scrollIntoView({behavior: "instant", block: "start"});
  }
}

export function getTime(startSeconds: number): { hours: number, minutes: number, seconds: number } {
  const hours = Math.floor(startSeconds / 3600)
  const minutes = Math.floor(startSeconds % 3600 / 60)
  const seconds = Math.floor(startSeconds % 3600 % 60)
  return {hours, minutes, seconds};
}

export function formatTime(input: number): string {
  return input < 10 ? `0${input}` : `${input}`
}