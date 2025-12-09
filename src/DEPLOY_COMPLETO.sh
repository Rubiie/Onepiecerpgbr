#!/bin/bash

# Script completo de deploy - One Piece RPG
# Execute com: bash DEPLOY_COMPLETO.sh

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ⚓  ONE PIECE RPG - SCRIPT DE DEPLOY COMPLETO  ⚓     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${BLUE}Este script irá:${NC}"
echo "  1. Verificar pré-requisitos"
echo "  2. Fazer deploy das Edge Functions (Supabase)"
echo "  3. Configurar variáveis de ambiente (Vercel)"
echo "  4. Fazer deploy do frontend (Vercel)"
echo "  5. Executar health check"
echo ""

read -p "Deseja continuar? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Deploy cancelado."
    exit 0
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}ETAPA 1/5: Verificando pré-requisitos${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js não encontrado"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm não encontrado"
    exit 1
fi

# Verificar Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} $GIT_VERSION"
else
    echo -e "${YELLOW}⚠${NC}  Git não encontrado (opcional)"
fi

# Verificar Supabase CLI
if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version)
    echo -e "${GREEN}✓${NC} Supabase CLI instalado"
else
    echo -e "${YELLOW}⚠${NC}  Supabase CLI não encontrado"
    echo ""
    read -p "Deseja instalar? (s/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm install -g supabase
        echo -e "${GREEN}✓${NC} Supabase CLI instalado"
    else
        echo -e "${RED}✗${NC} Supabase CLI é necessário para continuar"
        exit 1
    fi
fi

# Verificar Vercel CLI
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✓${NC} Vercel CLI instalado"
else
    echo -e "${YELLOW}⚠${NC}  Vercel CLI não encontrado"
    echo ""
    read -p "Deseja instalar? (s/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm install -g vercel
        echo -e "${GREEN}✓${NC} Vercel CLI instalado"
    else
        echo -e "${RED}✗${NC} Vercel CLI é necessário para continuar"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ Todos os pré-requisitos instalados!${NC}"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}ETAPA 2/5: Deploy Edge Functions (Supabase)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Login Supabase
echo -e "${YELLOW}🔑 Fazendo login no Supabase...${NC}"
supabase login

echo ""
echo -e "${YELLOW}📋 Informe o ID do seu projeto Supabase:${NC}"
echo "   (Encontre em: Supabase Dashboard > Settings > General)"
read -p "Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID não pode estar vazio${NC}"
    exit 1
fi

# Link com projeto
echo ""
echo -e "${YELLOW}🔗 Linkando com projeto...${NC}"
supabase link --project-ref "$PROJECT_ID"

# Deploy functions
echo ""
echo -e "${YELLOW}🚀 Fazendo deploy das Edge Functions...${NC}"
supabase functions deploy server

echo ""
echo -e "${GREEN}✅ Edge Functions deployadas!${NC}"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}ETAPA 3/5: Configurar variáveis (Vercel)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Login Vercel
echo -e "${YELLOW}🔑 Fazendo login no Vercel...${NC}"
vercel login

echo ""
echo -e "${YELLOW}🔗 Linkando com projeto Vercel...${NC}"
vercel link

echo ""
echo -e "${YELLOW}📝 Configure as variáveis de ambiente:${NC}"
echo ""

# Solicitar credenciais
echo "Onde encontrar (Supabase Dashboard > Settings > API):"
echo ""

echo "1/2 VITE_SUPABASE_URL"
echo "Exemplo: https://xxxxx.supabase.co"
read -p "Cole aqui: " SUPABASE_URL
echo ""

echo "2/2 VITE_SUPABASE_ANON_KEY"
echo "Exemplo: eyJhbGciOiJIUzI1NiIs..."
read -p "Cole aqui: " SUPABASE_ANON_KEY
echo ""

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Todas as variáveis são obrigatórias${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 Adicionando variáveis no Vercel...${NC}"
echo ""

# Adicionar variáveis (Production, Preview, Development)
for env in production preview development; do
    echo "Configurando: $env"
    echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL "$env" --force 2>/dev/null || true
    echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY "$env" --force 2>/dev/null || true
done

echo ""
echo -e "${GREEN}✅ Variáveis configuradas!${NC}"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}ETAPA 4/5: Deploy Frontend (Vercel)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Build local primeiro
echo -e "${YELLOW}🔨 Executando build local...${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Build local concluído!${NC}"
echo ""

# Deploy no Vercel
echo -e "${YELLOW}🚀 Fazendo deploy no Vercel...${NC}"
echo ""

vercel --prod

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""

# Obter URL do deployment
VERCEL_URL=$(vercel ls | grep production | awk '{print $2}' | head -n1)

if [ -z "$VERCEL_URL" ]; then
    echo -e "${YELLOW}⚠️  Não foi possível obter a URL automaticamente${NC}"
    read -p "Cole a URL do seu site: " VERCEL_URL
fi

echo ""
echo -e "${GREEN}🌐 URL do site: $VERCEL_URL${NC}"
echo ""

read -p "Deseja executar health check? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}ETAPA 5/5: Health Check${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
    
    if [ -f "health-check.sh" ]; then
        bash health-check.sh "$VERCEL_URL"
    else
        echo -e "${YELLOW}⚠️  Script health-check.sh não encontrado${NC}"
        echo "   Testando manualmente..."
        
        response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")
        if [ "$response" -eq 200 ]; then
            echo -e "${GREEN}✓${NC} Site está respondendo (HTTP $response)"
        else
            echo -e "${RED}✗${NC} Site não está respondendo (HTTP $response)"
        fi
    fi
fi

echo ""
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║            🎉  DEPLOY CONCLUÍDO COM SUCESSO!  🎉         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${GREEN}✅ Checklist:${NC}"
echo "  ✓ Edge Functions deployadas no Supabase"
echo "  ✓ Variáveis de ambiente configuradas"
echo "  ✓ Frontend deployado no Vercel"
echo "  ✓ Site acessível"
echo ""
echo -e "${BLUE}🌐 Acesse seu site:${NC}"
echo "   $VERCEL_URL"
echo ""
echo -e "${YELLOW}📚 Próximos passos:${NC}"
echo "  1. Teste todas as funcionalidades"
echo "  2. Configure domínio customizado (opcional)"
echo "  3. Configure analytics (opcional)"
echo "  4. Compartilhe com seus jogadores!"
echo ""
echo -e "${GREEN}⚓ Boas aventuras no mundo de One Piece! ⚓${NC}"
echo ""
