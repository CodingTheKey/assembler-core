# Deploy para AWS Lambda

Este projeto está configurado para rodar tanto em **EC2** (usando `main.ts`) quanto em **AWS Lambda** (usando `lambda.ts`) através do Serverless Framework.

## Pré-requisitos

1. **Node.js 20+** instalado
2. **AWS CLI** configurado com credenciais válidas
3. **Serverless Framework** instalado globalmente (opcional):
   ```bash
   npm install -g serverless
   ```

## Configuração AWS

### 1. Configurar credenciais AWS

Você precisa configurar suas credenciais AWS. Existem várias formas:

**Opção A: AWS CLI (recomendado)**
```bash
aws configure
```

**Opção B: Variáveis de ambiente**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=sa-east-1
```

**Opção C: Arquivo de credenciais (~/.aws/credentials)**
```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

### 2. Permissões IAM necessárias

Sua conta AWS precisa ter as seguintes permissões:
- Lambda (criar e atualizar funções)
- API Gateway (criar e configurar APIs)
- CloudFormation (criar e gerenciar stacks)
- IAM (criar roles para Lambda)
- S3 (para deploy de artifacts)
- CloudWatch Logs (para logs da Lambda)

## Variáveis de Ambiente

### 1. Configure o arquivo `.env`

Certifique-se de que todas as variáveis estão configuradas no arquivo `.env`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Application
NODE_ENV=production
PORT=3000

# Cloudflare R2 Storage (se usar upload de imagens)
CLOUDFLARE_R2_BASE_URL=https://...
CLOUDFLARE_R2_BUCKET=your-bucket
CLOUDFLARE_R2_ACCESS_KEY_ID=your-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret
CLOUDFLARE_R2_REGION=auto
CLOUDFLARE_R2_PUBLIC_BASE_URL=https://...
```

> **Importante:** As variáveis do `.env` são lidas automaticamente pelo plugin `serverless-dotenv-plugin` durante o deploy.

## Deploy

### Deploy para DEV

```bash
npm run deploy:lambda:dev
```

Isso irá:
1. Buildar o projeto TypeScript
2. Gerar o Prisma Client
3. Fazer deploy para o stage `dev`
4. Retornar a URL do API Gateway

### Deploy para PROD

```bash
npm run deploy:lambda:prod
```

### Deploy personalizado

```bash
npm run build:lambda
serverless deploy --stage staging --region us-east-1
```

## Testando Localmente

### Serverless Offline

Execute a aplicação localmente simulando o ambiente Lambda:

```bash
npm run serverless:offline
```

A API estará disponível em `http://localhost:3000`

### EC2 (modo tradicional)

Para rodar no modo tradicional (EC2/servidor):

```bash
npm run start:dev  # desenvolvimento com hot-reload
npm run start:prod # produção
```

## Estrutura do Projeto

```
assembleo-core/
├── src/
│   ├── main.ts          # Entry point para EC2/servidor tradicional
│   ├── lambda.ts        # Entry point para AWS Lambda
│   ├── app.module.ts    # Módulo principal (compartilhado)
│   └── modules/         # Módulos da aplicação
├── serverless.yml       # Configuração do Serverless Framework
├── .env                 # Variáveis de ambiente (não comitar)
└── .env.example         # Template de variáveis
```

## Configuração do Serverless Framework

O arquivo `serverless.yml` está configurado com:

- **Runtime:** Node.js 20.x
- **Região:** sa-east-1 (São Paulo)
- **Timeout:** 30 segundos
- **Memória:** 1024 MB
- **CORS:** Habilitado para todas as origens
- **Stage padrão:** dev

### Ajustar configurações

Edite o arquivo `serverless.yml` para modificar:

```yaml
provider:
  timeout: 30        # Aumentar para funções mais longas
  memorySize: 1024   # Ajustar memória (128 - 10240 MB)
  region: sa-east-1  # Mudar região
```

## Monitoramento e Logs

### Ver logs em tempo real

```bash
serverless logs -f api --tail --stage dev
```

### Ver logs de um período específico

```bash
serverless logs -f api --stage dev --startTime 1h
```

### CloudWatch Logs

Os logs também estão disponíveis no AWS CloudWatch:
- Navegue até CloudWatch > Log groups
- Procure por `/aws/lambda/assembleo-core-dev-api`

## Informações do Deploy

### Obter informações do stack

```bash
serverless info --stage dev
```

Retorna:
- URL da API
- Nome da função Lambda
- Stage atual
- Região

### Exemplo de output:

```
Service Information
service: assembleo-core
stage: dev
region: sa-east-1
stack: assembleo-core-dev
endpoints:
  ANY - https://abc123.execute-api.sa-east-1.amazonaws.com/{proxy+}
functions:
  api: assembleo-core-dev-api
```

## Remover Deploy

### Remover stack completo

```bash
serverless remove --stage dev
```

> **Atenção:** Isso remove todos os recursos criados pelo Serverless (Lambda, API Gateway, IAM Roles, etc.)

## Troubleshooting

### Erro: "Prisma Client not generated"

```bash
npx prisma generate
npm run build
```

### Erro: "Module not found"

Certifique-se de que todas as dependências estão instaladas:
```bash
npm install
```

### Erro: "AWS credentials not found"

Configure suas credenciais AWS:
```bash
aws configure
```

### Lambda timeout

Se a função estiver atingindo o timeout, aumente no `serverless.yml`:
```yaml
provider:
  timeout: 60  # segundos
```

### Erro de memória

Aumente a memória alocada:
```yaml
provider:
  memorySize: 2048  # MB
```

### Erro de tamanho do pacote

O pacote da Lambda tem limite de 250 MB (comprimido) ou 50 MB (direto).

Para reduzir o tamanho:
1. Verifique exclusões no `package.patterns` do `serverless.yml`
2. Use Layers para dependências pesadas
3. Considere usar Lambda Container Image

## Custos AWS

### Estimativa de custos

- **Lambda:** Free tier inclui 1M de requisições/mês e 400.000 GB-segundo
- **API Gateway:** $3.50 por milhão de requisições
- **CloudWatch Logs:** Primeiros 5GB/mês grátis

### Otimizar custos

1. Ajuste a memória para o mínimo necessário
2. Configure timeout adequado (não muito alto)
3. Use caching no API Gateway se possível
4. Monitore uso no AWS Cost Explorer

## CI/CD

### GitHub Actions (exemplo)

```yaml
name: Deploy to Lambda

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run deploy:lambda:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Suporte

Para mais informações sobre o Serverless Framework:
- Documentação: https://www.serverless.com/framework/docs
- AWS Lambda: https://docs.aws.amazon.com/lambda
- NestJS + Lambda: https://docs.nestjs.com/faq/serverless

## Checklist de Deploy

- [ ] AWS CLI configurado
- [ ] Credenciais AWS válidas
- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] Prisma Client gerado (`prisma generate`)
- [ ] Build executado com sucesso (`npm run build`)
- [ ] Testes passando (opcional)
- [ ] Deploy executado (`npm run deploy:lambda:dev`)
- [ ] URL da API recebida
- [ ] Testes na API funcionando
- [ ] Logs verificados no CloudWatch
