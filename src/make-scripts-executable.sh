#!/bin/bash

# Script para tornar todos os scripts executáveis
# Execute com: bash make-scripts-executable.sh

echo "🔧 Tornando scripts executáveis..."
echo ""

scripts=(
    "DEPLOY_COMPLETO.sh"
    "pre-deploy-check.sh"
    "setup-env.sh"
    "health-check.sh"
    "vercel-build.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        chmod +x "$script"
        echo "✓ $script agora é executável"
    else
        echo "⚠ $script não encontrado"
    fi
done

echo ""
echo "✅ Pronto! Agora você pode executar os scripts diretamente:"
echo ""
echo "  ./DEPLOY_COMPLETO.sh"
echo "  ./pre-deploy-check.sh"
echo "  ./setup-env.sh"
echo "  ./health-check.sh URL"
echo ""
