# Sistema de Logs Estruturados

Este projeto implementa um sistema de logs estruturados usando a biblioteca [lazylog](https://github.com/chmenegatti/lazylog).

## Configuração

### Variáveis de Ambiente

```bash
LOG_LEVEL=DEBUG          # TRACE, DEBUG, INFO, WARN, ERROR, FATAL
LOG_FORMAT=json          # json, text, emoji
LOG_OUTPUT=console,file-rotate  # console, file, file-rotate (pode combinar múltiplos)
```

### Configuração no código

```go
// internal/config/config.go
type LoggingConfig struct {
    Level  string `env:"LOG_LEVEL" envDefault:"INFO"`
    Format string `env:"LOG_FORMAT" envDefault:"text"`
    Output string `env:"LOG_OUTPUT" envDefault:"console"`
}
```

## Uso do Sistema de Logs

### Inicialização

```go
// cmd/main.go
if err := logger.Initialize(cfg.Logging.Level, cfg.Logging.Format, cfg.Logging.Output); err != nil {
    log.Fatal("Failed to initialize logger:", err)
}
```

### Middleware Automático

O sistema inclui middleware automático para:

- **RequestLogger**: Logs de todas as requisições HTTP
- **ErrorLogger**: Logs de erros durante processamento
- **Recovery**: Logs de panics com recuperação automática
- **PerformanceLogger**: Logs de requisições lentas (threshold configurável)

```go
// internal/app/app.go
router.Use(middleware.RequestLogger())
router.Use(middleware.ErrorLogger())
router.Use(middleware.Recovery())
router.Use(middleware.PerformanceLogger(time.Second * 5))
```

### Logs Específicos

#### 1. Logs de Autenticação

```go
// Exemplo de uso nos handlers
middleware.LogAuthAttempt(email, "login", true, "")  // Sucesso
middleware.LogAuthAttempt(email, "login", false, "invalid_password")  // Falha
```

#### 2. Logs de Operações de Banco

```go
// Exemplo de uso nos repositories
startTime := time.Now()
// ... operação do banco ...
middleware.LogDatabaseOperation("INSERT", "users", startTime, 1, err)
```

#### 3. Logs de Segurança

```go
middleware.LogSecurityEvent("unauthorized_access", "/admin", userID, "invalid_token", "high")
```

#### 4. Logs de Operações de Negócio

```go
middleware.LogBusinessOperation("post_created", userID, map[string]any{
    "post_id": postID,
    "title": title,
    "category": category,
})
```

### Logger Direto

Para logs customizados, use as funções do logger:

```go
import "github.com/chmenegatti/myBlog/internal/logger"

// Logs básicos
logger.Info("Mensagem", map[string]any{"key": "value"})
logger.Error("Erro ocorreu", map[string]any{"error": err.Error()})

// Logs com contexto
logger.WithService("user-service").Info("Usuario criado", map[string]any{
    "user_id": userID,
    "email": email,
})

// Logs especializados
logger.WithHTTPRequest(method, path, userAgent, clientIP, status, latency).Info("Request processed")
logger.WithAuth(email, action, success).Warn("Authentication failed")
logger.WithDBOperation(operation, table, rows, duration).Debug("Query executed")
logger.WithSecurity(action, resource, reason, severity).Error("Security violation")
logger.WithPerformance(operation, duration, memoryUsage).Warn("Slow operation")
```

## Transports Configurados

### Console
Saída colorizada no terminal com timestamps.

### File
Logs salvos em arquivo simples.

### File-Rotate
Logs com rotação automática usando lumberjack:
- Tamanho máximo: 100MB por arquivo
- Máximo de backups: 3 arquivos
- Compressão automática dos backups

## Formatters Disponíveis

### JSON
Logs estruturados em formato JSON para sistemas de monitoramento.

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "message": "User created",
  "service": "user-service",
  "user_id": "123",
  "email": "user@example.com"
}
```

### Text
Logs em formato texto legível para desenvolvimento.

```
2024-01-15 10:30:00 [INFO] [user-service] User created user_id=123 email=user@example.com
```

### Emoji
Logs com emojis para facilitar visualização durante desenvolvimento.

```
🔵 2024-01-15 10:30:00 [INFO] [user-service] User created user_id=123 email=user@example.com
🔴 2024-01-15 10:30:00 [ERROR] [auth-service] Login failed email=user@example.com reason=invalid_password
```

## Níveis de Log

- **TRACE**: Informações muito detalhadas para debugging
- **DEBUG**: Informações de debug para desenvolvimento
- **INFO**: Informações gerais sobre operações
- **WARN**: Avisos sobre situações anômalas mas não críticas
- **ERROR**: Erros que precisam de atenção
- **FATAL**: Erros críticos que causam parada da aplicação

## Exemplos de Saída

### Requisição HTTP (JSON)
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "message": "HTTP request completed",
  "method": "POST",
  "path": "/api/v1/auth/login",
  "status": 200,
  "latency": "50ms",
  "client_ip": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "request_id": "abc123",
  "user_id": "user456"
}
```

### Autenticação (Emoji)
```
✅ 2024-01-15 10:30:00 [INFO] [auth] Authentication successful email=user@example.com action=login
❌ 2024-01-15 10:30:05 [WARN] [auth] Authentication failed email=wrong@example.com action=login reason=invalid_password
```

### Operação de Banco (Text)
```
2024-01-15 10:30:00 [DEBUG] [database] Database operation completed operation=INSERT table=users rows=1 duration=25ms
```

## Monitoramento e Alertas

O sistema de logs estruturados facilita a integração com ferramentas de monitoramento:

- **ELK Stack**: JSON logs podem ser enviados diretamente para Elasticsearch
- **Prometheus**: Métricas podem ser extraídas dos logs estruturados
- **Grafana**: Dashboards podem ser criados baseados nos dados dos logs
- **Alerting**: Alertas podem ser configurados baseados em padrões específicos

## Boas Práticas

1. **Use os middlewares automáticos** - Eles capturam a maioria dos eventos importantes
2. **Logs de negócio** - Use `LogBusinessOperation` para operações importantes
3. **Contexto consistente** - Sempre inclua `request_id` e `user_id` quando disponível
4. **Campos estruturados** - Use maps para campos adicionais em vez de string formatting
5. **Níveis apropriados** - Use os níveis corretos para facilitar filtragem
6. **Dados sensíveis** - Nunca logue senhas ou tokens diretamente

## Troubleshooting

### Logs não aparecem
1. Verifique se o nível está correto (DEBUG < INFO < WARN < ERROR)
2. Verifique as variáveis de ambiente LOG_*
3. Verifique se o logger foi inicializado antes do uso

### Performance
1. Use níveis apropriados em produção (INFO ou WARN)
2. File-rotate é mais eficiente que file simples
3. JSON é mais eficiente para parsing automático
