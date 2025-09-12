# 🗃️ Prisma Setup - Assembleo Core

Configuração completa do Prisma ORM para o projeto Assembleo Core.

## 📋 O que foi configurado

- ✅ Prisma Client instalado
- ✅ Schema do banco com modelos Unity, Associate, Meeting
- ✅ Repositórios implementados com padrão Repository
- ✅ Módulos configurados com injeção de dependência
- ✅ Scripts npm para gerenciar o banco

## 🗄️ Modelos do Banco

### Unity (Unidades)
```prisma
model Unity {
  id        String   @id @default(cuid())
  name      String   @unique
  address   String
  logoUrl   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  associates Associate[]
  meetings   Meeting[]
}
```

### Associate (Associados)
```prisma
model Associate {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  unityId   String
  createdAt DateTime @default(now())
  updatedAt DateTime
  
  unity        Unity                @relation(fields: [unityId], references: [id])
  participants MeetingParticipant[]
}
```

### Meeting (Reuniões)
```prisma
model Meeting {
  id          String        @id @default(cuid())
  title       String
  description String
  unityId     String
  startDate   DateTime
  location    String?
  status      MeetingStatus @default(SCHEDULED)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  unity        Unity                @relation(fields: [unityId], references: [id])
  participants MeetingParticipant[]
}
```

## 🚀 Comandos Disponíveis

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar e aplicar migração
npm run db:migrate

# Fazer push do schema (dev)
npm run db:push

# Abrir Prisma Studio (GUI do banco)
npm run db:studio

# Reset completo do banco
npm run db:reset
```

## 🔧 Como usar

### 1. Configurar DATABASE_URL

No arquivo `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/assembleo_core?schema=public"
```

### 2. Executar migração

```bash
# Primeira vez
npm run db:migrate

# Ou apenas push para desenvolvimento
npm run db:push
```

### 3. Usar no código

Os repositórios já estão configurados e injetados nos use cases:

```typescript
// Exemplo de uso no Unity Use Case
export class CreateUnityUseCase {
  constructor(
    @Inject('UnityRepositoryInterface')
    private readonly unityRepository: UnityRepositoryInterface,
  ) {}

  async execute(input: CreateUnityDto): Promise<void> {
    const unity = new Unity('', input.name, input.address, null);
    await this.unityRepository.create(unity);
  }
}
```

## 🏗️ Arquitetura

```
src/
├── database/
│   ├── database.module.ts    # Módulo global do Prisma
│   └── prisma.service.ts     # Serviço do Prisma Client
├── modules/
│   ├── unity/
│   │   └── repositories/
│   │       ├── unity.repository.interface.ts
│   │       └── unity.prisma.repository.ts
│   ├── associate/
│   │   └── repositories/
│   │       ├── associate.repository.interface.ts
│   │       └── associate.prisma.repository.ts
│   └── meeting/
│       └── repositories/
│           ├── meeting.repository.interface.ts
│           └── meeting.prisma.repository.ts
```

## 🔍 Prisma Studio

Para visualizar e editar dados:

```bash
npm run db:studio
```

Acesse: http://localhost:5555

## 🐳 Docker com PostgreSQL

Se quiser usar PostgreSQL via Docker:

```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: assembleo
      POSTGRES_PASSWORD: password
      POSTGRES_DB: assembleo_core
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
docker-compose up -d postgres
```

Então use no `.env`:
```env
DATABASE_URL="postgresql://assembleo:password@localhost:5432/assembleo_core?schema=public"
```

## 🎯 Próximos passos

1. **Criar primeira migração:**
   ```bash
   npm run db:migrate
   ```

2. **Testar conexão:**
   ```bash
   npm run start:dev
   ```

3. **Usar Insomnia/Postman para testar endpoints**

4. **Adicionar seeds (opcional):**
   ```bash
   # Criar arquivo prisma/seed.ts
   npm run db:seed
   ```

## 🛠️ Troubleshooting

### Erro de conexão
- Verificar se PostgreSQL está rodando
- Conferir DATABASE_URL no .env
- Testar conexão: `npm run db:studio`

### Schema changes
```bash
# Após alterar o schema.prisma
npm run db:generate
npm run db:push  # ou db:migrate para produção
```

### Reset completo
```bash
npm run db:reset
```

**Prisma configurado e pronto para uso! 🎉**