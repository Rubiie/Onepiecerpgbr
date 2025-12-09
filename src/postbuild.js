#!/usr/bin/env node

/**
 * Script pós-build para verificar a integridade do build
 * Executa automaticamente após npm run build
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('\n🔍 Verificando build...\n');

const distPath = './dist';
const errors = [];
const warnings = [];

// Verificar se dist existe
if (!existsSync(distPath)) {
  console.error('❌ Erro: Diretório dist não encontrado!');
  process.exit(1);
}

// Verificar index.html
const indexPath = join(distPath, 'index.html');
if (!existsSync(indexPath)) {
  errors.push('index.html não encontrado em dist/');
} else {
  console.log('✅ index.html encontrado');
  
  // Verificar se index.html tem conteúdo
  const indexContent = readFileSync(indexPath, 'utf-8');
  if (indexContent.length < 100) {
    warnings.push('index.html parece estar vazio ou incompleto');
  }
  
  // Verificar se há referências aos assets
  if (!indexContent.includes('<script') && !indexContent.includes('.js')) {
    warnings.push('Nenhum script JavaScript encontrado em index.html');
  }
}

// Verificar diretório assets
const assetsPath = join(distPath, 'assets');
if (!existsSync(assetsPath)) {
  warnings.push('Diretório assets/ não encontrado');
} else {
  console.log('✅ Diretório assets/ encontrado');
  
  // Listar arquivos
  const files = readdirSync(assetsPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  console.log(`   📄 ${jsFiles.length} arquivo(s) JavaScript`);
  console.log(`   🎨 ${cssFiles.length} arquivo(s) CSS`);
  
  if (jsFiles.length === 0) {
    errors.push('Nenhum arquivo JavaScript encontrado em assets/');
  }
}

// Calcular tamanho total
function getDirectorySize(dirPath) {
  let size = 0;
  const files = readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

const totalSize = getDirectorySize(distPath);
const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`\n📊 Tamanho total do build: ${sizeMB} MB`);

if (totalSize > 5 * 1024 * 1024) {
  warnings.push(`Build grande: ${sizeMB} MB (considere otimizar)`);
}

// Verificar public files
const publicFiles = ['favicon.svg', 'robots.txt'];
for (const file of publicFiles) {
  if (existsSync(join(distPath, file))) {
    console.log(`✅ ${file} copiado`);
  }
}

// Exibir resultados
console.log('\n' + '='.repeat(50));

if (errors.length > 0) {
  console.log('\n❌ Erros encontrados:');
  errors.forEach(err => console.log(`   - ${err}`));
  console.log('\n');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\n⚠️  Avisos:');
  warnings.forEach(warn => console.log(`   - ${warn}`));
}

console.log('\n✅ Build verificado com sucesso!');
console.log('   Pronto para deploy no Vercel! 🚀\n');

process.exit(0);
