# ✅ Checklist de Deploy - One Piece RPG

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

---

## 📋 PRÉ-DEPLOY

### Supabase
- [ ] Projeto criado no Supabase
- [ ] Tabela `kv_store_a9a64c9e` criada
- [ ] Edge Function `server` deployada
- [ ] Storage bucket configurado (ou será criado automaticamente)
- [ ] Credenciais anotadas:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (apenas para Edge Functions)

### Vercel
- [ ] Conta criada no Vercel
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

---

## 🚀 DURANTE O DEPLOY

### Build
- [ ] Build executado com sucesso
- [ ] Sem erros de TypeScript
- [ ] Sem warnings críticos
- [ ] Tamanho dos chunks adequado (< 1MB)

### Vercel Dashboard
- [ ] Deploy status: Ready
- [ ] Build logs sem erros
- [ ] Runtime logs sem erros
- [ ] Preview URL acessível

---

## ✅ PÓS-DEPLOY

### Testes Funcionais

#### Autenticação
- [ ] Página de login carrega
- [ ] Cadastro de novo usuário funciona
- [ ] Login com usuário existente funciona
- [ ] Logout funciona
- [ ] Mensagens de erro aparecem corretamente

#### Personagens
- [ ] Lista de personagens carrega
- [ ] Criar novo personagem funciona
- [ ] Upload de foto do personagem funciona
- [ ] Editar personagem funciona
- [ ] Excluir personagem funciona
- [ ] Visualizar ficha completa funciona
- [ ] Download PDF funciona

#### Tripulações
- [ ] Criar tripulação funciona
- [ ] Entrar em tripulação funciona
- [ ] Entrar por ID funciona
- [ ] Copiar ID funciona
- [ ] Ver membros funciona
- [ ] Sair da tripulação funciona
- [ ] Iniciar sessão (capitão) funciona

#### Fórum
- [ ] Lista de posts carrega
- [ ] Criar novo post funciona
- [ ] Editar post próprio funciona
- [ ] Excluir post próprio funciona
- [ ] Comentar funciona
- [ ] Curtir funciona
- [ ] Filtro por categoria funciona
- [ ] Galeria de artes exibe imagens

#### Recursos RPG
- [ ] Modal de recursos abre
- [ ] Conteúdo carrega corretamente
- [ ] Navegação funciona

#### Temas
- [ ] Alternar entre temas funciona
- [ ] Tema persiste após reload
- [ ] Todos os componentes respeitam o tema

### Testes de Performance
- [ ] Primeira carga < 3s
- [ ] Navegação rápida entre páginas
- [ ] Imagens carregam corretamente
- [ ] Sem travamentos ou lentidão

### Testes de Responsividade
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)
- [ ] Todos os botões são clicáveis
- [ ] Textos são legíveis
- [ ] Imagens não quebram layout

### Testes de Segurança
- [ ] `SUPABASE_SERVICE_ROLE_KEY` NÃO está no frontend
- [ ] Apenas usuário autenticado acessa funcionalidades
- [ ] Usuário só edita/exclui seus próprios dados
- [ ] Upload de imagens seguro
- [ ] Sem dados sensíveis nos logs

---

## 🐛 TROUBLESHOOTING

### Se o site não carrega:
1. [ ] Verifique as variáveis de ambiente no Vercel
2. [ ] Verifique se usou o prefixo `VITE_`
3. [ ] Verifique os logs de build no Vercel
4. [ ] Verifique o Console do navegador (F12)

### Se a autenticação não funciona:
1. [ ] Verifique se a Edge Function foi deployada
2. [ ] Verifique os logs da Edge Function no Supabase
3. [ ] Verifique se a URL do Supabase está correta
4. [ ] Verifique se a chave anon está correta

### Se o upload não funciona:
1. [ ] Verifique se o bucket existe no Supabase Storage
2. [ ] Verifique as permissões do bucket
3. [ ] Verifique os logs da Edge Function

### Se o fórum não funciona:
1. [ ] Verifique se a tabela `kv_store_a9a64c9e` existe
2. [ ] Verifique os logs da Edge Function
3. [ ] Verifique o Console do navegador

---

## 📞 SUPORTE

### Logs Importantes

**Vercel:**
- Dashboard > Deployments > [Seu Deploy] > Logs

**Supabase:**
- Functions > server > Logs
- Table Editor > kv_store_a9a64c9e
- Storage > Buckets

**Navegador:**
- F12 > Console
- F12 > Network
- F12 > Application > Local Storage

### Recursos Úteis
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vite](https://vitejs.dev/)

---

## ✨ DEPLOY CONCLUÍDO!

Parabéns! Seu site One Piece RPG está no ar! 🏴‍☠️⚓

**URL do Projeto:** `https://seu-projeto.vercel.app`

Compartilhe com seus amigos e divirta-se! 🎉
