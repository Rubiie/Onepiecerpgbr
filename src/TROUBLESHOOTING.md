# 🔧 Troubleshooting - One Piece RPG no Vercel

Guia completo para resolver problemas comuns no deploy.

---

## 🚨 Problemas Comuns e Soluções

### 1. Site não carrega / Página em branco

#### Sintomas:
- Página completamente branca
- Apenas background sem conteúdo
- Console mostra erros

#### Causas possíveis:
✅ **Variáveis de ambiente não configuradas**

**Solução:**
```bash
# Verificar variáveis no Vercel
vercel env ls

# Adicionar variáveis
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Redeploy
vercel --prod
```

✅ **Prefixo VITE_ ausente**

As variáveis DEVEM começar com `VITE_`:
- ✅ Correto: `VITE_SUPABASE_URL`
- ❌ Errado: `SUPABASE_URL`

✅ **Build falhou**

```bash
# Build local para ver erros
npm run build

# Ver logs no Vercel
vercel logs
```

---

### 2. Erro 401 Unauthorized

#### Sintomas:
- Login não funciona
- Erro ao criar personagens
- "Unauthorized" no console

#### Causas possíveis:
✅ **Edge Function não deployada**

**Solução:**
```bash
supabase login
supabase link --project-ref SEU_PROJECT_ID
supabase functions deploy server
```

✅ **Chave anon incorreta**

Verifique em: Supabase Dashboard > Settings > API
- Copie a chave `anon public`
- Atualize no Vercel

✅ **URL do Supabase incorreta**

Formato correto: `https://xxxxx.supabase.co`

---

### 3. Upload de imagem não funciona

#### Sintomas:
- Erro ao fazer upload de foto
- "Failed to create bucket"
- "Storage error"

#### Causas possíveis:
✅ **Bucket não existe**

**Solução:**
1. Vá para Supabase Dashboard
2. Storage > Create bucket
3. Nome: `make-a9a64c9e-character-photos`
4. Configuração: **Private**

✅ **Permissões incorretas**

A Edge Function cria o bucket automaticamente, mas pode falhar.

Verifique os logs:
```bash
supabase functions logs server
```

✅ **Service Role Key não configurada**

No Supabase (não no Vercel!):
1. Functions > server > Settings
2. Add secret: `SUPABASE_SERVICE_ROLE_KEY`

---

### 4. Fórum não funciona

#### Sintomas:
- Posts não carregam
- Erro ao criar post
- "Key not found"

#### Causas possíveis:
✅ **Tabela KV não existe**

**Solução:**
```sql
-- Execute no SQL Editor do Supabase
CREATE TABLE IF NOT EXISTS kv_store_a9a64c9e (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_a9a64c9e(key text_pattern_ops);
```

✅ **Edge Function com erro**

```bash
# Ver logs
supabase functions logs server --follow

# Redeploy
supabase functions deploy server
```

---

### 5. Build falha no Vercel

#### Sintomas:
- Build Error no Vercel
- "Command failed"
- TypeScript errors

#### Causas possíveis:
✅ **Erro de TypeScript**

**Solução:**
```bash
# Verificar erros localmente
npm run type-check

# Build local
npm run build

# Corrigir erros antes de push
```

✅ **Dependências faltando**

```bash
# Limpar e reinstalar
npm run clean
npm install

# Verificar package.json
npm audit fix
```

✅ **Node version incorreta**

Vercel deve usar Node 18+. Verifique:
- `.nvmrc` existe com `18.18.0`
- `.node-version` existe com `18.18.0`
- `package.json` tem `"engines": { "node": ">=18.0.0" }`

---

### 6. Erro CORS

#### Sintomas:
- "CORS policy" no console
- Requisições bloqueadas
- "Access-Control-Allow-Origin"

#### Causas possíveis:
✅ **Edge Function sem CORS**

Verifique em `/supabase/functions/server/index.tsx`:
```typescript
import { cors } from 'npm:hono/cors'

app.use('*', cors({
  origin: '*',
  credentials: true
}))
```

✅ **URL incorreta nas requisições**

Verifique se está usando:
```typescript
`https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/...`
```

---

### 7. Tripulações não funcionam

#### Sintomas:
- Erro ao criar tripulação
- Não consegue entrar
- ID não funciona

#### Causas possíveis:
✅ **KV Store não configurado**

Veja solução #4 (Tabela KV)

✅ **Validação falhando**

Verifique:
- Nome da tripulação preenchido
- Nome do personagem preenchido
- Usuário autenticado

---

### 8. Sessão de Mestre não inicia

#### Sintomas:
- Botão não funciona
- "Session not found"
- Erro ao iniciar

#### Causas possíveis:
✅ **Não é o capitão**

Apenas o capitão pode iniciar sessões.

✅ **Tripulação inválida**

Recrie a tripulação.

---

### 9. PDF não gera

#### Sintomas:
- Botão Download PDF não funciona
- Erro no console
- Arquivo não baixa

#### Causas possíveis:
✅ **Biblioteca jsPDF não carregada**

```bash
npm install jspdf
npm run build
vercel --prod
```

✅ **Dados do personagem inválidos**

Verifique se todos os campos estão preenchidos.

---

### 10. Tema não persiste

#### Sintomas:
- Tema volta ao padrão após reload
- LocalStorage não funciona

#### Causas possíveis:
✅ **LocalStorage bloqueado**

- Verifique configurações do navegador
- Teste em modo anônimo
- Verifique se site está em HTTPS

---

## 🔍 Como Investigar Erros

### 1. Logs do Vercel
```bash
vercel logs --follow
```

Ou no Dashboard:
- Deployments > [Seu Deploy] > Logs

### 2. Logs do Supabase
```bash
supabase functions logs server --follow
```

Ou no Dashboard:
- Functions > server > Logs

### 3. Console do Navegador
- Abra DevTools (F12)
- Vá para Console
- Veja erros em vermelho
- Verifique Network tab

### 4. Verificar Variáveis
```bash
# Listar variáveis
vercel env ls

# Ver valor específico
vercel env pull .env.local
cat .env.local
```

---

## 🛠️ Comandos Úteis para Debug

```bash
# Verificar status
vercel ls

# Ver logs em tempo real
vercel logs --follow

# Rebuild
vercel --force

# Limpar cache e rebuild
vercel --force --prod

# Testar localmente
npm run build
npm run preview

# Verificar Edge Functions
supabase functions list
supabase functions logs server

# Verificar banco
supabase db remote show
```

---

## 📊 Checklist de Diagnóstico

Execute estes comandos em ordem:

```bash
# 1. Verificar instalação
node -v
npm -v
vercel --version
supabase --version

# 2. Verificar arquivos
ls -la .nvmrc .node-version vercel.json vite.config.ts

# 3. Verificar variáveis
vercel env ls

# 4. Build local
npm run build

# 5. Ver logs
vercel logs
supabase functions logs server

# 6. Health check
curl -I https://seu-site.vercel.app
```

---

## 🆘 Ainda com problemas?

### Resetar tudo e recomeçar:

```bash
# 1. Limpar local
npm run clean
rm -rf node_modules package-lock.json
npm install

# 2. Rebuild
npm run build

# 3. Redeploy Edge Functions
supabase functions deploy server

# 4. Redeploy Vercel
vercel --prod --force

# 5. Verificar
vercel logs --follow
```

---

## 📞 Suporte

### Links Úteis:
- [Vercel Status](https://www.vercel-status.com/)
- [Supabase Status](https://status.supabase.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Community:
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com/)

---

## ✅ Verificação Pós-Fix

Após resolver o problema, teste:

- [ ] Site carrega
- [ ] Login funciona
- [ ] Criar personagem funciona
- [ ] Upload de foto funciona
- [ ] Fórum funciona
- [ ] Tripulações funcionam
- [ ] PDF funciona
- [ ] Tema persiste

---

**Última atualização:** Dezembro 2024

**Versão:** 1.0
