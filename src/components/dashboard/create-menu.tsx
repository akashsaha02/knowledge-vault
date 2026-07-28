"use client";

import {
  BookOpen,
  Code,
  Link as LinkIcon,
  Paperclip,
  Plus,
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
      <DropdownMenuContent align="start">
        {CREATE_LINKS.map((item) => (
          <DropdownMenuItem
            key={item.key}
            onClick={() => {
              router.push(item.href);
              onNavigate?.();
            }}
          >
            {CREATE_ICONS[item.key]}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
