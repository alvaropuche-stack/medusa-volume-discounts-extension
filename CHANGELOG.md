# Changelog

All notable changes to the Medusa Volume Discounts Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-07

### Added
- **Core volume discount functionality**
  - Product-specific volume discounts
  - Category-based volume discounts  
  - Global store-wide discounts with exclusions
  - Support for both percentage and fixed amount discounts

- **Advanced configuration options**
  - Quantity range settings (min/max quantities)
  - Priority system for resolving discount conflicts
  - Time-based restrictions (valid from/until dates)
  - Usage limits (total and per-customer)
  - Product exclusions for global and category discounts

- **Professional admin interface**
  - Clean, intuitive UI built with Medusa UI components
  - Two-column modal layout for efficient discount creation
  - Advanced product selector with search and thumbnails
  - Real-time discount preview
  - Comprehensive discount management table

- **Complete API integration**
  - Full CRUD operations for volume discounts
  - Admin API endpoints with authentication
  - Public store API for fetching applicable discounts
  - Proper error handling and validation

- **Database schema**
  - `volume_discount` table with comprehensive fields
  - `volume_discount_product` junction table for many-to-many relationships
  - Proper indexing for performance
  - Database migrations for easy setup

- **Developer-friendly features**
  - TypeScript support throughout
  - Comprehensive API documentation
  - Usage examples and integration guides
  - React hooks for storefront integration

- **Business features**
  - Usage tracking and analytics
  - Discount conflict resolution via priority system
  - Flexible discount types for various business models
  - B2B and wholesale pricing support

### Technical Details
- Built for Medusa v2.x
- PostgreSQL database backend with MikroORM
- React 18+ admin interface
- Full TypeScript implementation
- Comprehensive test coverage
- RESTful API design

### Documentation
- Complete installation guide
- API reference documentation
- Usage examples and best practices
- Contributing guidelines
- Troubleshooting guide

## [Unreleased]

### Planned Features
- **Enhanced discount types**
  - Buy-one-get-one (BOGO) discounts
  - Bundle pricing with mixed products
  - Tiered shipping discounts

- **Advanced business features**
  - Customer segment targeting
  - Geographic restrictions
  - Integration with loyalty programs
  - Advanced analytics dashboard

- **Storefront enhancements**
  - Pre-built React components
  - Discount calculator widget
  - Customer savings history
  - Mobile-optimized discount display

- **Integration improvements**
  - Webhook support for discount events
  - Export/import functionality
  - Integration with marketing tools
  - Multi-language support

### Technical Improvements
- Performance optimizations
- Enhanced caching strategies
- GraphQL API endpoints
- Improved error handling

---

## Version History

### How to Read This Changelog

- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Versioning Strategy

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Migration Notes

#### From Pre-release to v1.0.0

This is the initial stable release. Follow the installation guide for new installations.

### Breaking Changes

None in this version as it's the initial release.

### Deprecation Notices

None in this version.

### Security Updates

- Implemented proper input validation for all API endpoints
- Added SQL injection protection through ORM usage
- Secure handling of discount calculations
- Protected admin endpoints with authentication

### Performance Notes

- Efficient database queries with proper indexing
- Optimized discount calculation algorithms
- Minimal impact on existing Medusa performance
- Lightweight frontend components

### Known Issues

None at release time.

### Upgrade Instructions

This is the initial release - follow the installation guide in README.md.

---

**Note**: This changelog is maintained by [Zhenvo](https://zhenvo.com). For a complete list of changes, see the [commit history](https://github.com/alvaropuche-stack/medusa-volume-discounts-extension/commits/main).