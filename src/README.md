# One Piece RPG - Sistema de Fichas 🏴‍☠️

Sistema completo de gerenciamento de fichas de personagens para RPG baseado em One Piece.

> 🎯 **[▶️ COMECE AQUI - Deploy em 15 minutos](./START_HERE.md)**

> 📚 **[Ver Índice Completo da Documentação](./DOCUMENTACAO_INDEX.md)**

## 🚀 Deploy no Vercel

### Pré-requisitos
1. ✅ Conta no [Vercel](https://vercel.com)
2. ✅ Conta no [Supabase](https://supabase.com)
3. ✅ Projeto Supabase configurado com Edge Functions

### 📖 Guia Completo de Deploy
Leia o guia detalhado: **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**

### ⚡ Deploy Rápido

1. **Fork/Clone este repositório**
2. **Configure o Supabase**
   - Crie um projeto no Supabase
   - Deploy das Edge Functions: `supabase functions deploy server`
3. **Deploy no Vercel**
   - Conecte o repositório no Vercel
   - Configure as variáveis de ambiente (veja abaixo)
   - Deploy automático!

### 🔐 Variáveis de Ambiente Necessárias

Configure no painel do Vercel (Settings > Environment Variables):

```bash
# ⚠️ IMPORTANTE: Use o prefixo VITE_ para variáveis frontend
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

**⚠️ NÃO adicione `SUPABASE_SERVICE_ROLE_KEY` no Vercel!**
Esta chave fica apenas nas Edge Functions do Supabase.

### 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo dev
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📦 Estrutura do Projeto

```
/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI reutilizáveis
│   ├── AuthForm.tsx    # Formulário de autenticação
│   ├── CharacterForm.tsx   # Formulário de criação de personagens
│   ├── CharacterList.tsx   # Lista de personagens
│   └── ...
├── types/              # Definições TypeScript
├── supabase/           # Funções do Supabase
├── utils/              # Utilitários
├── styles/             # Estilos globais
└── App.tsx             # Componente principal
```

## 🎮 Funcionalidades

- ✅ Autenticação de usuários (Supabase Auth)
- ✅ Criação e edição de fichas de personagens
- ✅ Sistema completo de atributos e stats
- ✅ Akuma no Mi (Frutas do Diabo)
- ✅ Sistema de Haki
- ✅ Upload de imagens de personagens
- ✅ Download de fichas em PDF
- ✅ Sistema de crews (tripulações)
- ✅ Sessões de mestre (DM)
- ✅ Fórum da comunidade
- ✅ Recursos e guias de RPG

## 🛠️ Tecnologias

- **React** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (Auth, Database, Storage)
- **jsPDF** - Geração de PDFs
- **Lucide React** - Ícones

## 📝 Licença

Este é um projeto de fã baseado em One Piece de Eiichiro Oda.