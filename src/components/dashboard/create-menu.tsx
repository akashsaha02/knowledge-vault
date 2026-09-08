"use client";

import {
  BookOpen,
  Code,
  Link as LinkIcon,
  Paperclip,
  Plus,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CREATE_LINKS } from "@/lib/nav-config";

const CREATE_ICONS: Record<string, React.ReactNode> = {
  note: <BookOpen className="h-4 w-4" />,
  bookmark: <LinkIcon className="h-4 w-4" />,
  snippet: <Code className="h-4 w-4" />,
  command: <Terminal className="h-4 w-4" />,
  prompt: <Sparkles className="h-4 w-4" />,
  file: <Paperclip className="h-4 w-4" />,
};

type CreateMenuProps = {
  block?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function CreateMenu({
  block = false,
  collapsed = false,
  onNavigate,
}: CreateMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`sider-create-btn${collapsed ? " create-menu-collapsed" : ""}${block ? " w-full" : ""}`}
          aria-label="Create something new"
        >
          <Plus className="h-4 w-4" />
          {collapsed ? null : "New"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {CREATE_LINKS.map((item) => (
          <DropdownMenuItem
            key={item.key}
            className="create-menu-item"
            onClick={() => {
              router.push(item.href);
              onNavigate?.();
            }}
          >
            {CREATE_ICONS[item.key]}
            <span className="create-menu-item-copy">
              <span className="create-menu-item-label">{item.label}</span>
              <span className="create-menu-item-desc">{item.description}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
