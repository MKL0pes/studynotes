import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { NotebooksSidebar } from "@/components/notebooks-sidebar";

export function AppShell({
  middle,
  right,
  mobileView = "right",
}: {
  middle: ReactNode;
  right: ReactNode;
  /** On mobile: which panel to show by default. */
  mobileView?: "list" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-border md:block">
        <NotebooksSidebar />
      </div>

      {/* Desktop notes list */}
      <div className="hidden w-80 shrink-0 border-r border-border md:block">{middle}</div>

      {/* Desktop editor / right pane */}
      <div className="hidden flex-1 md:block">{right}</div>

      {/* Mobile */}
      <div className="flex w-full flex-col md:hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">StudyNotes</span>
          <span className="h-9 w-9" />
        </header>
        <div className="flex-1 overflow-hidden">{mobileView === "list" ? middle : right}</div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar shadow-elevated">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NotebooksSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
