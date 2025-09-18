# Project Structure

## Architecture Pattern
This project follows **Clean Architecture** principles with a modular NestJS structure:

- **Use Cases** - Business logic layer
- **Repositories** - Data access abstraction with interfaces
- **Controllers** - HTTP request handling
- **DTOs** - Data transfer objects with validation
- **Entities** - Domain models extending BaseEntity

## Folder Organization

```
src/
├── common/                    # Shared utilities
│   ├── entities/             # Base entity classes
│   ├── exceptions/           # Custom exception classes
│   └── filters/              # Exception filters
├── database/                 # Database configuration
│   ├── database.module.ts    # Database module
│   └── prisma.service.ts     # Prisma service
├── modules/                  # Feature modules
│   ├── associate/            # Associate domain
│   ├── meeting/              # Meeting domain
│   └── unity/                # Unity domain
└── main.ts                   # Application entry point
```

## Module Structure
Each domain module follows this consistent pattern:

```
modules/{domain}/
├── controllers/              # HTTP controllers
├── dto/                      # Data transfer objects
├── entities/                 # Domain entities
├── repositories/             # Data access layer
│   ├── {domain}.repository.interface.ts
│   └── {domain}.prisma.repository.ts
├── use-cases/               # Business logic
└── {domain}.module.ts       # Module definition
```

## Key Conventions

### Naming
- **Files**: kebab-case (e.g., `create-associate.use-case.ts`)
- **Classes**: PascalCase (e.g., `CreateAssociateUseCase`)
- **Interfaces**: PascalCase with Interface suffix (e.g., `AssociateRepositoryInterface`)

### Repository Pattern
- All repositories implement interfaces for dependency inversion
- Prisma repositories are injected using string tokens
- Example: `@Inject('AssociateRepositoryInterface')`

### Exception Handling
- Custom exceptions extend `BaseException`
- Global exception filters handle error responses
- Domain-specific exceptions in each module

### DTOs and Validation
- All DTOs use class-validator decorators
- Separate DTOs for different operations (create, update, find)
- DTOs are used for both input validation and response shaping

### Testing
- Unit tests alongside source files (`.spec.ts`)
- Use cases have comprehensive test coverage
- E2E tests in separate `test/` directory

## Database Schema
- **Unity** - Organizations/groups (1:many with Associates and Meetings)
- **Associate** - Members with detailed personal information
- **Meeting** - Events with status tracking
- **MeetingParticipant** - Join table for meeting attendance