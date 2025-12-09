#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Execute com: bash setup-env.sh

echo "🔐 Configuração de Variáveis de Ambiente - Vercel"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado${NC}"
    echo ""
    echo "Instale com: npm install -g vercel"
    echo ""
    read -p "Deseja instalar agora? (s/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm install -g vercel
    else
        echo "Abortando..."
        exit 1
    fi
fi

echo -e "${BLUE}📋 Você precisará das seguintes informações:${NC}"
echo ""
echo "1. VITE_SUPABASE_URL (do Supabase Dashboard)"
echo "2. VITE_SUPABASE_ANON_KEY (do Supabase Dashboard)"
echo ""
echo "Onde encontrar:"
echo "  → Supabase Dashboard"
echo "  → Settings > API"
echo "  → Project URL e anon public key"
echo ""

read -p "Pressione ENTER para continuar..."
echo ""

# Login no Vercel
echo -e "${BLUE}🔑 Fazendo login no Vercel...${NC}"
vercel login
echo ""

# Link com projeto (se ainda não estiver linkado)
echo -e "${BLUE}🔗 Linkando com projeto Vercel...${NC}"
vercel link
echo ""

# Solicitar variáveis
echo -e "${BLUE}📝 Configure as variáveis de ambiente:${NC}"
echo ""

# VITE_SUPABASE_URL
echo -e "${GREEN}1/2${NC} VITE_SUPABASE_URL"
echo "Exemplo: https://xxxxx.supabase.co"
read -p "Cole aqui: " SUPABASE_URL
echo ""

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ URL não pode estar vazia${NC}"
    exit 1
fi

# VITE_SUPABASE_ANON_KEY
echo -e "${GREEN}2/2${NC} VITE_SUPABASE_ANON_KEY"
echo "Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6..."
read -p "Cole aqui: " SUPABASE_ANON_KEY
echo ""

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Anon Key não pode estar vazia${NC}"
    exit 1
fi

# Adicionar variáveis no Vercel
echo -e "${BLUE}📤 Adicionando variáveis no Vercel...${NC}"
echo ""

# Production
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production

# Preview
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL preview
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY preview

# Development
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL development
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY development

echo ""
echo -e "${GREEN}✅ Variáveis configuradas com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Variáveis adicionadas:${NC}"
echo "  • VITE_SUPABASE_URL"
echo "  • VITE_SUPABASE_ANON_KEY"
echo ""
echo -e "${YELLOW}⚠️  Importante:${NC}"
echo "  • Nunca exponha SUPABASE_SERVICE_ROLE_KEY no frontend"
echo "  • Essa chave fica apenas nas Edge Functions (Supabase)"
echo ""
echo -e "${GREEN}🚀 Próximo passo:${NC}"
echo "  Execute: vercel --prod"
echo ""
