# 🚀 Quick Start - Deploy no Vercel

## ⚡ 3 Passos Rápidos

### 1️⃣ Supabase (5 minutos)

```bash
# Deploy das Edge Functions
supabase login
supabase link --project-ref SEU_PROJECT_ID
supabase functions deploy server
```

**Copie as credenciais:**
- URL: `https://xxxxx.supabase.co`
- Anon Key: `eyJhbGc...`

---

### 2️⃣ Vercel (2 minutos)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe seu repositório
4. Adicione as variáveis de ambiente:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

5. Clique em **"Deploy"** ✅

---

### 3️⃣ Pronto! (1 minuto)

Acesse: `https://seu-projeto.vercel.app`

---

## 🆘 Problemas?

### Site não carrega?
- ✅ Verifique se adicionou `VITE_` no início das variáveis
- ✅ Verifique se as credenciais estão corretas

### Erro 401 Unauthorized?
- ✅ Verifique se deployou a Edge Function no Supabase
- ✅ Verifique se a `VITE_SUPABASE_ANON_KEY` está correta

### Upload não funciona?
- ✅ Verifique os logs da Edge Function no Supabase
- ✅ O bucket é criado automaticamente na primeira execução

---

## 📚 Documentação Completa

- [Deploy Completo](./DEPLOY_VERCEL.md)
- [Checklist](./CHECKLIST_DEPLOY.md)
- [README](./README.md)

---

**Tempo total:** ~10 minutos ⏱️

**Dificuldade:** Fácil 🟢
