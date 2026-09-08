type CodeTab = "snippets" | "commands";

type CodeTypeTabsProps = {
  value: CodeTab;
  onChange: (tab: CodeTab) => void;
};

export function CodeTypeTabs({ value, onChange }: CodeTypeTabsProps) {
  return (
    <div className="view-toggle code-page-tabs" role="tablist" aria-label="Code type">
      <button
        type="button"
        role="tab"
        aria-selected={value === "snippets"}
        className={`view-toggle-btn${value === "snippets" ? " view-toggle-btn--active" : ""}`}
        onClick={() => onChange("snippets")}
      >
        Snippets
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "commands"}
        className={`view-toggle-btn${value === "commands" ? " view-toggle-btn--active" : ""}`}
        onClick={() => onChange("commands")}
      >
        Commands
      </button>
    </div>
  );
}
