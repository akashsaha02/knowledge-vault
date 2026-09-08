function readStorage(keys: string[]): string | null {
  if (typeof window === "undefined") return null;
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value != null) return value;
  }
  return null;
}

function writeStorage(primary: string, value: string, legacy?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(primary, value);
  if (legacy) localStorage.removeItem(legacy);
}

const WELCOME_KEY = "nook-onboarding-welcome-dismissed";
const WELCOME_KEY_LEGACY = "kv-onboarding-welcome-dismissed";
const CHECKLIST_KEY = "nook-onboarding-checklist";
const CHECKLIST_KEY_LEGACY = "kv-onboarding-checklist";

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
    const raw = readStorage([CHECKLIST_KEY, CHECKLIST_KEY_LEGACY]);
    return raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as ChecklistState) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function writeChecklist(state: ChecklistState) {
  writeStorage(CHECKLIST_KEY, JSON.stringify(state), CHECKLIST_KEY_LEGACY);
}

export function isWelcomeDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return readStorage([WELCOME_KEY, WELCOME_KEY_LEGACY]) === "1";
}

export function dismissWelcome() {
  writeStorage(WELCOME_KEY, "1", WELCOME_KEY_LEGACY);
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
  { id: "note", label: "Create your first item", href: "/dashboard/notes?new=1" },
  { id: "bookmark", label: "Save something from the web", href: "/dashboard/bookmarks?new=1" },
  { id: "search", label: "Find something with search", href: "/dashboard/search" },
  { id: "project", label: "Organize something into a Project", href: "/dashboard/projects" },
];
