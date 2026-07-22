"use client";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CHECKLIST_TASKS,
  dismissChecklist,
  getChecklistState,
  type ChecklistState,
  type ChecklistTask,
} from "@/lib/onboarding-storage";

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
      localStorage.setItem(
        "kv-onboarding-checklist",
        JSON.stringify({ ...current, completed: merged }),
      );
      setState({ ...current, completed: merged });
    }
  }, [props]);

  if (state.dismissed) return null;

  const allDone = CHECKLIST_TASKS.every((task) =>
    state.completed.includes(task.id),
  );

  if (allDone) return null;

  return (
    <Card
      className="onboarding-checklist !border-[var(--border)] !mb-6"
      title="Get started"
      extra={
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          aria-label="Dismiss checklist"
          onClick={() => {
            dismissChecklist();
            setState((s) => ({ ...s, dismissed: true }));
          }}
        />
      }
    >
      <ul className="onboarding-checklist-list">
        {CHECKLIST_TASKS.map((task) => {
          const done = state.completed.includes(task.id);
          return (
            <li key={task.id} className={done ? "onboarding-checklist-done" : ""}>
              <span className="onboarding-checklist-icon">
                {done ? <CheckOutlined /> : "○"}
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
    </Card>
  );
}
