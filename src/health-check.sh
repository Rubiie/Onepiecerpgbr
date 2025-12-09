#!/bin/bash

# Script de health check pós-deploy
# Execute com: bash health-check.sh URL_DO_SITE

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se URL foi fornecida
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: URL não fornecida${NC}"
    echo ""
    echo "Uso: bash health-check.sh https://seu-site.vercel.app"
    exit 1
fi

URL=$1
echo -e "${BLUE}🏥 Health Check - One Piece RPG${NC}"
echo "=================================="
echo ""
echo "🌐 URL: $URL"
echo ""

# Contador de testes
total=0
passed=0
failed=0

# Função para testar endpoint
test_endpoint() {
    local endpoint=$1
    local expected_code=$2
    local description=$3
    
    total=$((total + 1))
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$URL$endpoint" --max-time 10)
    
    if [ "$response" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} ($response)"
        passed=$((passed + 1))
    else
        echo -e "${RED}✗${NC} (Expected: $expected_code, Got: $response)"
        failed=$((failed + 1))
    fi
}

# Testes
echo "🧪 Executando testes..."
echo ""

test_endpoint "/" 200 "Página principal"
test_endpoint "/index.html" 200 "index.html"
test_endpoint "/favicon.svg" 200 "Favicon"
test_endpoint "/robots.txt" 200 "robots.txt"
test_endpoint "/404-not-found" 200 "SPA Routing (deve redirecionar para /)"

# Verificar se site carrega conteúdo
echo ""
echo "📄 Verificando conteúdo..."
content=$(curl -s "$URL" --max-time 10)

if echo "$content" | grep -q "One Piece RPG"; then
    echo -e "${GREEN}✓${NC} Título encontrado"
    passed=$((passed + 1))
else
    echo -e "${RED}✗${NC} Título não encontrado"
    failed=$((failed + 1))
fi
total=$((total + 1))

if echo "$content" | grep -q "<div id=\"root\">"; then
    echo -e "${GREEN}✓${NC} Root div encontrado"
    passed=$((passed + 1))
else
    echo -e "${RED}✗${NC} Root div não encontrado"
    failed=$((failed + 1))
fi
total=$((total + 1))

if echo "$content" | grep -q "<script"; then
    echo -e "${GREEN}✓${NC} Scripts carregados"
    passed=$((passed + 1))
else
    echo -e "${RED}✗${NC} Scripts não encontrados"
    failed=$((failed + 1))
fi
total=$((total + 1))

# Verificar tempo de resposta
echo ""
echo "⏱️  Verificando performance..."
response_time=$(curl -o /dev/null -s -w '%{time_total}\n' "$URL")
response_ms=$(echo "$response_time * 1000" | bc)

echo "Tempo de resposta: ${response_ms%.*} ms"

if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓${NC} Performance boa (<2s)"
    passed=$((passed + 1))
elif (( $(echo "$response_time < 5.0" | bc -l) )); then
    echo -e "${YELLOW}⚠${NC}  Performance média (2-5s)"
    passed=$((passed + 1))
else
    echo -e "${RED}✗${NC} Performance ruim (>5s)"
    failed=$((failed + 1))
fi
total=$((total + 1))

# Verificar headers de segurança
echo ""
echo "🔒 Verificando headers de segurança..."

headers=$(curl -s -I "$URL")

check_header() {
    local header=$1
    local description=$2
    
    total=$((total + 1))
    
    if echo "$headers" | grep -qi "$header"; then
        echo -e "${GREEN}✓${NC} $description"
        passed=$((passed + 1))
    else
        echo -e "${YELLOW}⚠${NC}  $description (não encontrado)"
    fi
}

check_header "x-content-type-options" "X-Content-Type-Options"
check_header "x-frame-options" "X-Frame-Options"
check_header "x-xss-protection" "X-XSS-Protection"

# Resultado final
echo ""
echo "=================================="
echo "📊 Resultados:"
echo ""
echo "Total de testes: $total"
echo -e "${GREEN}Passou: $passed${NC}"
echo -e "${RED}Falhou: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
    echo ""
    echo "🎉 Site está funcionando corretamente!"
    exit 0
elif [ $failed -lt 3 ]; then
    echo -e "${YELLOW}⚠️  Alguns testes falharam${NC}"
    echo ""
    echo "Site está funcionando, mas verifique os erros acima."
    exit 0
else
    echo -e "${RED}❌ Muitos testes falharam${NC}"
    echo ""
    echo "Verifique o deploy e as configurações."
    exit 1
fi
