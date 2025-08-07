# Contributing to Medusa Volume Discounts Extension

Thank you for your interest in contributing! This guide will help you get started with contributing to the Medusa Volume Discounts Extension.

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL
- A Medusa v2 project for testing

### Local Development

1. **Fork and clone the repository**
```bash
git clone https://github.com/alvaropuche-stack/medusa-volume-discounts-extension.git
cd medusa-volume-discounts-extension
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up test environment**
```bash
# Copy the extension to a test Medusa project
cp -r src/backend/* /path/to/test-medusa-project/src/
cp src/frontend/admin/volume-discounts-page.tsx /path/to/test-medusa-project/src/admin/routes/volume-discounts/page.tsx
```

4. **Run tests**
```bash
npm test
```

## Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Style Guidelines

- Use TypeScript for all new code
- Follow the existing code patterns and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Project Structure

```
medusa-volume-discounts-extension/
├── src/
│   ├── backend/
│   │   ├── modules/volume-discount/     # Core module
│   │   └── api/                         # API endpoints
│   └── frontend/
│       ├── admin/                       # Admin UI components
│       └── storefront/                  # Storefront components (optional)
├── docs/                                # Documentation
├── examples/                            # Usage examples
└── tests/                               # Test files
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- volume-discount.test.ts

# Run in watch mode
npm test -- --watch
```

### Test Structure

- **Unit tests**: Test individual functions and classes
- **Integration tests**: Test API endpoints and database interactions
- **E2E tests**: Test complete user workflows

### Writing Tests

```typescript
// Example unit test
describe('VolumeDiscountService', () => {
  let service: VolumeDiscountService

  beforeEach(() => {
    service = new VolumeDiscountService(mockDependencies)
  })

  it('should create a volume discount', async () => {
    const discount = await service.createVolumeDiscount({
      title: 'Test Discount',
      discount_type: 'global',
      min_quantity: 5,
      discount_percentage: 10
    })

    expect(discount.title).toBe('Test Discount')
    expect(discount.min_quantity).toBe(5)
  })
})
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write code following the style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
```bash
npm test
npm run lint
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add new volume discount feature"
```

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add category-based volume discounts
fix: resolve discount calculation bug for fixed amounts
docs: update installation guide
test: add integration tests for admin API
```

### Pull Request Guidelines

- Provide a clear description of the changes
- Link any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Types of Contributions

### Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (Node version, Medusa version, etc.)
- **Screenshots** if applicable

### Feature Requests

For new features:

- **Describe the use case** and problem it solves
- **Provide examples** of how it would work
- **Consider breaking changes** and backward compatibility
- **Discuss implementation approach** if you have ideas

### Code Contributions

Areas where contributions are welcome:

#### Backend Enhancements
- Additional discount types (buy-one-get-one, bundle discounts)
- Performance optimizations
- Better error handling
- Webhook integrations

#### Frontend Improvements
- UI/UX enhancements
- Accessibility improvements
- Mobile responsiveness
- Additional language support

#### Documentation
- API documentation improvements
- More usage examples
- Tutorial content
- Translation to other languages

#### Testing
- Increase test coverage
- Add performance tests
- Integration tests
- E2E testing scenarios

## Code Review Process

All submissions require review:

1. **Automated checks** must pass (tests, linting, type checking)
2. **Maintainer review** for code quality and design
3. **Community feedback** for significant changes
4. **Documentation review** for user-facing changes

### Review Criteria

- **Functionality**: Does the code work as intended?
- **Quality**: Is the code well-structured and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it properly documented?
- **Performance**: Does it maintain good performance?
- **Security**: Are there any security concerns?

## Development Guidelines

### Database Changes

When modifying the database schema:

1. **Create migrations** for all schema changes
2. **Test migrations** both up and down
3. **Document changes** in the changelog
4. **Consider backwards compatibility**

### API Changes

For API modifications:

1. **Maintain backwards compatibility** when possible
2. **Version breaking changes** appropriately
3. **Update documentation** and examples
4. **Add appropriate tests**

### UI Changes

For admin interface updates:

1. **Follow Medusa UI patterns** and components
2. **Ensure accessibility** (WCAG 2.1 AA)
3. **Test across browsers** and devices
4. **Consider internationalization**

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

## Community

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join the Medusa community Discord

### Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Recognition

Contributors will be:

- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes for significant contributions
- Given appropriate credit in documentation

Thank you for contributing to make the Medusa Volume Discounts Extension better for everyone!