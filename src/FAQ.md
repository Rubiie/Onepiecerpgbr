# ❓ FAQ - Perguntas Frequentes

## 📋 Índice
1. [Sobre o Projeto](#sobre-o-projeto)
2. [Deploy e Hospedagem](#deploy-e-hospedagem)
3. [Configuração](#configuração)
4. [Funcionalidades](#funcionalidades)
5. [Problemas Técnicos](#problemas-técnicos)
6. [Custos](#custos)
7. [Segurança](#segurança)

---

## 🎮 Sobre o Projeto

### O que é este projeto?
Sistema completo de RPG baseado em One Piece onde jogadores podem criar fichas de personagens, formar tripulações e participar de sessões de jogo.

### Quais funcionalidades estão incluídas?
- ✅ Sistema de autenticação (cadastro/login)
- ✅ Criação e edição de fichas de personagens
- ✅ Akuma no Mi (Frutas do Diabo)
- ✅ Sistema de Haki (3 tipos)
- ✅ Upload de fotos de personagens
- ✅ Download de fichas em PDF
- ✅ Sistema de tripulações
- ✅ Fórum da comunidade
- ✅ Recursos e guias de RPG
- ✅ Temas claro/escuro

### É gratuito?
Sim! O projeto usa planos gratuitos (Hobby) do Vercel e Supabase.

---

## 🚀 Deploy e Hospedagem

### Onde hospedar?
- **Frontend:** Vercel (recomendado) ou Netlify
- **Backend:** Supabase Edge Functions
- **Banco:** Supabase PostgreSQL
- **Storage:** Supabase Storage

### Quanto tempo leva para fazer deploy?
- Deploy inicial: **10-15 minutos**
- Deploys subsequentes: **2-5 minutos** (automático)

### Preciso saber programar?
Para usar: **Não**
Para fazer deploy: **Conhecimento básico de terminal/CLI**
Para modificar: **Sim** (React/TypeScript)

### Posso usar meu próprio domínio?
Sim! No Vercel:
1. Settings > Domains
2. Add Domain
3. Configure DNS conforme instruções

---

## ⚙️ Configuração

### Quais variáveis de ambiente preciso?
Apenas 2 (no Vercel):
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Onde encontro essas credenciais?
Supabase Dashboard > Settings > API
- Project URL
- anon public key

### Preciso configurar banco de dados?
A tabela `kv_store_a9a64c9e` é criada automaticamente.
Se não funcionar, execute o SQL fornecido no TROUBLESHOOTING.md

### Como atualizar o site?
```bash
# Fazer alterações no código
git add .
git commit -m "Descrição"
git push

# Vercel faz deploy automático!
```

---

## 🎯 Funcionalidades

### Quantos personagens posso criar?
Ilimitado! Cada usuário pode criar quantos quiser.

### Como funciona o sistema de tripulações?
1. Jogador cria tripulação (vira capitão)
2. Capitão compartilha o ID
3. Outros jogadores entram com o ID
4. Capitão inicia sessões de jogo

### Posso ter múltiplos mestres?
Não, apenas o capitão da tripulação pode iniciar sessões.

### Como compartilhar imagens no fórum?
Use serviços de hospedagem como:
- Imgur (https://imgur.com)
- ImgBB (https://imgbb.com)
- Copie a URL direta da imagem

### O PDF inclui tudo?
Sim! Inclui:
- Foto do personagem
- Todos os atributos
- Habilidades
- Akuma no Mi
- Haki
- Background

---

## 🐛 Problemas Técnicos

### Site não carrega
1. Verifique variáveis de ambiente
2. Use prefixo `VITE_`
3. Veja [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Login não funciona
1. Verifique se Edge Functions foram deployadas
2. Veja logs: `supabase functions logs server`

### Upload de foto falha
1. Bucket é criado automaticamente
2. Se falhar, crie manualmente no Supabase Storage
3. Nome: `make-a9a64c9e-character-photos`

### Como ver erros?
```bash
# Logs do Vercel
vercel logs --follow

# Logs do Supabase
supabase functions logs server --follow

# Console do navegador
F12 > Console
```

---

## 💰 Custos

### É realmente grátis?
Sim, com limitações do plano Hobby:

**Vercel (Free):**
- 100 GB bandwidth/mês
- Deploy ilimitado
- Preview ilimitado
- HTTPS automático

**Supabase (Free):**
- 500 MB database
- 1 GB storage
- 50.000 usuários ativos/mês
- 2 GB bandwidth

### Quando preciso pagar?
Quando ultrapassar os limites acima. Para um grupo de RPG, o plano gratuito é mais que suficiente!

### Quanto custa escalar?
**Vercel Pro:** $20/mês
**Supabase Pro:** $25/mês

Mas para RPG com amigos, gratuito é suficiente.

---

## 🔒 Segurança

### Os dados estão seguros?
Sim!
- ✅ HTTPS automático (Vercel)
- ✅ Autenticação JWT (Supabase)
- ✅ Headers de segurança configurados
- ✅ Service Role Key apenas no backend

### Senhas são criptografadas?
Sim, pelo Supabase Auth (bcrypt).

### Posso adicionar autenticação social?
Sim! Supabase suporta:
- Google
- Facebook
- GitHub
- Discord

Configure em: Supabase Dashboard > Authentication > Providers

### Como proteger contra spam?
1. Configure rate limiting no Supabase
2. Adicione captcha (opcional)
3. Configure email verification

---

## 🔄 Atualizações

### Como atualizar dependências?
```bash
npm outdated
npm update
npm audit fix
```

### Como atualizar Edge Functions?
```bash
supabase functions deploy server
```

### Atualizações automáticas?
Sim, com GitHub Actions (opcional):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
```

---

## 🎨 Customização

### Como mudar cores?
Edite `/styles/globals.css`:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  /* ... */
}
```

### Como adicionar novas funcionalidades?
1. Crie componente em `/components/`
2. Importe no `App.tsx`
3. Adicione rotas se necessário

### Posso mudar o tema One Piece?
Sim! É só alterar:
- Textos
- Cores em globals.css
- Nomes de funcionalidades
- Imagens/ícones

---

## 📱 Mobile

### Funciona no celular?
Sim! O site é totalmente responsivo.

### Tem app mobile?
Não, mas você pode criar um PWA:
1. Adicione `manifest.json`
2. Configure service worker
3. Instale como app no celular

---

## 🤝 Contribuição

### Posso contribuir?
Sim! Faça um fork e envie pull requests.

### Como reportar bugs?
1. Verifique se já foi reportado
2. Inclua:
   - Passos para reproduzir
   - Screenshots
   - Logs de erro
   - Ambiente (browser, OS)

### Tem roadmap?
Funcionalidades planejadas:
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Chat em tempo real
- [ ] Sistema de combate
- [ ] Mapa interativo
- [ ] Inventário de itens

---

## 📚 Documentação

### Onde encontro mais informações?
- [README.md](./README.md) - Visão geral
- [QUICK_START.md](./QUICK_START.md) - Início rápido
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - Deploy completo
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Resolver problemas
- [COMANDOS_UTEIS.md](./COMANDOS_UTEIS.md) - Referência

### Tem tutorial em vídeo?
Não ainda, mas você pode seguir os guias passo a passo.

---

## 🌍 Internacionalização

### Suporta outros idiomas?
Atualmente apenas Português (PT-BR).

### Como adicionar outro idioma?
1. Instale `react-i18next`
2. Crie arquivos de tradução
3. Envolva componentes com `useTranslation`

---

## 🔧 Desenvolvimento

### Como rodar localmente?
```bash
git clone <repo>
cd one-piece-rpg
npm install
npm run dev
```

### Preciso configurar Supabase localmente?
Não obrigatório, mas recomendado:
```bash
supabase init
supabase start
supabase functions serve server
```

### Como testar antes de deploy?
```bash
npm run build
npm run preview
```

---

## 💡 Dicas

### Melhor prática para deploy
1. Teste localmente primeiro
2. Use branches para features
3. Deploy preview para testar
4. Deploy produção quando estável

### Como fazer backup?
**Banco de dados:**
```bash
supabase db dump -f backup.sql
```

**Código:**
Use Git/GitHub

**Imagens:**
Export do Supabase Storage

### Monitoramento
Configure alertas:
- Vercel: Analytics & Speed Insights
- Supabase: Database metrics
- Sentry: Error tracking (opcional)

---

## 📞 Suporte

### Ainda tem dúvidas?
1. Leia [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Veja [Vercel Docs](https://vercel.com/docs)
3. Veja [Supabase Docs](https://supabase.com/docs)
4. Abra uma issue no GitHub

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com/)

---

**Não encontrou sua pergunta?** Abra uma issue! 

**Última atualização:** Dezembro 2024
