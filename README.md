# 📚 StudyNotes

> Uma plataforma moderna e intuitiva para organizar, gerenciar e compartilhar anotações universitárias. Inspirada no Evernote e Notion, com foco em usabilidade acadêmica e acessibilidade.

![StudyNotes Banner](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0--beta-brightgreen)

---

## 📋 Sumário

- [Sobre](#sobre)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Guia de Uso](#-guia-de-uso)
- [Arquitetura do Banco de Dados](#-arquitetura-do-banco-de-dados)
- [Acessibilidade](#-acessibilidade)
- [Issues Conhecidas](#-issues-conhecidas)
- [Roadmap](#-roadmap)
- [Troubleshooting](#-troubleshooting)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre

**StudyNotes** é uma aplicação web desenvolvida especificamente para estudantes universitários gerenciarem suas anotações de forma centralizada, intuitiva e acessível. 

O projeto oferece uma alternativa moderna e simplificada a ferramentas genéricas de anotação, com features pensadas na realidade acadêmica: organização por matéria, suporte a código-fonte, busca inteligente e modo claro/escuro.

### Objetivo Principal
Criar um espaço centralizado onde estudantes possam:
- ✅ Criar e organizar anotações por matéria
- ✅ Colaborar e compartilhar conhecimento
- ✅ Acessar conteúdo rapidamente (desktop e mobile)
- ✅ Estudar de forma mais eficiente com ferramentas certas

---

## ✨ Features

### 🔐 Autenticação
- [x] Cadastro e login com e-mail/senha
- [x] Login social (Google)
- [x] Recuperação de senha por e-mail
- [ ] Autenticação de dois fatores (2FA)
- [ ] OAuth com GitHub

### 📁 Organização de Conteúdo
- [x] Criação de **Cadernos** (ex: "Cálculo", "Algoritmos", "POO")
- [x] Criação de **Seções** dentro de cada caderno
- [x] Criação de **Notas** dentro de seções
- [x] Sistema de **Tags** para categorização livre
- [x] Favoritar notas importantes
- [x] Arquivar notas sem deletar
- [ ] Compartilhamento de cadernos (read-only ou edit)
- [ ] Histórico de versões das notas

### ✍️ Editor de Notas
- [x] Formatação de texto rico (negrito, itálico, sublinhado)
- [x] Títulos (H1, H2, H3)
- [x] Listas com marcadores e numeradas
- [x] Blocos de código com syntax highlighting
- [x] Upload de imagens
- [x] Links e embeds
- [x] Data de criação e última edição
- [x] Auto-save a cada alteração (debounce 1s)
- [ ] Markdown support completo
- [ ] Exportação para PDF/Word
- [ ] Menção de usuários (@username)

### 🔍 Busca e Filtros
- [x] Busca global por palavra-chave
- [x] Filtro por caderno
- [x] Filtro por tag
- [x] Filtro por data
- [ ] Busca avançada com operadores (AND, OR, NOT)
- [ ] Busca por conteúdo dentro de imagens (OCR)

### 📊 Dashboard
- [x] Tela inicial com notas recentes
- [x] Exibição de notas favoritas
- [x] Acesso rápido aos cadernos
- [x] Barra lateral de navegação (desktop)
- [x] Menu hambúrguer recolhível (mobile)
- [ ] Widgets de estatísticas (notas criadas, horas estudadas)
- [ ] Calendário de atividades

### ⚙️ Conta e Configurações
- [x] Editar nome e foto de perfil
- [x] Modo claro / modo escuro
- [x] Deletar conta com confirmação
- [ ] Alterar e-mail
- [ ] Alterar senha
- [ ] Preferências de notificações
- [ ] Temas personalizados
- [ ] Backup automático

### 🎨 Interface
- [x] Design minimalista e moderno
- [x] Modo claro nativo
- [x] Modo escuro nativo
- [x] Animações suaves
- [x] Responsividade mobile-first
- [x] Suporte a tablet e desktop
- [ ] Customização de layout
- [ ] Temas adicionais (sepia, alto contraste)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18+ (via Lovable)
- **Estilo**: CSS-in-JS com CSS Variables (tema dinâmico)
- **Fonte**: DM Sans, DM Mono (Google Fonts)
- **Ícones**: Phosphor Icons / Heroicons
- **Editor de Texto**: TipTap (rich text editor)

### Backend & Banco de Dados
- **Plataforma**: Bubble.io (no-code)
- **Banco de Dados**: Bubble Database
- **Autenticação**: Bubble Auth + OAuth (Google)
- **Storage de Arquivos**: Bubble File Storage

### DevOps & PWA
- **Hosting**: Bubble Cloud
- **PWA**: Configurado com manifest.json
- **Performance**: Lazy loading, Code splitting

### Qualidade & Testes
- **Acessibilidade**: WCAG 2.1 Nível AA
- **Testing**: (planejado para futuro)

---

## 📦 Requisitos

### Para Acessar
- Navegador moderno (Chrome, Firefox, Safari, Edge - versão recente)
- Conexão com internet
- JavaScript habilitado

### Para Desenvolver (no Lovable)
- Conta no [Lovable](https://lovable.dev)
- Conta no [Bubble.io](https://bubble.io)
- Git (opcional, para versionamento)
- Editor de código (VS Code recomendado)

### Requisitos de Navegador
| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| Chrome    | 90+           | ✅ Full Support |
| Firefox   | 88+           | ✅ Full Support |
| Safari    | 14+           | ✅ Full Support |
| Edge      | 90+           | ✅ Full Support |

---

## 🚀 Instalação

### Opção 1: Usar a Plataforma Lovable (Recomendado)

1. **Acesse o Lovable**
   ```bash
   https://lovable.dev
   ```

2. **Crie um novo projeto**
   - Clique em "New Project"
   - Selecione "React" como template
   - Nomeie como "StudyNotes"

3. **Configure o Banco de Dados (Bubble)**
   - Crie uma conta em [Bubble.io](https://bubble.io)
   - Crie um novo aplicativo
   - Configure os tipos de dados (veja seção [Arquitetura do Banco de Dados](#-arquitetura-do-banco-de-dados))

4. **Copie o mockup HTML**
   - Importe o arquivo `studynotes-mockup.html` como referência de design
   - Adapte os componentes para React

5. **Configure as variáveis de ambiente**
   ```bash
   REACT_APP_BUBBLE_API_URL=https://api.bubble.io/api/1.1
   REACT_APP_BUBBLE_API_KEY=seu_api_key_aqui
   REACT_APP_GOOGLE_CLIENT_ID=seu_google_oauth_id
   ```

6. **Deploy**
   - O Lovable faz deploy automático
   - Acesse via URL fornecida

### Opção 2: Setup Local (Para Desenvolvimento)

1. **Clone o repositório** (quando disponível)
   ```bash
   git clone https://github.com/seu-usuario/studynotes.git
   cd studynotes
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o arquivo `.env.local`**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite `.env.local` com suas credenciais:
   ```env
   REACT_APP_BUBBLE_API_URL=https://api.bubble.io/api/1.1
   REACT_APP_BUBBLE_API_KEY=sua_chave_api
   REACT_APP_GOOGLE_CLIENT_ID=seu_google_oauth_id
   REACT_APP_APP_URL=http://localhost:3000
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```
   
   A aplicação abrirá em `http://localhost:3000`

5. **Build para produção**
   ```bash
   npm run build
   ```

---

## 📂 Estrutura do Projeto

```
studynotes/
├── public/
│   ├── index.html
│   ├── manifest.json          # Configuração PWA
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Topbar.jsx          # Barra superior com logo e busca
│   │   │   ├── Sidebar.jsx         # Barra lateral de navegação
│   │   │   └── MainLayout.jsx      # Layout principal (3 colunas)
│   │   │
│   │   ├── NoteList/
│   │   │   ├── NoteList.jsx        # Container de lista de notas
│   │   │   ├── NoteCard.jsx        # Card individual de nota
│   │   │   ├── FilterBar.jsx       # Filtros (Todas, Recentes, Favoritas)
│   │   │   └── EmptyState.jsx      # Estado vazio
│   │   │
│   │   ├── Editor/
│   │   │   ├── Editor.jsx          # Container principal do editor
│   │   │   ├── Toolbar.jsx         # Barra de formatação
│   │   │   ├── NoteTitle.jsx       # Campo título editável
│   │   │   ├── NoteContent.jsx     # Corpo da nota (rich text)
│   │   │   ├── NoteMeta.jsx        # Metadados (data, tags, autor)
│   │   │   └── SaveStatus.jsx      # Indicador de auto-save
│   │   │
│   │   ├── Modals/
│   │   │   ├── CreateNotebook.jsx  # Modal criar caderno
│   │   │   ├── DeleteConfirm.jsx   # Confirmação delete
│   │   │   ├── ProfileEdit.jsx     # Editar perfil
│   │   │   └── UploadImage.jsx     # Upload de imagem
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx           # Tela de login
│   │   │   ├── Signup.jsx          # Tela de cadastro
│   │   │   └── ResetPassword.jsx   # Recuperação de senha
│   │   │
│   │   └── Common/
│   │       ├── Button.jsx          # Botão reutilizável
│   │       ├── Input.jsx           # Input reutilizável
│   │       ├── Tag.jsx             # Tag reutilizável
│   │       ├── Avatar.jsx          # Avatar do usuário
│   │       ├── Loader.jsx          # Loading spinner
│   │       └── Toast.jsx           # Notificações
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx           # Página inicial
│   │   ├── NoteEditor.jsx          # Página de edição
│   │   ├── Settings.jsx            # Configurações
│   │   └── NotFound.jsx            # 404
│   │
│   ├── services/
│   │   ├── api.js                  # Chamadas à API Bubble
│   │   ├── auth.js                 # Lógica de autenticação
│   │   ├── notes.js                # CRUD de notas
│   │   ├── notebooks.js            # CRUD de cadernos
│   │   ├── tags.js                 # Gerenciamento de tags
│   │   └── storage.js              # Upload de arquivos
│   │
│   ├── hooks/
│   │   ├── useAuth.js              # Context de autenticação
│   │   ├── useNotes.js             # Hook para notas
│   │   ├── useDarkMode.js          # Hook para tema
│   │   └── useDebounce.js          # Debounce para auto-save
│   │
│   ├── context/
│   │   ├── AuthContext.js          # Context da autenticação
│   │   ├── NotesContext.js         # Context de notas
│   │   └── ThemeContext.js         # Context de tema
│   │
│   ├── styles/
│   │   ├── globals.css             # Estilos globais
│   │   ├── variables.css           # Variáveis CSS (cores, tipografia)
│   │   ├── animations.css          # Animações
│   │   └── responsive.css          # Media queries
│   │
│   ├── utils/
│   │   ├── formatDate.js           # Formatação de datas
│   │   ├── debounce.js             # Função debounce
│   │   ├── validators.js           # Validação de dados
│   │   └── constants.js            # Constantes
│   │
│   ├── App.jsx                     # Componente raiz
│   ├── App.css                     # Estilos do App
│   └── index.js                    # Ponto de entrada
│
├── .env.example                    # Variáveis de ambiente (template)
├── .gitignore                      # Arquivos ignorados no git
├── package.json                    # Dependências do projeto
├── package-lock.json               # Lock de dependências
├── README.md                       # Este arquivo
├── CONTRIBUTING.md                 # Guia de contribuição
├── LICENSE                         # Licença MIT
│
└── docs/
    ├── ARCHITECTURE.md             # Arquitetura detalhada
    ├── API.md                      # Documentação da API
    ├── COMPONENTS.md               # Documentação de componentes
    └── ACCESSIBILITY.md            # Guia de acessibilidade
```

---

## 💻 Guia de Uso

### Para Usuários

#### 1. Criando uma Conta
1. Clique em **"Criar Conta"** na tela inicial
2. Preencha e-mail e senha (ou use login Google)
3. Confirme seu e-mail via link enviado
4. Pronto! Você está logado

#### 2. Criando um Caderno
1. Clique no botão **"+ Novo Caderno"** na barra lateral
2. Escolha um nome e cor (opcional)
3. Clique em **"Criar"**

#### 3. Criando uma Nota
1. Selecione o caderno desejado
2. Clique em **"✦ Nova Nota"** (botão verde na sidebar)
3. Digite o título e comece a escrever
4. As mudanças são salvas automaticamente

#### 4. Formatando Texto
Use a barra de ferramentas do editor:
- **B** → Negrito
- **I** → Itálico
- **U** → Sublinhado
- **H1/H2** → Títulos
- **•** → Lista com marcadores
- **1.** → Lista numerada
- **</>** → Bloco de código
- **🖼** → Inserir imagem
- **🔗** → Inserir link

#### 5. Usando Tags
1. Na nota, clique em **"+ Adicionar Tag"**
2. Digite o nome da tag (ex: #prova, #importante)
3. As tags aparecem no card da nota e podem filtrar

#### 6. Favoritar Notas
Clique no ícone ⭐ no card da nota para marcar como favorita

#### 7. Arquivar Notas
Abra a nota → Menu ⋯ → **"Arquivar"**
(As notas arquivadas aparecem em "Arquivados" na sidebar)

#### 8. Modo Claro/Escuro
Clique no toggle **🌙** na barra superior para alternar modos

#### 9. Editando Perfil
Clique na foto de perfil (avatar) → **"Configurações"** → **"Perfil"**
- Edite nome e foto
- Clique em **"Salvar Alterações"**

#### 10. Buscando Notas
Digite na barra de busca na parte superior:
- Busca por palavra-chave no título e conteúdo
- Filtre por caderno, tag ou data

### Para Desenvolvedores

#### Estrutura de Componentes React

**Exemplo: Criando um novo componente de botão**

```jsx
// components/Common/Button.jsx
export const Button = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
    >
      {loading ? '⌛' : label}
    </button>
  );
};
```

#### Usando o Context de Autenticação

```jsx
import { useAuth } from '../hooks/useAuth';

export const MyComponent = () => {
  const { user, isLoading, logout } = useAuth();
  
  if (isLoading) return <Loader />;
  if (!user) return <Login />;
  
  return (
    <div>
      <p>Bem-vindo, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

#### Chamadas à API

```jsx
import * as api from '../services/api';

// Criar nota
const createNote = async (notebookId, title, content) => {
  try {
    const response = await api.createNote({
      notebook_id: notebookId,
      title,
      content,
      created_at: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar nota:', error);
  }
};

// Buscar notas
const getNotes = async (notebookId) => {
  const notes = await api.getNotes({
    notebook_id: notebookId,
    limit: 20
  });
  return notes;
};
```

---

## 🗄 Arquitetura do Banco de Dados

### Diagram ER (Entity-Relationship)

```
┌─────────────┐         ┌──────────────┐
│    User     │         │   Notebook   │
├─────────────┤         ├──────────────┤
│ id (PK)     │◄────┐   │ id (PK)      │
│ email       │     └───┤ user_id (FK) │
│ name        │         │ name         │
│ photo_url   │         │ color        │
│ created_at  │         │ created_at   │
│ updated_at  │         │ updated_at   │
└─────────────┘         └──────────────┘
      ▲                         │
      │                         │
      │     ┌──────────────┐    │
      │     │   Section    │    │
      │     ├──────────────┤    │
      │     │ id (PK)      │    │
      │     │ notebook_id  │◄───┘
      │     │ name         │
      │     │ order        │
      │     │ created_at   │
      │     └──────────────┘
      │              │
      │     ┌────────▼─────────┐
      │     │      Note        │
      │     ├──────────────────┤
      │     │ id (PK)          │
      │     │ section_id (FK)  │
      │     │ user_id (FK)     │
      │     │ title            │
      │     │ content          │
      │     │ is_favorite      │
      │     │ is_archived      │
      │     │ created_at       │
      │     │ updated_at       │
      │     │ last_edited_by   │
      │     └──────────────────┘
      │              │
      │     ┌────────┴────────┐
      │     │                 │
      │  ┌──▼────┐      ┌─────▼──┐
      │  │  Tag  │      │  Note  │
      │  ├───────┤      │  Image │
      │  │ id    │      ├────────┤
      │  │ name  │      │ url    │
      │  │ color │      │ size   │
      └──┤ user_ │      │ type   │
         │ id    │      └────────┘
         └───────┘

Relações Many-to-Many:
Note ◄──────► Tag (via note_tags junction table)
```

### Tipos de Dados (Bubble)

#### **User**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único (UUID) |
| email | Email | ✅ | E-mail único do usuário |
| name | Text | ✅ | Nome completo |
| photo_url | Image | ❌ | URL da foto de perfil |
| password_hash | Text | ✅ | Hash bcrypt da senha |
| is_active | Boolean | ✅ | Status da conta |
| created_at | Date | ✅ | Data de criação |
| updated_at | Date | ✅ | Última atualização |
| last_login | Date | ❌ | Último acesso |
| notification_preferences | JSON | ❌ | Preferências de notificação |

#### **Notebook**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único |
| user_id | User | ✅ | Referência ao usuário |
| name | Text | ✅ | Nome do caderno |
| description | Text | ❌ | Descrição opcional |
| color | Text | ✅ | Cor hex (#4F46E5) |
| icon | Text | ❌ | Ícone emoji |
| order | Number | ✅ | Ordem de exibição |
| is_archived | Boolean | ✅ | Se está arquivado |
| created_at | Date | ✅ | Data de criação |
| updated_at | Date | ✅ | Última atualização |

#### **Section**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único |
| notebook_id | Notebook | ✅ | Referência ao caderno |
| name | Text | ✅ | Nome da seção |
| order | Number | ✅ | Ordem dentro do caderno |
| created_at | Date | ✅ | Data de criação |

#### **Note**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único |
| section_id | Section | ✅ | Referência à seção |
| user_id | User | ✅ | Autor da nota |
| title | Text | ✅ | Título da nota |
| content | Text | ✅ | Conteúdo em HTML |
| preview | Text | ❌ | Preview de 200 caracteres |
| is_favorite | Boolean | ✅ | Marcado como favorito |
| is_archived | Boolean | ✅ | Arquivado |
| created_at | Date | ✅ | Data de criação |
| updated_at | Date | ✅ | Última edição |
| last_edited_by | User | ❌ | Quem editou por último |
| word_count | Number | ❌ | Contagem de palavras |

#### **Tag**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único |
| user_id | User | ✅ | Dono da tag |
| name | Text | ✅ | Nome da tag (sem #) |
| color | Text | ❌ | Cor associada |
| usage_count | Number | ✅ | Quantas notas a usam |
| created_at | Date | ✅ | Data de criação |

#### **NoteTag** (Junction Table)
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| id | Text | ✅ |
| note_id | Note | ✅ |
| tag_id | Tag | ✅ |
| added_at | Date | ✅ |

#### **NoteImage**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Text | ✅ | Identificador único |
| note_id | Note | ✅ | Referência à nota |
| url | File | ✅ | URL da imagem armazenada |
| filename | Text | ✅ | Nome do arquivo |
| file_size | Number | ✅ | Tamanho em bytes |
| uploaded_at | Date | ✅ | Data do upload |
| alt_text | Text | ❌ | Texto alternativo |

### Regras de Privacidade e Segurança

```javascript
// Usuário acessa apenas seus próprios dados
Data: Note
Privacy Rule: "User who created this note can view/edit/delete"
Condition: This Note's user = Current User

// Tags são privadas por usuário
Data: Tag
Privacy Rule: "Only tag owner can access"
Condition: This Tag's user = Current User

// Cadernos e seções pertencem ao usuário
Data: Notebook & Section
Privacy Rule: "Only notebook owner can modify"
Condition: This Notebook's user = Current User
```

---

## ♿ Acessibilidade

O StudyNotes foi desenvolvido seguindo **WCAG 2.1 Nível AA** para garantir acesso a todos os usuários.

### Conformidade Implementada

- ✅ **Contraste**: Mínimo 4.5:1 (texto) e 3:1 (elementos gráficos)
- ✅ **Navegação por Teclado**: Todos elementos com `tabindex` apropriado
- ✅ **Screen Reader**: Aria-labels em ícones e elementos visuais
- ✅ **Hierarquia Semântica**: H1 → H2 → H3 em ordem correta
- ✅ **Redimensionamento**: Suporta zoom até 200% sem quebra
- ✅ **Foco Visível**: Indicador de foco em navegação por teclado
- ✅ **Mensagens de Erro**: Descritivas e associadas ao campo
- ✅ **Rótulos de Formulário**: Vinculados com `<label>` ou `aria-label`
- ✅ **Área de Toque Mobile**: Mínimo 44x44px

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl/Cmd + N` | Nova nota |
| `Ctrl/Cmd + S` | Salvar nota |
| `Ctrl/Cmd + B` | Negrito |
| `Ctrl/Cmd + I` | Itálico |
| `Ctrl/Cmd + K` | Link |
| `Ctrl/Cmd + F` | Buscar |
| `Escape` | Fechar modal |
| `Tab` | Navegar para próximo elemento |
| `Shift + Tab` | Navegar para elemento anterior |

### Verificação de Acessibilidade

Para testar:
```bash
# Instalar axe DevTools (Chrome/Firefox)
# https://www.deque.com/axe/devtools/

# Ou usar no terminal
npm install --save-dev @axe-core/react
```

---

## ⚠️ Issues Conhecidas

### Issues Reportadas (do arquivo `erros (2).txt`)

#### 🐛 **Filtro de Tags em Caderno Específico**
- **Problema**: Ao clicar no botão de tags dentro de um caderno específico, o filtro aplica-se a TODOS os cadernos, não apenas ao selecionado.
- **Status**: 🔴 Não corrigido
- **Prioridade**: Alta
- **Solução Esperada**: O filtro deve manter escopo apenas do caderno aberto
- **Workaround**: Use a barra de busca global para filtrar por tag

#### 🐛 **Permissão Negada ao Salvar Foto de Perfil**
- **Problema**: Ao mudar a foto do perfil e clicar "Salvar Alterações", retorna erro "Permissão Negada"
- **Status**: 🔴 Não corrigido
- **Prioridade**: Alta
- **Causa Provável**: Permissões de arquivo ou limite de tamanho em Bubble
- **Workaround**: Reduza o tamanho da imagem para <2MB e tente novamente

#### 🔧 **Botão "Salvar Nota" Ausente**
- **Problema**: Não há botão visual para salvar nota com o tema do app
- **Status**: 🔴 Não implementado
- **Prioridade**: Alta
- **Descrição**: O auto-save funciona, mas usuários não sabem se foi salvo
- **Solução**: Adicionar status visual (ex: "✓ Salvo" na toolbar)

#### 🔧 **Botões de Ação para Outras Features**
- **Problema**: Faltam botões para salvar alterações em tarefas, quizzes e outras features futuras
- **Status**: 🔴 Não implementado
- **Prioridade**: Média
- **Descrição**: UI precisa de padrão consistente para salvar/descartar em diferentes contextos
- **Solução**: Implementar componente `ActionBar` reutilizável

#### 🔧 **Botão de Deletar**
- **Problema**: Falta botão de deletar com tema consistente para notas e outros itens
- **Status**: 🔴 Não implementado
- **Prioridade**: Média
- **Descrição**: Delete deve aparecer com confirmação e feedback visual
- **Solução**: Modal de confirmação com transição suave

### Outras Issues Conhecidas

#### 📱 **Mobile Menu - Animação Lenta**
- Em devices lentes, o menu hambúrguer pode ficar lento
- **Workaround**: Reduzir duração da animação em `responsive.css`

#### 🌙 **Dark Mode - Persistência**
- Preferência de tema nem sempre persiste entre abas
- **Workaround**: Use Local Storage adequadamente no hook `useDarkMode`

---

## 🗺 Roadmap

### Fase 1 (Atual - v1.0)
- [x] Autenticação básica
- [x] CRUD de cadernos e notas
- [x] Editor de texto rico
- [x] Sistema de tags
- [x] Modo claro/escuro
- [x] Responsividade mobile
- [ ] **Corrigir issues conhecidas** ← Prioridade

### Fase 2 (v1.1)
- [ ] Compartilhamento de cadernos
- [ ] Comentários em notas
- [ ] Histórico de versões
- [ ] Colaboração em tempo real (via WebSocket)
- [ ] Exportação para PDF/Word
- [ ] Busca avançada

### Fase 3 (v1.2)
- [ ] Mobile app nativa (React Native)
- [ ] Sincronização offline-first
- [ ] OCR em imagens
- [ ] Quiz/Flashcards integrados
- [ ] Sistema de pontos/gamificação
- [ ] Integração com Google Calendar

### Fase 4 (v2.0)
- [ ] IA para sugestões de tags
- [ ] Resumo automático de notas
- [ ] Gerador de questões de prova
- [ ] Análise de tempo de estudo
- [ ] Marketplace de templates
- [ ] API pública para integrações

---

## 🔧 Troubleshooting

### Problema: "Erro de conexão com a API"

**Causa**: Variáveis de ambiente não configuradas ou API Bubble inativa

**Solução**:
1. Verifique `.env.local`:
   ```bash
   echo $REACT_APP_BUBBLE_API_URL
   ```
2. Confirme que Bubble está online em [bubble.io](https://bubble.io)
3. Teste a conexão:
   ```bash
   curl -X GET https://api.bubble.io/api/1.1/obj/User \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

### Problema: "Notas não aparecem após criar"

**Causa**: Cache não atualizado ou erro na query

**Solução**:
1. Abra DevTools (F12)
2. Vá para Application → Clear Storage
3. Recarregue a página (Ctrl+Shift+R)
4. Verifique Console para erros

### Problema: "Auto-save não funciona"

**Causa**: Debounce configurado incorretamente ou erro na API

**Solução**:
1. Verifique se `useDebounce` está implementado em `hooks/useDebounce.js`
2. Ajuste o delay:
   ```javascript
   const debouncedSave = useDebounce(saveNote, 1000); // 1 segundo
   ```
3. Verifique Network tab no DevTools para requests

### Problema: "Modo escuro não persiste"

**Causa**: Local Storage não está salvar a preferência

**Solução**:
```javascript
// Em useDarkMode.js
useEffect(() => {
  localStorage.setItem('studynotes-theme', isDark ? 'dark' : 'light');
}, [isDark]);

// Carregar ao inicializar
const [isDark, setIsDark] = useState(
  () => localStorage.getItem('studynotes-theme') === 'dark'
);
```

### Problema: "Imagens não aparecem na nota"

**Causa**: Upload falhou ou permissões insuficientes em Bubble

**Solução**:
1. Verifique tamanho da imagem (<5MB recomendado)
2. Confirme que Bubble File Storage está habilitado
3. Verifique permissões de arquivo em Bubble Dashboard

### Problema: "PWA não instala no mobile"

**Causa**: `manifest.json` inválido ou HTTPS não configurado

**Solução**:
1. Valide manifest:
   ```bash
   npm install -g pwa-asset-generator
   pwa-asset-generator public/icon.png public/
   ```
2. Certifique-se que está em HTTPS
3. Teste via `lighthouse`:
   ```bash
   npm install -g lighthouse
   lighthouse https://seu-site.com
   ```

---

## 📝 Contribuição

Adoramos contribuições! Se encontrou um bug ou tem uma ideia de feature:

### Como Contribuir

1. **Faça um Fork** do repositório
   ```bash
   git clone https://github.com/seu-usuario/studynotes.git
   cd studynotes
   ```

2. **Crie uma Branch** para sua feature
   ```bash
   git checkout -b feature/sua-feature
   ```

3. **Escreva código** seguindo o guia de estilo:
   - Use `camelCase` para variáveis e funções
   - Use `PascalCase` para componentes React
   - Comente código complexo
   - Faça commits semânticos

4. **Commit suas mudanças**
   ```bash
   git commit -m "feat: adiciona novo recurso tal"
   git commit -m "fix: corrige bug em tal componente"
   git commit -m "docs: atualiza README"
   ```

5. **Push para a branch**
   ```bash
   git push origin feature/sua-feature
   ```

6. **Abra um Pull Request** descrevendo:
   - O que foi mudado e por quê
   - Como testar
   - Screenshots (se UI foi alterada)
   - Fecha quais issues

### Padrão de Commits

```
feat:  Nova funcionalidade
fix:   Correção de bug
docs:  Mudanças em documentação
style: Formatação, sem mudança de código
refactor: Refatoração sem mudança de funcionalidade
perf: Melhoria de performance
test: Adição de testes
chore: Tarefas de build/dependências
```

Exemplo:
```bash
git commit -m "feat: adiciona filtro de tag por caderno

- Corrige issue #42
- Tags agora são filtradas apenas do caderno selecionado
- Adiciona testes para TagFilter.jsx"
```

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](./LICENSE) para detalhes.

**Sumário**:
- ✅ Você pode usar, modificar e distribuir
- ✅ Para fins comerciais e privados
- ❌ Sem garantia de qualquer tipo
- ❌ Sem responsabilidade dos autores

```
MIT License

Copyright (c) 2024 StudyNotes Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 📞 Suporte e Contato

Tem dúvidas? Entre em contato:

- 📧 **Email**: support@studynotes.com
- 💬 **Discord**: [Servidor StudyNotes](https://discord.gg/studynotes)
- 🐦 **Twitter**: [@StudyNotesApp](https://twitter.com/StudyNotesApp)
- 📋 **Issues**: [GitHub Issues](https://github.com/seu-usuario/studynotes/issues)

---

## 🙏 Agradecimentos

- Inspiração em **Evernote**, **Notion** e **OneNote**
- Framework **React** e comunidade
- Plataforma **Lovable** para development
- Plataforma **Bubble.io** para backend
- Todos os **contribuidores** e **testadores**

---

## 📊 Status do Projeto

| Aspecto | Status | Progresso |
|---------|--------|-----------|
| Core Features | 🟢 Em desenvolvimento | 85% |
| Design & UI | 🟢 Completo | 100% |
| Acessibilidade | 🟡 Em progresso | 75% |
| Documentação | 🟡 Em progresso | 70% |
| Testes | 🔴 Não iniciado | 0% |
| Deploy | 🟢 Pronto | 100% |

---

**Última atualização**: Maio 2026

**Versão**: 1.0.0-beta

**Mantendo**: StudyNotes Team

---

> "Estudar melhor, não mais. Organize suas anotações, foco seu aprendizado." 📚✨
