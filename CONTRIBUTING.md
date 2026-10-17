# Contributing to SmartHire

Thank you for your interest in contributing to **SmartHire**! As an enterprise-grade recruitment platform, we uphold high standards for code quality, architectural consistency, test coverage, and documentation.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all communications.

---

## Development Workflow

### 1. Branching Strategy
- `main`: Production-ready release branch. All code must pass CI tests before merging.
- Feature branches: `feature/<short-description>` (e.g., `feature/ai-candidate-matching`)
- Bugfix branches: `fix/<short-description>` (e.g., `fix/jwt-expiration-handling`)
- Chore/Refactor branches: `chore/<short-description>` or `refactor/<short-description>`

### 2. Commit Message Convention
We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation changes only
- `style:` Code style changes (formatting, semicolons, etc.; no production code change)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvements
- `test:` Adding or updating automated tests
- `chore:` Build scripts, dependency bumps, tooling updates

*Example:* `feat(auth): add rate limiting for candidate login attempts`

---

## Local Development & Testing

### Backend (Spring Boot 3 + Java 21)
1. Ensure JDK 21+ and Maven 3.9+ are installed.
2. Compile and run test suite:
   ```bash
   cd backend
   mvn clean test
   ```
3. Run the development server:
   ```bash
   mvn spring-boot:run
   ```

### Frontend (React 18 + Vite + TypeScript)
1. Ensure Node.js 20+ and npm are installed.
2. Install dependencies:
   ```bash
   cd frontend
   npm ci
   ```
3. Run TypeScript typecheck and production build:
   ```bash
   npm run build
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```

---

## Pull Request Guidelines

1. **Self-Review**: Review your own diff before opening a PR. Ensure no debug logs, unintended formatting churn, or temporary files are included.
2. **Automated Verification**: Confirm both `mvn clean test` and `npm run build` pass without warnings or errors.
3. **PR Description**: Fill in the Pull Request template completely, linking any relevant issues.
4. **Clean Commits**: Rebase on `main` to resolve conflicts before requesting a review.
