const WELCOME_KEY = "kv-onboarding-welcome-dismissed";
const CHECKLIST_KEY = "kv-onboarding-checklist";

export type ChecklistTask =
  | "note"
  | "snippet"
  | "bookmark"
  | "project"
  | "search"
  | "tag";

export type ChecklistState = {
  dismissed: boolean;
  completed: ChecklistTask[];
};

const DEFAULT_STATE: ChecklistState = {
  dismissed: false,
  completed: [],
};

function readChecklist(): ChecklistState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as ChecklistState) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function writeChecklist(state: ChecklistState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}

export function isWelcomeDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(WELCOME_KEY) === "1";
}

export function dismissWelcome() {
  if (typeof window === "undefined") return;
  localStorage.setItem(WELCOME_KEY, "1");
}

export function getChecklistState(): ChecklistState {
  return readChecklist();
}

export function dismissChecklist() {
  writeChecklist({ ...readChecklist(), dismissed: true });
}

export function completeChecklistTask(task: ChecklistTask) {
  const state = readChecklist();
  if (state.completed.includes(task)) return;
  writeChecklist({
    ...state,
    completed: [...state.completed, task],
  });
}

export const CHECKLIST_TASKS: {
  id: ChecklistTask;
  label: string;
  href: string;
}[] = [
  { id: "note", label: "Create your first note", href: "/dashboard/notes?new=1" },
  { id: "snippet", label: "Save a code snippet", href: "/dashboard/snippets?new=1" },
  { id: "bookmark", label: "Add a bookmark", href: "/dashboard/bookmarks?new=1" },
  { id: "project", label: "Create a project", href: "/dashboard/projects" },
  { id: "search", label: "Try global search", href: "/dashboard/search" },
  { id: "tag", label: "Add a tag to an item", href: "/dashboard/notes" },
];
