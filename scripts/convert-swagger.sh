#!/bin/bash

# Script para converter Swagger YAML para JSON
# Isso facilita a importação no Insomnia e outras ferramentas

echo "🔄 Convertendo Swagger YAML para JSON..."

# Verifica se está no diretório correto
if [ ! -f "docs/swagger.yaml" ]; then
    echo "❌ Arquivo docs/swagger.yaml não encontrado."
    echo "Execute este script a partir do diretório raiz do projeto."
    exit 1
fi

# Verifica se python3 está disponível
if command -v python3 &> /dev/null; then
    python3 -c "
import sys
import os

try:
    import yaml
except ImportError:
    print('📦 Instalando PyYAML...')
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'PyYAML'])
    import yaml

import json

print('🔄 Convertendo YAML para JSON...')
try:
    with open('docs/swagger.yaml', 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    with open('docs/swagger.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print('✅ swagger.json criado com sucesso!')
except Exception as e:
    print(f'❌ Erro: {e}')
    sys.exit(1)
"
elif command -v node &> /dev/null; then
    echo "📦 Usando Node.js para conversão..."
    node -e "
const fs = require('fs');

// Tenta carregar js-yaml
let yaml;
try {
    yaml = require('js-yaml');
} catch (e) {
    console.log('❌ js-yaml não encontrado. Instale com: npm install -g js-yaml');
    process.exit(1);
}

try {
    const doc = yaml.load(fs.readFileSync('docs/swagger.yaml', 'utf8'));
    fs.writeFileSync('docs/swagger.json', JSON.stringify(doc, null, 2));
    console.log('✅ swagger.json criado com sucesso!');
} catch (e) {
    console.log('❌ Erro:', e.message);
    process.exit(1);
}
"
else
    echo "❌ Nem Python3 nem Node.js foram encontrados."
    echo "Por favor, instale um deles para converter YAML para JSON."
    echo ""
    echo "Alternativas:"
    echo "1. Instale Python3: sudo apt install python3 python3-pip"
    echo "2. Instale Node.js: sudo apt install nodejs npm"
    echo "3. Use um conversor online"
    echo "4. Importe o swagger.yaml diretamente no Postman"
    exit 1
fi

echo ""
echo "📋 Arquivos disponíveis para importação:"
echo "  📄 docs/swagger.yaml - Para Swagger Editor/Postman (YAML)"
echo "  📄 docs/swagger.json - Para Swagger Editor/Postman (JSON)"
echo "  📄 docs/insomnia-collection.json - Para Insomnia (coleção nativa)"
echo ""
echo "🔗 Como importar:"
echo "  🚀 Insomnia:"
echo "     Application → Preferences → Data → Import Data → docs/insomnia-collection.json"
echo "  📮 Postman:"
echo "     Import → File → docs/swagger.yaml ou docs/swagger.json"
echo "  📝 Swagger Editor:"
echo "     https://editor.swagger.io/ → File → Import file → docs/swagger.yaml"
echo ""
echo "✨ Dica: O arquivo insomnia-collection.json já está pronto para uso!"
