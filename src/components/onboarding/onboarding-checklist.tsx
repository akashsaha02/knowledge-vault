"use client";

import { BookOpen, CheckCircle2, Folder, Link as LinkIcon, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CHECKLIST_TASKS,
  completeChecklistTask,
  dismissChecklist,
  getChecklistState,
  type ChecklistState,
  type ChecklistTask,
} from "@/lib/onboarding-storage";

const TASK_ICONS = {
  note: BookOpen,
  bookmark: LinkIcon,
  search: Search,
  project: Folder,
  snippet: BookOpen,
  tag: Folder,
} as const;

type OnboardingChecklistProps = {
  hasNote?: boolean;
  hasSnippet?: boolean;
  hasBookmark?: boolean;
  hasProject?: boolean;
  hasTag?: boolean;
  searched?: boolean;
};

export function OnboardingChecklist(props: OnboardingChecklistProps) {
  const [state, setState] = useState<ChecklistState>({
    dismissed: true,
    completed: [],
  });

  useEffect(() => {
    setState(getChecklistState());
  }, []);

  useEffect(() => {
    const autoComplete: ChecklistTask[] = [];
    if (props.hasNote) autoComplete.push("note");
    if (props.hasSnippet) autoComplete.push("snippet");
    if (props.hasBookmark) autoComplete.push("bookmark");
    if (props.hasProject) autoComplete.push("project");
    if (props.searched) autoComplete.push("search");
    if (props.hasTag) autoComplete.push("tag");

    if (autoComplete.length === 0) return;

    const current = getChecklistState();
    const merged = [...new Set([...current.completed, ...autoComplete])];
    if (merged.length !== current.completed.length) {
      for (const task of autoComplete) {
        completeChecklistTask(task);
      }
      setState({ ...current, completed: merged });
    }
  }, [props]);

  if (state.dismissed) return null;

  const allDone = CHECKLIST_TASKS.every((task) =>
    state.completed.includes(task.id),
  );

  if (allDone) return null;

  const completedCount = CHECKLIST_TASKS.filter((t) =>
    state.completed.includes(t.id),
  ).length;

  return (
    <section className="onboarding-checklist" aria-label="Getting started checklist">
      <div className="onboarding-checklist-header">
        <h2 className="onboarding-checklist-title">
          Getting started ({completedCount}/{CHECKLIST_TASKS.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Dismiss checklist"
          onClick={() => {
            dismissChecklist();
            setState((s) => ({ ...s, dismissed: true }));
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ul className="onboarding-checklist-list">
        {CHECKLIST_TASKS.map((task) => {
          const done = state.completed.includes(task.id);
          const TaskIcon = TASK_ICONS[task.id] ?? BookOpen;
          return (
            <li
              key={task.id}
              className={`onboarding-checklist-item${done ? " onboarding-checklist-item--done" : ""}`}
            >
              <span className="onboarding-checklist-icon" aria-hidden="true">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                ) : (
                  <TaskIcon className="h-4 w-4" strokeWidth={1.75} />
                )}
              </span>
              {done ? (
                <span>{task.label}</span>
              ) : (
                <Link href={task.href}>{task.label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
