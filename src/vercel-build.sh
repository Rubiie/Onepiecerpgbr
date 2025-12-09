#!/bin/bash

# Script de build customizado para Vercel
# Este script é executado automaticamente durante o deploy

echo "🚀 Iniciando build para One Piece RPG..."
echo ""

# Verificar versão do Node.js
echo "📦 Node.js version:"
node -v
echo ""

# Verificar versão do npm
echo "📦 npm version:"
npm -v
echo ""

# Limpar cache do npm
echo "🧹 Limpando cache..."
npm cache clean --force 2>/dev/null || true
echo ""

# Instalar dependências
echo "📚 Instalando dependências..."
npm ci --prefer-offline --no-audit --legacy-peer-deps
echo ""

# Executar build
echo "🔨 Executando build..."
npm run build
echo ""

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "📊 Tamanho do build:"
    du -sh dist/
    echo ""
    echo "📁 Arquivos gerados:"
    ls -lh dist/
    echo ""
    exit 0
else
    echo "❌ Erro: Diretório dist não foi criado!"
    exit 1
fi
