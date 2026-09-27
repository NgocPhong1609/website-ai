/** Window event the topbar dispatches to open/close the student sidebar drawer on small screens. */
export const MOBILE_SIDEBAR_EVENT = "student-sidebar:toggle";

export function toggleMobileSidebar() {
  window.dispatchEvent(new Event(MOBILE_SIDEBAR_EVENT));
}
