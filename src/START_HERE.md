# 🎯 COMECE AQUI - One Piece RPG

## ⚡ 3 Passos para o Ar

### 1️⃣ Supabase (5 min)
```bash
supabase login
supabase link --project-ref SEU_ID
supabase functions deploy server
```

### 2️⃣ Vercel (5 min)
1. Conecte GitHub → Vercel
2. Adicione variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

### 3️⃣ Teste (2 min)
Acesse: `https://seu-projeto.vercel.app`

---

## 📚 Documentação

| Se você quer... | Leia... |
|----------------|---------|
| 🚀 **Deploy rápido** | [QUICK_START.md](./QUICK_START.md) |
| 📖 **Entender tudo** | [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) |
| 🎨 **Guia visual** | [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) |
| 🐛 **Resolver problema** | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| ❓ **Tirar dúvida** | [FAQ.md](./FAQ.md) |
| 💻 **Ver comandos** | [COMANDOS_UTEIS.md](./COMANDOS_UTEIS.md) |
| 📋 **Ver tudo** | [DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md) |

---

## 🤖 Scripts Automáticos

```bash
# Deploy completo guiado
bash DEPLOY_COMPLETO.sh

# Verificar antes de deploy
bash pre-deploy-check.sh

# Configurar variáveis
bash setup-env.sh

# Testar site após deploy
bash health-check.sh https://seu-site.vercel.app
```

---

## ⚠️ IMPORTANTE

### ✅ Faça
- Use prefixo `VITE_` nas variáveis
- Deploy Edge Functions no Supabase
- Configure variáveis no Vercel

### ❌ Não Faça
- Não adicione `SUPABASE_SERVICE_ROLE_KEY` no Vercel
- Não esqueça o prefixo `VITE_`
- Não pule o deploy das Edge Functions

---

## 🆘 Problemas?

1. [FAQ.md](./FAQ.md) - Perguntas frequentes
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Soluções
3. Logs: `vercel logs` ou `supabase functions logs server`

---

## 🎉 Pronto!

**Tempo total:** ~15 minutos

**Dificuldade:** Fácil 🟢

**Custo:** Grátis 💰

---

⚓ **Vamos navegar no Grand Line!** ⚓
