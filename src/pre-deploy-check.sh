#!/bin/bash

# Script de verificação pré-deploy
# Execute com: bash pre-deploy-check.sh

echo "🔍 Verificando configuração do projeto..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js instalado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js não encontrado"
    errors=$((errors+1))
fi

# Verificar npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm instalado: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm não encontrado"
    errors=$((errors+1))
fi

# Verificar package.json
echo ""
echo "📄 Verificando arquivos de configuração..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json encontrado"
else
    echo -e "${RED}✗${NC} package.json não encontrado"
    errors=$((errors+1))
fi

# Verificar vercel.json
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json encontrado"
else
    echo -e "${YELLOW}⚠${NC} vercel.json não encontrado"
    warnings=$((warnings+1))
fi

# Verificar vite.config.ts
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✓${NC} vite.config.ts encontrado"
else
    echo -e "${RED}✗${NC} vite.config.ts não encontrado"
    errors=$((errors+1))
fi

# Verificar tsconfig.json
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓${NC} tsconfig.json encontrado"
else
    echo -e "${RED}✗${NC} tsconfig.json não encontrado"
    errors=$((errors+1))
fi

# Verificar .gitignore
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore encontrado"
else
    echo -e "${YELLOW}⚠${NC} .gitignore não encontrado"
    warnings=$((warnings+1))
fi

# Verificar node_modules
echo ""
echo "📚 Verificando dependências..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
else
    echo -e "${YELLOW}⚠${NC} node_modules não encontrado. Execute: npm install"
    warnings=$((warnings+1))
fi

# Verificar arquivos principais
echo ""
echo "📝 Verificando arquivos principais..."
files=("App.tsx" "main.tsx" "index.html")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file encontrado"
    else
        echo -e "${RED}✗${NC} $file não encontrado"
        errors=$((errors+1))
    fi
done

# Verificar diretório supabase
echo ""
echo "🗄️ Verificando backend..."
if [ -d "supabase/functions/server" ]; then
    echo -e "${GREEN}✓${NC} Edge Functions encontradas"
    if [ -f "supabase/functions/server/index.tsx" ]; then
        echo -e "${GREEN}✓${NC} server/index.tsx encontrado"
    else
        echo -e "${RED}✗${NC} server/index.tsx não encontrado"
        errors=$((errors+1))
    fi
else
    echo -e "${YELLOW}⚠${NC} Pasta supabase/functions/server não encontrada"
    warnings=$((warnings+1))
fi

# Tentar build
echo ""
echo "🔨 Testando build..."
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓${NC} Build executado com sucesso"
    
    # Verificar se dist foi criado
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} Diretório dist criado"
        
        # Verificar tamanho do dist
        SIZE=$(du -sh dist | cut -f1)
        echo -e "${GREEN}✓${NC} Tamanho do build: $SIZE"
    else
        echo -e "${RED}✗${NC} Diretório dist não foi criado"
        errors=$((errors+1))
    fi
else
    echo -e "${RED}✗${NC} Build falhou"
    errors=$((errors+1))
fi

# Resultado final
echo ""
echo "================================"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ Projeto pronto para deploy!${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Projeto pronto, mas com $warnings avisos${NC}"
    exit 0
else
    echo -e "${RED}✗ Encontrados $errors erros e $warnings avisos${NC}"
    echo -e "${RED}Corrija os erros antes de fazer deploy${NC}"
    exit 1
fi
