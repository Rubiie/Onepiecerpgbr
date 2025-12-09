# 🛠️ Comandos Úteis - One Piece RPG

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Instalar dependências (limpo)
npm ci
```

---

## 💻 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run type-check

# Verificar tudo (tipos + build)
npm run verify

# Limpar cache e build
npm run clean
```

---

## 🚀 Deploy Supabase

```bash
# Login no Supabase
supabase login

# Link com projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy das Edge Functions
supabase functions deploy server

# Ver logs da Edge Function
supabase functions logs server

# Testar Edge Function localmente
supabase functions serve server
```

---

## 🌐 Deploy Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs

# Abrir dashboard
vercel
```

---

## 🗄️ Banco de Dados Supabase

```bash
# Ver status do projeto
supabase status

# Abrir SQL Editor
supabase db remote show

# Executar SQL
supabase db execute --file ./schema.sql

# Reset database (CUIDADO!)
supabase db reset
```

### SQL Úteis

```sql
-- Ver todas as chaves do KV store
SELECT key FROM kv_store_a9a64c9e ORDER BY created_at DESC;

-- Ver tripulações
SELECT * FROM kv_store_a9a64c9e WHERE key LIKE 'crew_%';

-- Ver posts do fórum
SELECT * FROM kv_store_a9a64c9e WHERE key LIKE 'forum_post_%';

-- Ver personagens
SELECT * FROM kv_store_a9a64c9e WHERE key LIKE 'character_%';

-- Limpar KV store (CUIDADO!)
TRUNCATE kv_store_a9a64c9e;

-- Ver storage buckets
SELECT * FROM storage.buckets;

-- Ver arquivos no storage
SELECT * FROM storage.objects;
```

---

## 🔍 Debug e Logs

```bash
# Ver logs do Vercel (produção)
vercel logs --follow

# Ver logs do Supabase Edge Function
supabase functions logs server --follow

# Build local para debug
npm run build -- --debug

# Verificar build
ls -lh dist/
```

---

## 🧹 Limpeza

```bash
# Limpar node_modules
rm -rf node_modules

# Limpar dist
rm -rf dist

# Limpar cache do npm
npm cache clean --force

# Limpar tudo
npm run clean

# Reinstalar dependências
npm run clean && npm install
```

---

## 🔐 Variáveis de Ambiente

```bash
# Criar arquivo .env local (não commitar!)
cp .env.example .env

# Editar variáveis
nano .env

# Ver variáveis do Vercel
vercel env ls

# Adicionar variável no Vercel
vercel env add VITE_SUPABASE_URL

# Remover variável no Vercel
vercel env rm VITE_SUPABASE_URL
```

---

## 📊 Análise e Performance

```bash
# Ver tamanho do build
du -sh dist/

# Analisar chunks
npm run build && ls -lh dist/assets/

# Ver dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Audit de segurança
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

---

## 🐛 Troubleshooting

```bash
# Verificar versão Node.js
node -v

# Verificar versão npm
npm -v

# Verificar configuração Vercel
cat vercel.json

# Verificar configuração Vite
cat vite.config.ts

# Verificar TypeScript
npx tsc --noEmit

# Testar build localmente
npm run build && npm run preview
```

---

## 📱 Git

```bash
# Status
git status

# Adicionar alterações
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main

# Ver logs
git log --oneline

# Ver diferenças
git diff

# Criar branch
git checkout -b feature/nova-funcionalidade

# Voltar para main
git checkout main
```

---

## 🎯 Comandos Rápidos

```bash
# Setup completo
npm install && npm run build

# Deploy completo
supabase functions deploy server && vercel --prod

# Verificar tudo antes de deploy
npm run verify && bash pre-deploy-check.sh

# Reset completo (dev)
npm run clean && npm install && npm run dev
```

---

## 📞 Ajuda

```bash
# Ajuda do Vercel
vercel --help

# Ajuda do Supabase
supabase --help

# Ajuda do npm
npm help

# Versões instaladas
node -v && npm -v && git --version
```

---

## ⚡ Atalhos de Teclado (Dev)

Durante `npm run dev`:

- **r** - Restart do servidor
- **u** - Mostrar URL
- **o** - Abrir no navegador
- **c** - Limpar console
- **q** - Quit (sair)

---

## 📝 Notas

- Sempre teste localmente antes de fazer deploy
- Use `npm run verify` antes de push
- Mantenha as dependências atualizadas
- Faça backup do banco antes de alterações grandes
- Use branches para features novas

---

**Dica:** Adicione um alias no seu `.bashrc` ou `.zshrc`:

```bash
alias dev="npm run dev"
alias build="npm run build"
alias deploy="supabase functions deploy server && vercel --prod"
```
