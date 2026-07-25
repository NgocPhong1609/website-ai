export type FocusActionKind = "review" | "practice";

export interface IFocusArea {
  id: number;
  topic: string;
  accuracy: number;
  action: FocusActionKind;
}

export interface IActivityItem {
  label: string;
}

export interface IActivityGroup {
  day: string;
  items: IActivityItem[];
}
