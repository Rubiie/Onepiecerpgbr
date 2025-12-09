# 🚀 Guia de Deploy no Vercel - One Piece RPG

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Conta no [Supabase](https://supabase.com)
3. Projeto Supabase configurado com as Edge Functions

---

## 🔧 Passo 1: Configurar o Supabase

### 1.1 Deploy das Edge Functions

As Edge Functions do Supabase devem ser deployadas no Supabase (não no Vercel):

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy das functions
supabase functions deploy server
```

### 1.2 Obter as Credenciais

No painel do Supabase (Settings > API):
- `SUPABASE_URL`: URL do projeto
- `SUPABASE_ANON_KEY`: Chave pública anon
- `SUPABASE_SERVICE_ROLE_KEY`: Chave privada (service role)

---

## 🌐 Passo 2: Deploy no Vercel

### 2.1 Via Dashboard do Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em **"Deploy"**

### 2.2 Via CLI do Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

No Vercel, adicione as seguintes variáveis de ambiente:

### Variáveis Obrigatórias:

| Variável | Valor | Onde Encontrar |
|----------|-------|----------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase > Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase > Settings > API > anon public |

### Como Adicionar no Vercel:

1. Vá para seu projeto no Vercel
2. Clique em **"Settings"**
3. Clique em **"Environment Variables"**
4. Adicione cada variável:
   - Key: `VITE_SUPABASE_URL`
   - Value: Cole a URL do Supabase
   - Environment: Selecione **Production, Preview, Development**
5. Repita para `VITE_SUPABASE_ANON_KEY`
6. Clique em **"Save"**

---

## 🗄️ Passo 4: Configurar o Banco de Dados

### 4.1 Tabela KV Store

A tabela `kv_store_a9a64c9e` já deve estar criada no Supabase. Verifique no SQL Editor:

```sql
-- Verificar se a tabela existe
SELECT * FROM kv_store_a9a64c9e LIMIT 1;

-- Se não existir, criar:
CREATE TABLE IF NOT EXISTS kv_store_a9a64c9e (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_a9a64c9e(key text_pattern_ops);
```

### 4.2 Storage Buckets

Os buckets são criados automaticamente pela Edge Function, mas você pode criar manualmente:

1. Vá para **Storage** no painel Supabase
2. Crie um bucket chamado `make-a9a64c9e-character-photos`
3. Configure como **Private**

---

## ✅ Passo 5: Verificar o Deploy

### 5.1 Testes Básicos

Após o deploy, teste:

1. ✅ Página inicial carrega
2. ✅ Cadastro de usuário funciona
3. ✅ Login funciona
4. ✅ Criar personagem funciona
5. ✅ Upload de foto funciona
6. ✅ Criar tripulação funciona
7. ✅ Fórum funciona

### 5.2 Verificar Logs

**No Vercel:**
- Vá para **Deployments**
- Clique no deployment
- Veja os logs de build

**No Supabase:**
- Vá para **Functions**
- Selecione a função `server`
- Veja os logs de execução

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente estão corretas
- Verifique se a Edge Function foi deployada no Supabase

### Erro: "Unauthorized"
- Verifique se o `VITE_SUPABASE_ANON_KEY` está correto
- Verifique se o usuário está autenticado

### Erro: "404 Not Found" nas rotas
- Verifique se o `vercel.json` tem o rewrite correto
- Redeploy o projeto

### Página em branco
- Abra o DevTools (F12) e veja o Console
- Verifique se há erros de JavaScript
- Verifique se as variáveis de ambiente estão definidas

### Upload de imagem não funciona
- Verifique se o bucket foi criado no Supabase
- Verifique se a Edge Function tem permissão para criar buckets
- Verifique os logs da Edge Function

---

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça push para o repositório GitHub
2. Vercel vai fazer deploy automaticamente
3. Para Edge Functions, rode: `supabase functions deploy server`

---

## 📱 Domínio Customizado

Para adicionar um domínio próprio:

1. Vá para **Settings > Domains** no Vercel
2. Adicione seu domínio
3. Configure os DNS conforme instruções do Vercel

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**

- NUNCA exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- Use apenas `VITE_SUPABASE_ANON_KEY` no código React
- `SUPABASE_SERVICE_ROLE_KEY` fica apenas na Edge Function (Supabase)
- Configure Row Level Security (RLS) no Supabase para segurança adicional

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Vercel Dashboard
2. Verifique os logs das Edge Functions no Supabase
3. Verifique o Console do navegador (F12)
4. Entre em contato com o suporte do Vercel ou Supabase

---

## 🎉 Pronto!

Seu site One Piece RPG está no ar! 🏴‍☠️⚓

Acesse: `https://seu-projeto.vercel.app`
