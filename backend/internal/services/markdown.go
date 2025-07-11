package services

import (
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"github.com/microcosm-cc/bluemonday"
)

// MarkdownService provides markdown processing functionality
type MarkdownService interface {
	ToHTML(markdownContent string) string
	ToSafeHTML(markdownContent string) string
	ExtractExcerpt(markdownContent string, maxLength int) string
	ValidateMarkdown(content string) error
	ExtractImages(markdownContent string) []string
	ExtractHeadings(markdownContent string) []MarkdownHeading
}

type MarkdownHeading struct {
	Level int    `json:"level"`
	Text  string `json:"text"`
	ID    string `json:"id"`
}

type markdownService struct {
	parser    parser.Parser
	renderer  *html.Renderer
	sanitizer *bluemonday.Policy
}

// NewMarkdownService creates a new markdown service
func NewMarkdownService() MarkdownService {
	// Configure markdown parser with extensions
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)

	// Configure HTML renderer
	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{
		Flags:          htmlFlags,
		RenderNodeHook: nil,
	}
	renderer := html.NewRenderer(opts)

	// Configure HTML sanitizer for safe output
	sanitizer := bluemonday.UGCPolicy()

	// Allow additional elements for blog posts
	sanitizer.AllowElements("h1", "h2", "h3", "h4", "h5", "h6")
	sanitizer.AllowElements("pre", "code")
	sanitizer.AllowElements("blockquote")
	sanitizer.AllowElements("table", "thead", "tbody", "tr", "th", "td")
	sanitizer.AllowElements("dl", "dt", "dd")
	sanitizer.AllowElements("hr")
	sanitizer.AllowElements("figure", "figcaption")

	// Allow classes for syntax highlighting
	sanitizer.AllowAttrs("class").Matching(regexp.MustCompile("^language-[a-zA-Z0-9]+$")).OnElements("code")
	sanitizer.AllowAttrs("class").Matching(regexp.MustCompile("^highlight$")).OnElements("pre")

	// Allow id attributes on headings for anchor links
	sanitizer.AllowAttrs("id").OnElements("h1", "h2", "h3", "h4", "h5", "h6")

	return &markdownService{
		parser:    *p,
		renderer:  renderer,
		sanitizer: sanitizer,
	}
}

// ToHTML converts markdown to HTML
func (s *markdownService) ToHTML(markdownContent string) string {
	if markdownContent == "" {
		return ""
	}

	doc := s.parser.Parse([]byte(markdownContent))
	html := markdown.Render(doc, s.renderer)

	return string(html)
}

// ToSafeHTML converts markdown to sanitized HTML
func (s *markdownService) ToSafeHTML(markdownContent string) string {
	html := s.ToHTML(markdownContent)
	return s.sanitizer.Sanitize(html)
}

// ExtractExcerpt extracts a plain text excerpt from markdown content
func (s *markdownService) ExtractExcerpt(markdownContent string, maxLength int) string {
	if markdownContent == "" {
		return ""
	}

	// Remove markdown syntax
	text := s.stripMarkdown(markdownContent)

	// Trim whitespace
	text = strings.TrimSpace(text)

	// Truncate to maxLength
	if maxLength > 0 && utf8.RuneCountInString(text) > maxLength {
		runes := []rune(text)
		if len(runes) > maxLength {
			// Find last complete word
			truncated := string(runes[:maxLength])
			lastSpace := strings.LastIndex(truncated, " ")
			if lastSpace > 0 {
				truncated = truncated[:lastSpace]
			}
			return truncated + "..."
		}
	}

	return text
}

// ValidateMarkdown validates markdown content
func (s *markdownService) ValidateMarkdown(content string) error {
	// Basic validation - check if content can be parsed
	if content == "" {
		return nil
	}

	// Try to parse the markdown
	doc := s.parser.Parse([]byte(content))
	if doc == nil {
		return &MarkdownError{Message: "Invalid markdown content"}
	}

	return nil
}

// ExtractImages extracts image URLs from markdown content
func (s *markdownService) ExtractImages(markdownContent string) []string {
	// Regex to match markdown images: ![alt](url)
	imageRegex := regexp.MustCompile(`!\[.*?\]\((.*?)\)`)
	matches := imageRegex.FindAllStringSubmatch(markdownContent, -1)

	var images []string
	for _, match := range matches {
		if len(match) > 1 {
			images = append(images, match[1])
		}
	}

	return images
}

// ExtractHeadings extracts headings from markdown content
func (s *markdownService) ExtractHeadings(markdownContent string) []MarkdownHeading {
	lines := strings.Split(markdownContent, "\n")
	var headings []MarkdownHeading

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "#") {
			level := 0
			for _, char := range line {
				if char == '#' {
					level++
				} else {
					break
				}
			}

			if level > 0 && level <= 6 {
				text := strings.TrimSpace(line[level:])
				id := s.generateHeadingID(text)

				headings = append(headings, MarkdownHeading{
					Level: level,
					Text:  text,
					ID:    id,
				})
			}
		}
	}

	return headings
}

// stripMarkdown removes markdown syntax from text
func (s *markdownService) stripMarkdown(content string) string {
	// Remove headers
	content = regexp.MustCompile(`#{1,6}\s+`).ReplaceAllString(content, "")

	// Remove bold and italic
	content = regexp.MustCompile(`\*\*(.*?)\*\*`).ReplaceAllString(content, "$1")
	content = regexp.MustCompile(`\*(.*?)\*`).ReplaceAllString(content, "$1")
	content = regexp.MustCompile(`__(.*?)__`).ReplaceAllString(content, "$1")
	content = regexp.MustCompile(`_(.*?)_`).ReplaceAllString(content, "$1")

	// Remove links
	content = regexp.MustCompile(`\[([^\]]+)\]\([^)]+\)`).ReplaceAllString(content, "$1")

	// Remove images
	content = regexp.MustCompile(`!\[([^\]]*)\]\([^)]+\)`).ReplaceAllString(content, "$1")

	// Remove code blocks
	content = regexp.MustCompile("```[\\s\\S]*?```").ReplaceAllString(content, "")
	content = regexp.MustCompile("`([^`]+)`").ReplaceAllString(content, "$1")

	// Remove blockquotes
	content = regexp.MustCompile(`(?m)^>\s*`).ReplaceAllString(content, "")

	// Remove list markers
	content = regexp.MustCompile(`(?m)^[\s]*[-\*\+]\s+`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`(?m)^[\s]*\d+\.\s+`).ReplaceAllString(content, "")

	// Remove horizontal rules
	content = regexp.MustCompile(`(?m)^[\s]*---+[\s]*$`).ReplaceAllString(content, "")

	// Clean up extra whitespace
	content = regexp.MustCompile(`\n\s*\n`).ReplaceAllString(content, "\n\n")
	content = regexp.MustCompile(`[ \t]+`).ReplaceAllString(content, " ")

	return strings.TrimSpace(content)
}

// generateHeadingID generates a URL-friendly ID from heading text
func (s *markdownService) generateHeadingID(text string) string {
	// Convert to lowercase
	id := strings.ToLower(text)

	// Replace spaces with hyphens
	id = regexp.MustCompile(`\s+`).ReplaceAllString(id, "-")

	// Remove non-alphanumeric characters except hyphens
	id = regexp.MustCompile(`[^a-z0-9\-]`).ReplaceAllString(id, "")

	// Remove multiple consecutive hyphens
	id = regexp.MustCompile(`-+`).ReplaceAllString(id, "-")

	// Trim hyphens from start and end
	id = strings.Trim(id, "-")

	return id
}

// MarkdownError represents an error in markdown processing
type MarkdownError struct {
	Message string
}

func (e *MarkdownError) Error() string {
	return e.Message
}
