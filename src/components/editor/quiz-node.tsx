import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Check, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

type QuizType = "multiple" | "boolean";

function QuizView({ node, updateAttributes, editor }: NodeViewProps) {
  const editable = editor.isEditable;
  const question = (node.attrs.question as string) || "";
  const type = (node.attrs.type as QuizType) || "multiple";
  const options = (node.attrs.options as string[]) || ["", ""];
  const correct = node.attrs.correct as number | null;
  const chosen = node.attrs.chosen as number | null;
  const [editingMode, setEditingMode] = useState(editable);

  const setOption = (i: number, v: string) => {
    const next = [...options];
    next[i] = v;
    updateAttributes({ options: next });
  };

  const addOption = () => {
    updateAttributes({ options: [...options, ""] });
  };

  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, idx) => idx !== i);
    let nextCorrect = correct;
    if (correct === i) nextCorrect = null;
    else if (correct !== null && correct > i) nextCorrect = correct - 1;
    updateAttributes({ options: next, correct: nextCorrect, chosen: null });
  };

  const choose = (i: number) => {
    if (editingMode) return;
    updateAttributes({ chosen: i });
  };

  const showFeedback = !editingMode && chosen !== null && correct !== null;

  return (
    <NodeViewWrapper className="my-3">
      <div
        contentEditable={false}
        className="rounded-lg border border-border bg-card p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Quiz
          </span>
          {editable && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  updateAttributes({
                    type: type === "multiple" ? "boolean" : "multiple",
                    correct: null,
                    chosen: null,
                  })
                }
                className="rounded-md border border-input bg-background px-2 py-0.5 text-[11px] hover:bg-accent"
              >
                {type === "multiple" ? "Múltipla escolha" : "Verdadeiro/Falso"}
              </button>
              <button
                type="button"
                onClick={() => setEditingMode((v) => !v)}
                className="rounded-md border border-input bg-background px-2 py-0.5 text-[11px] hover:bg-accent"
              >
                {editingMode ? "Responder" : "Editar"}
              </button>
            </div>
          )}
        </div>

        {editingMode ? (
          <input
            value={question}
            onChange={(e) => updateAttributes({ question: e.target.value })}
            placeholder="Digite a pergunta..."
            className="mb-3 w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        ) : (
          <p className="mb-3 text-base font-semibold text-foreground">
            {question || "Sem pergunta"}
          </p>
        )}

        {type === "boolean" ? (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Verdadeiro", idx: 0 },
              { label: "Falso", idx: 1 },
            ].map((b) => {
              const isCorrect = correct === b.idx;
              const isChosen = chosen === b.idx;
              const reveal = showFeedback && (isChosen || isCorrect);
              const cls = reveal
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : "border-input bg-background hover:bg-accent";
              return (
                <button
                  key={b.idx}
                  type="button"
                  onClick={() =>
                    editingMode ? updateAttributes({ correct: b.idx }) : choose(b.idx)
                  }
                  className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${cls}`}
                >
                  {editingMode && correct === b.idx && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                  {b.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1.5">
            {options.map((opt, i) => {
              const isCorrect = correct === i;
              const isChosen = chosen === i;
              const reveal = showFeedback && (isChosen || isCorrect);
              const cls = reveal
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-rose-500 bg-rose-500/10"
                : "border-input bg-background hover:bg-accent/40";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 transition-colors ${cls}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      editingMode ? updateAttributes({ correct: i }) : choose(i)
                    }
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isCorrect && editingMode
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : reveal && isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : reveal && isChosen
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-muted-foreground/40"
                    }`}
                    aria-label={editingMode ? "Marcar como correta" : "Selecionar"}
                  >
                    {isCorrect && editingMode && <Check className="h-3 w-3" />}
                    {reveal && isCorrect && <Check className="h-3 w-3" />}
                    {reveal && !isCorrect && isChosen && <X className="h-3 w-3" />}
                  </button>
                  {editingMode ? (
                    <input
                      value={opt}
                      onChange={(e) => setOption(i, e.target.value)}
                      placeholder={`Alternativa ${i + 1}`}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                  ) : (
                    <span className="flex-1 text-sm">{opt || `Alternativa ${i + 1}`}</span>
                  )}
                  {editingMode && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 2}
                      title={options.length <= 2 ? "Mínimo 2 alternativas" : "Remover alternativa"}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
            {editingMode && (
              <button
                type="button"
                onClick={addOption}
                className="mt-1 inline-flex items-center gap-1 rounded-md border border-dashed border-input px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar alternativa
              </button>
            )}
          </div>
        )}

        {showFeedback && (
          <p
            className={`mt-3 text-xs font-medium ${
              chosen === correct ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {chosen === correct ? "Resposta correta!" : "Resposta incorreta."}
            {!editingMode && (
              <button
                type="button"
                onClick={() => updateAttributes({ chosen: null })}
                className="ml-2 underline"
              >
                Tentar novamente
              </button>
            )}
          </p>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const Quiz = Node.create({
  name: "quiz",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      question: { default: "" },
      type: { default: "multiple" },
      options: { default: ["", "", "", ""] },
      correct: { default: null },
      chosen: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-quiz]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-quiz": "true" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(QuizView);
  },
});
