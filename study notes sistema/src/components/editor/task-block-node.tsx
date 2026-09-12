import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Plus, Trash2 } from "lucide-react";

type Item = { id: string; text: string; done: boolean };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function TaskBlockView({ node, updateAttributes, editor }: NodeViewProps) {
  const items = (node.attrs.items as Item[]) || [];
  const editable = editor.isEditable;

  const setItems = (next: Item[]) => updateAttributes({ items: next });

  const addItem = () =>
    setItems([...items, { id: uid(), text: "", done: false }]);
  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (id: string) => setItems(items.filter((it) => it.id !== id));

  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <NodeViewWrapper className="my-3">
      <div
        contentEditable={false}
        className="rounded-lg border border-border bg-card p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Tarefas
          </span>
          <span className="text-xs text-muted-foreground">
            {done} de {total} concluídas
          </span>
        </div>

        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="space-y-1">
          {items.length === 0 && (
            <li className="text-xs italic text-muted-foreground">
              Nenhuma tarefa ainda.
            </li>
          )}
          {items.map((it) => (
            <li
              key={it.id}
              className="group flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/40"
            >
              <input
                type="checkbox"
                checked={it.done}
                onChange={(e) => updateItem(it.id, { done: e.target.checked })}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <input
                value={it.text}
                disabled={!editable}
                onChange={(e) => updateItem(it.id, { text: e.target.value })}
                placeholder="Nova tarefa..."
                className={`flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 ${
                  it.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              />
              {editable && (
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                  aria-label="Remover tarefa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>

        {editable && (
          <button
            type="button"
            onClick={addItem}
            className="mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-input px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar tarefa
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const TaskBlock = Node.create({
  name: "taskBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      items: { default: [] },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-task-block]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-task-block": "true" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TaskBlockView);
  },
});
