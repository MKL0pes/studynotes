# Plano de melhorias

Escopo grande — vou organizar em 7 entregas. Não vou tocar no filtro de tags. Confirme antes de eu começar a implementar.

## 1. Code block avançado

- Substituir `CodeBlockView` por uma versão estilo VS Code:
  - Cabeçalho com **dropdown de linguagem com busca** (combobox) e ícone copiar/check + toast "Código copiado!".
  - **Lowlight** registrado com ~50 linguagens (web, back-end, banco, devops, outros conforme lista). Algumas como `mongodb`, `apache`, `matlab`, `vim` virão de `highlight.js/lib/languages/*` quando existir; as inexistentes caem em `plaintext` com aviso silencioso.
  - **Números de linha** renderizados em coluna fixa à esquerda (calculados via `node.textContent.split("\n")`).
  - **Linha atual** destacada via `selection` do editor (overlay translúcido).
  - **Tab** → 2 espaços; **Enter** → mantém indentação anterior; **`}` / `]` / `)`** → reduz 2 espaços se a linha for só whitespace + o caractere. Implementado em `addKeyboardShortcuts` da extensão `CodeBlockLowlight`.
  - **Tema Catppuccin Mocha** via CSS aplicado a `.hljs-*` em `src/styles.css`. Fundo `#1E1E2E` fixo nos dois modos. Borda esquerda colorida por linguagem (mapa hash → cor).
  - Fonte `JetBrains Mono` (já carregada no root).

## 2. Upload de arquivos

- Bucket Supabase `note-attachments` (privado) + RLS por `auth.uid()` na 1ª pasta do path.
- Botão clipe (`Paperclip`) na toolbar abre `<input type="file">`.
  - Imagem (jpg/png/gif/webp) → insere via extensão `Image` do TipTap (signed URL).
  - Outros (pdf, docx, etc.) → node customizado `FileAttachment` que renderiza card com nome, tamanho, botão download (signed URL ~ 1h, regerada on-demand).
- Path: `{user_id}/{note_id}/{uuid}-{filename}`.

## 3. Quiz (extensão Node TipTap)

- Botão "Quiz" na toolbar insere node `quiz` com atributos: `question`, `type` ("multiple"|"boolean"), `options[]`, `correct`, `answered`, `chosen`.
- View React: editor mostra campos editáveis; modo leitura mostra alternativas clicáveis com feedback verde/vermelho.
- Estado persiste no JSON da nota (já que tudo está em `content`).

## 4. Lista de tarefas (extensão Node TipTap)

- Node `taskblock` com atributos `items: [{id, text, done}]`.
- View React com checkboxes, edição inline, +/lixeira, contador "X de Y", barra de progresso (`<progress>` estilizado).
- Salvo no `content` da nota.

## 5. Ícones de cadernos

- Migration: `ALTER TABLE notebooks ADD COLUMN icon_name text DEFAULT 'BookOpen'`.
- Atualizar `useCreateNotebook` e tipos para aceitar `icon_name`.
- `CreateNotebookDialog`: adicionar grid 6 colunas com ~120 ícones Lucide agrupados por categoria (Acadêmico, Organização, Tecnologia, Criativo, Lifestyle), campo de busca, destaque com borda na cor de destaque.
- Sidebar: substituir o quadrado colorido por `<Icon />` Lucide dinâmico (mapa nome→componente), tingido com `nb.color`.
- Mapa estático nome→componente (não usar dynamic import pra manter tipagem e SSR).

## 6. Banco e armazenamento

- Migration única: coluna `icon_name` + criação do bucket `note-attachments` + 4 policies (select/insert/update/delete) restringindo `(storage.foldername(name))[1] = auth.uid()::text`.

## 7. Arquivos a criar/editar

Novos:
- `src/components/editor/code-block-view.tsx` (reescrito)
- `src/components/editor/quiz-node.tsx` + extensão
- `src/components/editor/task-block-node.tsx` + extensão
- `src/components/editor/file-attachment-node.tsx` + extensão
- `src/components/editor/upload-button.tsx`
- `src/lib/notebook-icons.ts` (mapa + categorias)
- `src/lib/lowlight-instance.ts` (registro centralizado)

Editados:
- `src/components/note-editor.tsx` (toolbar + extensões)
- `src/components/create-notebook-dialog.tsx` (seletor de ícone)
- `src/components/notebooks-sidebar.tsx` (renderiza ícone)
- `src/lib/queries.ts` (icon_name no insert)
- `src/lib/db-types.ts`
- `src/styles.css` (tema Catppuccin + estilos do code block)

Migration Supabase (1 chamada).

## Confirmações antes de começar

1. Posso prosseguir com tudo de uma vez?
2. Para PDFs grandes, mantemos limite padrão (50 MB do Supabase) ou aplico limite no client (ex.: 20 MB)?
3. Para o quiz, está OK ele ser sempre editável quando o editor estiver editável e "modo resposta" quando estiver em modo leitura? Ou precisa de toggle separado?
