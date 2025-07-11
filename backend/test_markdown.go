package main

import (
	"encoding/json"
	"fmt"
	"math"
	"strings"

	"github.com/chmenegatti/myBlog/internal/services"
)

func main() {
	fmt.Println("🚀 === DEMONSTRAÇÃO DO SISTEMA DE MARKDOWN ===")

	// Initialize markdown service
	markdownService := services.NewMarkdownService()

	// Example markdown content
	markdownContent := `# Como Implementar Logs Estruturados em Go

Este é um post sobre **logs estruturados** em Go usando a biblioteca *lazylog*.

## Introdução

Logs estruturados são essenciais para aplicações modernas. Eles permitem:

1. **Melhor observabilidade**
2. *Facilidade de parsing*
3. Integração com ferramentas de monitoramento

### Código de Exemplo

Aqui está um exemplo básico:

` + "```go" + `
logger.Info("Usuario criado", map[string]any{
    "user_id": userID,
    "email": email,
})
` + "```" + `

### Configuração

Para configurar os logs, use as seguintes variáveis:

- LOG_LEVEL=INFO
- LOG_FORMAT=json  
- LOG_OUTPUT=console,file-rotate

> **Importante**: Sempre use níveis apropriados em produção!

## Imagens

![Arquitetura de Logs](https://example.com/logs-architecture.png)

![Dashboard](https://example.com/dashboard.png)

## Conclusão

Com este sistema você terá logs profissionais e estruturados.

---

*Este post foi escrito em markdown e processado automaticamente pelo backend.*`

	fmt.Println("\n📝 === CONTEÚDO MARKDOWN ORIGINAL ===")
	fmt.Println(markdownContent)

	fmt.Println("\n🔄 === PROCESSANDO MARKDOWN ===")

	// Convert to HTML
	html := markdownService.ToSafeHTML(markdownContent)
	fmt.Println("\n📄 HTML Gerado:")
	fmt.Println(html)

	// Extract excerpt
	excerpt := markdownService.ExtractExcerpt(markdownContent, 200)
	fmt.Println("\n📋 Excerpt (200 chars):")
	fmt.Println(excerpt)

	// Extract images
	images := markdownService.ExtractImages(markdownContent)
	fmt.Println("\n🖼️  Imagens encontradas:")
	for i, img := range images {
		fmt.Printf("  %d. %s\n", i+1, img)
	}

	// Extract headings
	headings := markdownService.ExtractHeadings(markdownContent)
	fmt.Println("\n📑 Estrutura de Headings:")
	headingsJSON, _ := json.MarshalIndent(headings, "", "  ")
	fmt.Println(string(headingsJSON))

	// Validate markdown
	if err := markdownService.ValidateMarkdown(markdownContent); err != nil {
		fmt.Printf("\n❌ Erro de validação: %v\n", err)
	} else {
		fmt.Println("\n✅ Markdown válido!")
	}

	fmt.Println("\n📊 === ESTATÍSTICAS ===")
	plainText := markdownService.ExtractExcerpt(markdownContent, 0) // No limit
	wordCount := len(strings.Fields(plainText))
	readingTime := calculateReadingTime(wordCount)

	fmt.Printf("Palavras: %d\n", wordCount)
	fmt.Printf("Tempo de leitura: %d minutos\n", readingTime)

	fmt.Println("\n✅ === SISTEMA DE MARKDOWN FUNCIONANDO PERFEITAMENTE! ===")
	fmt.Println("🎯 Funcionalidades implementadas:")
	fmt.Println("   • Conversão Markdown → HTML")
	fmt.Println("   • Sanitização de HTML")
	fmt.Println("   • Extração automática de excerpt")
	fmt.Println("   • Detecção de imagens")
	fmt.Println("   • Estrutura de headings")
	fmt.Println("   • Validação de conteúdo")
	fmt.Println("   • Cálculo de tempo de leitura")
	fmt.Println("   • API de preview completa")
}

func calculateReadingTime(wordCount int) int {
	const avgWordsPerMinute = 200
	if wordCount == 0 {
		return 0
	}
	minutes := float64(wordCount) / avgWordsPerMinute
	if minutes < 1 {
		return 1
	}
	return int(math.Ceil(minutes))
}
