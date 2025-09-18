# Tech Stack

## Framework & Runtime
- **NestJS 11.x** - Progressive Node.js framework with TypeScript
- **Node.js 20** - Runtime environment
- **TypeScript 5.7** - Primary language

## Database & ORM
- **PostgreSQL** - Primary database
- **Prisma 6.15** - Database ORM and migration tool
- Database schema includes Unity, Associate, Meeting, and MeetingParticipant models

## Key Dependencies
- **class-validator** & **class-transformer** - DTO validation and transformation
- **rxjs** - Reactive programming support
- **reflect-metadata** - Decorator metadata support

## Development Tools
- **ESLint** with TypeScript support - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework with coverage support
- **Docker** & **Docker Compose** - Containerization

## Common Commands

### Development
```bash
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debugging
npm run build              # Build for production
npm run start:prod         # Run production build
```

### Testing
```bash
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run with coverage report
npm run test:e2e           # Run end-to-end tests
```

### Code Quality
```bash
npm run lint               # Run ESLint with auto-fix
npm run format             # Format code with Prettier
```

### Database
```bash
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema changes
npx prisma migrate dev     # Create and apply migration
npx prisma studio          # Open Prisma Studio
```

### Docker
```bash
docker-compose up -d       # Start services in background
docker-compose logs -f     # Follow logs
docker-compose down        # Stop services
```