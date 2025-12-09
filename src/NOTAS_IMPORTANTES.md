# ⚠️ Notas Importantes - One Piece RPG

## 📦 Dependências Críticas

### Supabase JS Client

```json
"@supabase/supabase-js": "^2.x.x"
```

**Por que usar `^2.x.x`?**

✅ **Compatibilidade:** Garante que qualquer versão 2.x será instalada
✅ **Atualizações:** Recebe patches e melhorias automaticamente
✅ **Estabilidade:** Versão 2.x é estável e testada
✅ **Edge Functions:** Compatível com Supabase Edge Functions

**Versões compatíveis:**
- ✅ 2.39.0 (atual)
- ✅ 2.40.x (futuras)
- ✅ 2.x.x (qualquer patch/minor da v2)

**Nota:** Quando a v3 for lançada, será necessário atualizar manualmente.

---

## 🔧 Compatibilidade de Versões

### Frontend (Vercel)

| Pacote | Versão | Notas |
|--------|--------|-------|
| `react` | `^18.2.0` | React 18 com Concurrent Features |
| `react-dom` | `^18.2.0` | DOM bindings para React 18 |
| `@supabase/supabase-js` | `^2.x.x` | ⚠️ IMPORTANTE: Versão 2.x |
| `vite` | `^5.0.0` | Build tool rápido |
| `typescript` | `^5.3.0` | TypeScript 5 |
| `tailwindcss` | `^4.0.0` | Tailwind v4 (CSS-first) |

### Backend (Supabase Edge Functions)

| Pacote | Versão | Import |
|--------|--------|--------|
| `@supabase/supabase-js` | `2.x` | `npm:@supabase/supabase-js@2` |
| `hono` | `latest` | `npm:hono` |
| `hono/cors` | `latest` | `npm:hono/cors` |
| `hono/logger` | `latest` | `npm:hono/logger` |

---

## ⚠️ Problemas Conhecidos e Soluções

### 1. Erro de versão do Supabase

**Problema:**
```
Error: @supabase/supabase-js version mismatch
```

**Solução:**
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json

# Reinstalar com versão correta
npm install @supabase/supabase-js@^2.x.x

# Verificar versão instalada
npm list @supabase/supabase-js
```

### 2. Diferença entre Frontend e Backend

**Frontend (Vercel):**
```typescript
// App.tsx
import { createClient } from '@supabase/supabase-js@2'
```

**Backend (Supabase Edge Functions):**
```typescript
// index.tsx
import { createClient } from 'npm:@supabase/supabase-js@2'
```

⚠️ **Importante:** Note o prefixo `npm:` nas Edge Functions!

### 3. TypeScript e Auto-complete

Se o TypeScript não reconhecer os tipos do Supabase:

```bash
# Instalar types (se necessário)
npm install -D @types/node

# Verificar tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true,  // ← Importante
    "moduleResolution": "bundler"
  }
}
```

---

## 🔄 Atualizações Futuras

### Quando atualizar dependências?

**Recomendado:**
```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar patches/minor (seguro)
npm update

# Verificar após atualização
npm run verify
```

**Cuidado com:**
- ❌ Supabase v3 (breaking changes)
- ❌ React v19 (ainda em beta)
- ❌ Vite v6 (pode ter mudanças)
- ❌ Tailwind v5 (não existe ainda)

### Versões fixas vs. flexíveis

```json
{
  "dependencies": {
    // Flexível (recomendado para libraries estáveis)
    "@supabase/supabase-js": "^2.x.x",  // ✅
    
    // Semi-flexível
    "react": "^18.2.0",  // ✅
    
    // Fixa (não recomendado, exceto para bugs conhecidos)
    "sonner": "2.0.3"  // ⚠️
    
    // Latest (use com cuidado)
    "lucide-react": "latest"  // ⚠️
  }
}
```

---

## 📝 Migrações de Versão

### Se precisar atualizar Supabase v2 → v3 (futuro)

1. **Ler changelog:** https://github.com/supabase/supabase-js/releases
2. **Testar em branch separado**
3. **Verificar breaking changes**
4. **Atualizar código conforme necessário**
5. **Testar localmente**
6. **Deploy em preview (Vercel)**
7. **Deploy em produção**

---

## 🔐 Variáveis de Ambiente

### Versionamento

As credenciais do Supabase **não mudam** com atualizações do `@supabase/supabase-js`.

```bash
# Essas variáveis são fixas (não dependem da versão)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Quando mudam?**
- ❌ Nunca por atualização de pacote
- ✅ Apenas se você recriar o projeto Supabase
- ✅ Ou se regenerar as chaves manualmente

---

## 🚀 Performance

### Bundle Size com Supabase

```
@supabase/supabase-js (v2.x):
- Minified: ~80 KB
- Gzipped: ~25 KB

Otimizações aplicadas:
✅ Tree shaking automático (Vite)
✅ Code splitting (vite.config.ts)
✅ Chunk separado para Supabase
```

### Lazy Loading

Se quiser reduzir bundle inicial:

```typescript
// Carregar Supabase sob demanda
const loadSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js@2');
  return createClient(url, key);
};
```

---

## 📚 Documentação de Referência

### Supabase JS v2
- Docs: https://supabase.com/docs/reference/javascript
- GitHub: https://github.com/supabase/supabase-js
- Changelog: https://github.com/supabase/supabase-js/releases

### Versões Específicas
- v2.39.0: https://github.com/supabase/supabase-js/releases/tag/v2.39.0
- Todas v2.x: https://github.com/supabase/supabase-js/releases?q=v2

---

## ✅ Checklist de Compatibilidade

Antes de fazer deploy:

- [ ] `@supabase/supabase-js` está como `^2.x.x` no package.json
- [ ] `npm install` executa sem erros
- [ ] `npm run build` executa com sucesso
- [ ] `npm run verify` passa sem erros
- [ ] TypeScript não mostra erros de tipo
- [ ] Edge Functions usam `npm:@supabase/supabase-js@2`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Site funciona localmente (`npm run dev`)
- [ ] Preview deploy funciona no Vercel
- [ ] Produção deploy funciona no Vercel

---

## 🔍 Debugging

### Verificar versão instalada

```bash
# Ver versão exata instalada
npm list @supabase/supabase-js

# Ver todas as dependências
npm list

# Ver apenas dependências de produção
npm list --prod

# Ver árvore completa
npm list --all
```

### Logs úteis

```bash
# Build com logs detalhados
npm run build -- --debug

# Verificar imports
grep -r "supabase-js" .

# Ver tamanho dos chunks
npm run build && ls -lh dist/assets/
```

---

## 💡 Dicas Finais

### ✅ Faça

1. Use `^2.x.x` para flexibilidade
2. Execute `npm update` regularmente
3. Teste antes de deploy
4. Leia changelogs de atualizações
5. Mantenha backups do código

### ❌ Evite

1. Usar versões fixas sem motivo
2. Atualizar sem testar
3. Misturar v1 e v2 do Supabase
4. Esquecer de atualizar Edge Functions
5. Ignorar avisos de deprecation

---

## 📞 Suporte

**Problemas com versão do Supabase?**

1. Veja [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Veja [FAQ.md](./FAQ.md)
3. GitHub Issues: https://github.com/supabase/supabase-js/issues
4. Discord Supabase: https://discord.supabase.com/

---

**Última atualização:** Dezembro 2024

**Versão do documento:** 1.0

**Versão Supabase recomendada:** ^2.x.x
