# 🎨 Guia Visual de Deploy - One Piece RPG

Um guia passo a passo com instruções visuais para fazer deploy do seu site.

---

## 📋 O que você vai precisar

```
┌──────────────────────────────────────────┐
│  ✅ Conta GitHub (gratuita)             │
│  ✅ Conta Vercel (gratuita)             │
│  ✅ Conta Supabase (gratuita)           │
│  ✅ 15 minutos do seu tempo              │
└──────────────────────────────────────────┘
```

---

## 🎯 Fluxo Geral

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Supabase  │ ───▶ │   Vercel    │ ───▶ │  Seu Site   │
│   Backend   │      │   Deploy    │      │   Online!   │
└─────────────┘      └─────────────┘      └─────────────┘
     5 min               5 min                 Ready!
```

---

## PARTE 1: Configurar Supabase (Backend)

### Passo 1.1: Criar Projeto no Supabase

```
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Clique em "New Project"

┌────────────────────────────────────────────┐
│  New Project                               │
│                                            │
│  Name: [one-piece-rpg            ]        │
│  Database Password: [●●●●●●●●●●●●]        │
│  Region: [South America (São Paulo)]      │
│                                            │
│  [Create new project]                     │
└────────────────────────────────────────────┘

4. Aguarde ~2 minutos para criar o projeto
```

### Passo 1.2: Copiar Credenciais

```
1. Vá para Settings > API

┌────────────────────────────────────────────┐
│  Project Settings                          │
│  ├─ General                                │
│  └─ API        ◀── Clique aqui            │
└────────────────────────────────────────────┘

2. Copie estas informações:

┌────────────────────────────────────────────┐
│  Configuration                             │
│                                            │
│  Project URL                               │
│  https://xxxxx.supabase.co  [Copy]        │
│                                            │
│  API Keys                                  │
│  anon public                               │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6...  [Copy] │
└────────────────────────────────────────────┘

⚠️ Cole essas informações em um bloco de notas!
```

### Passo 1.3: Deploy Edge Functions

```
No seu terminal:

┌────────────────────────────────────────────┐
│ $ npm install -g supabase                  │
│ ✓ Installed supabase                       │
│                                            │
│ $ supabase login                           │
│ ✓ Logged in                                │
│                                            │
│ $ supabase link --project-ref xxxxx        │
│ ✓ Linked to project                        │
│                                            │
│ $ supabase functions deploy server         │
│ ✓ Deployed server function                 │
└────────────────────────────────────────────┘

✅ Backend configurado!
```

---

## PARTE 2: Deploy no Vercel (Frontend)

### Passo 2.1: Conectar GitHub

```
1. Push seu código para GitHub

┌────────────────────────────────────────────┐
│ $ git add .                                │
│ $ git commit -m "Initial commit"          │
│ $ git push origin main                     │
└────────────────────────────────────────────┘

2. Acesse: https://vercel.com
3. Clique em "New Project"

┌────────────────────────────────────────────┐
│  Import Git Repository                     │
│                                            │
│  ◉ github.com/seu-usuario/one-piece-rpg   │
│                                            │
│  [Import]                                  │
└────────────────────────────────────────────┘
```

### Passo 2.2: Configurar Variáveis

```
Antes de fazer deploy, clique em "Environment Variables"

┌────────────────────────────────────────────┐
│  Configure Project                         │
│                                            │
│  Environment Variables                     │
│                                            │
│  Key                                       │
│  [VITE_SUPABASE_URL              ]        │
│                                            │
│  Value                                     │
│  [https://xxxxx.supabase.co      ]        │
│                                            │
│  [+ Add]                                   │
└────────────────────────────────────────────┘

Adicione:
1. VITE_SUPABASE_URL = https://xxxxx.supabase.co
2. VITE_SUPABASE_ANON_KEY = eyJhbGc...

⚠️ IMPORTANTE: Use o prefixo VITE_
```

### Passo 2.3: Deploy!

```
Clique em "Deploy"

┌────────────────────────────────────────────┐
│  Building...                               │
│  ████████████████████░░░░░░  75%          │
│                                            │
│  ✓ Installing dependencies                 │
│  ✓ Building application                    │
│  ⏳ Optimizing production build            │
└────────────────────────────────────────────┘

Aguarde ~2 minutos

┌────────────────────────────────────────────┐
│  🎉 Congratulations!                       │
│                                            │
│  Your project is live at:                  │
│  https://one-piece-rpg.vercel.app         │
│                                            │
│  [Visit]                                   │
└────────────────────────────────────────────┘

✅ Site no ar!
```

---

## PARTE 3: Testar o Site

### Passo 3.1: Acessar o Site

```
Abra: https://seu-projeto.vercel.app

┌────────────────────────────────────────────┐
│  🏴‍☠️ One Piece RPG                        │
│                                            │
│  [Login]  [Cadastrar]                     │
│                                            │
│  Sistema de Fichas de Personagens         │
└────────────────────────────────────────────┘
```

### Passo 3.2: Criar Conta

```
Clique em "Cadastrar"

┌────────────────────────────────────────────┐
│  Criar Conta                               │
│                                            │
│  Nome: [Monkey D. Luffy         ]         │
│  Email: [luffy@onepiece.com     ]         │
│  Senha: [●●●●●●●●●●●●●●●●●●●●●]         │
│                                            │
│  [Criar Conta]                            │
└────────────────────────────────────────────┘

✅ Conta criada!
```

### Passo 3.3: Criar Personagem

```
Clique em "+ Novo Personagem"

┌────────────────────────────────────────────┐
│  Criar Personagem                          │
│                                            │
│  Nome: [Monkey D. Luffy         ]         │
│  Raça: [Humano ▼]                         │
│  Classe: [Pirata ▼]                       │
│                                            │
│  Akuma no Mi                               │
│  [☑] Possui Fruta do Diabo                │
│  Tipo: [Gomu Gomu no Mi         ]         │
│                                            │
│  [Criar Personagem]                       │
└────────────────────────────────────────────┘

✅ Personagem criado!
```

---

## 🎉 PRONTO!

```
┌────────────────────────────────────────────┐
│                                            │
│     ⚓ SITE NO AR E FUNCIONANDO! ⚓        │
│                                            │
│  ✅ Backend configurado (Supabase)        │
│  ✅ Frontend deployado (Vercel)           │
│  ✅ Banco de dados funcionando            │
│  ✅ Uploads de imagem ativos              │
│  ✅ Fórum online                          │
│  ✅ Sistema de tripulações ativo          │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📱 Como Compartilhar com Amigos

### Opção 1: URL Direta
```
Copie e cole:
https://seu-projeto.vercel.app

Envie por:
• WhatsApp
• Discord
• Telegram
• Email
```

### Opção 2: QR Code
```
1. Acesse: https://www.qr-code-generator.com/
2. Cole sua URL
3. Gere QR Code
4. Compartilhe a imagem
```

### Opção 3: Domínio Próprio
```
No Vercel Dashboard:

Settings > Domains
[seu-rpg.com.br         ] [Add]

Siga instruções para configurar DNS
```

---

## 🔄 Como Atualizar o Site

```
Sempre que fizer alterações:

┌────────────────────────────────────────────┐
│ $ git add .                                │
│ $ git commit -m "Nova funcionalidade"     │
│ $ git push origin main                     │
└────────────────────────────────────────────┘

Vercel detecta automaticamente e faz deploy!

┌────────────────────────────────────────────┐
│  🚀 Deploying...                           │
│                                            │
│  ⏱️ ETA: 2 minutes                         │
│                                            │
│  [View Build Logs]                        │
└────────────────────────────────────────────┘

✅ Atualizado automaticamente!
```

---

## 🐛 Troubleshooting Visual

### ❌ Site não carrega

```
1. Verifique variáveis

Vercel Dashboard > Settings > Environment Variables

┌────────────────────────────────────────────┐
│  Environment Variables                     │
│                                            │
│  ✅ VITE_SUPABASE_URL                     │
│  ✅ VITE_SUPABASE_ANON_KEY                │
│                                            │
│  ⚠️ Verifique o prefixo VITE_             │
└────────────────────────────────────────────┘

2. Redeploy

Deployments > ⋯ > Redeploy
```

### ❌ Login não funciona

```
1. Verifique Edge Function

Supabase Dashboard > Functions

┌────────────────────────────────────────────┐
│  Edge Functions                            │
│                                            │
│  server  ✅ Deployed  [Logs]              │
│                                            │
└────────────────────────────────────────────┘

2. Ver logs

[Logs] > Filtrar por "error"
```

### ❌ Upload falha

```
Supabase Dashboard > Storage

┌────────────────────────────────────────────┐
│  Storage                                   │
│                                            │
│  ✅ make-a9a64c9e-character-photos        │
│     Private                                │
│                                            │
│  Se não existir: [New bucket]             │
└────────────────────────────────────────────┘
```

---

## 📊 Dashboard Visual

### Vercel Dashboard
```
┌────────────────────────────────────────────┐
│  one-piece-rpg                             │
│                                            │
│  🟢 Production                             │
│  https://one-piece-rpg.vercel.app         │
│                                            │
│  Deployments     │  Analytics             │
│  ├─ main (prod)  │  ├─ 1.2K visitors      │
│  ├─ feature/x    │  ├─ 95% uptime         │
│  └─ dev          │  └─ 1.2s avg load      │
└────────────────────────────────────────────┘
```

### Supabase Dashboard
```
┌────────────────────────────────────────────┐
│  one-piece-rpg                             │
│                                            │
│  Database        │  Storage               │
│  ├─ Tables: 1    │  ├─ Buckets: 1         │
│  ├─ Size: 2.5 MB │  ├─ Files: 45          │
│  └─ Rows: 127    │  └─ Size: 15 MB        │
│                                            │
│  Auth            │  Functions             │
│  ├─ Users: 23    │  ├─ server: ✅         │
│  └─ Active: 8    │  └─ Invokes: 3.2K      │
└────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

```
Antes de compartilhar com amigos:

□ Site abre sem erros
□ Consegue criar conta
□ Consegue fazer login
□ Consegue criar personagem
□ Upload de foto funciona
□ Download PDF funciona
□ Consegue criar tripulação
□ Fórum funciona
□ Todos os links funcionam

Tudo OK? 🎉 COMPARTILHE!
```

---

## 🎓 Próximos Passos

```
1. 📱 Configure domínio próprio
   Vercel > Settings > Domains

2. 📊 Ative Analytics
   Vercel > Analytics > Enable

3. 🔔 Configure notificações
   Supabase > Auth > Email Templates

4. 🎨 Customize cores
   Edite: /styles/globals.css

5. 🚀 Adicione funcionalidades
   Crie componentes em /components/
```

---

**⚓ Boa sorte, e que sua aventura seja épica! ⚓**

---

**Dúvidas?** Veja:
- [QUICK_START.md](./QUICK_START.md) - Texto
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problemas
- [FAQ.md](./FAQ.md) - Perguntas
