# ENSA OFFLINE Documentation

This folder contains comprehensive documentation for the ENSA OFFLINE brutalist merch website.

## 📚 Documentation Files

### Core Documentation
- **[API Documentation](api.md)** - Complete REST API reference with endpoints, request/response formats, and examples
- **[Database Schemas](schemas.md)** - MongoDB schema definitions, validation rules, and relationships
- **[Admin Guide](admin-guide.md)** - Comprehensive guide for using the modernized admin dashboard

### Quick Reference
- **API Endpoints**: `/api/products`, `/api/orders`, `/api/settings`
- **Admin Login**: Username `admin`, Password `ensa2024`
- **Order Statuses**: pending → contacted → printed → delivering → delivered → finished
- **Supported Cities**: Tetouan (free), Casablanca, Rabat, Marrakech, Fez, Agadir, etc.

## 🎯 Getting Started

### For Developers
1. Read [API Documentation](api.md) for backend integration
2. Review [Database Schemas](schemas.md) for data structure
3. Check the main [README](../README.md) for setup instructions

### For Administrators
1. Start with [Admin Guide](admin-guide.md) for dashboard usage
2. Reference [API Documentation](api.md) for advanced operations
3. Use [Database Schemas](schemas.md) to understand data relationships

## 🔧 Technical Overview

### Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes with MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based admin authentication
- **Animations**: GSAP for smooth interactions

### Key Features
- **Customer Store**: Product showcase, ordering, confirmation
- **Modern Admin Dashboard**: Professional sidebar, dual view modes, export functionality
- **Real-time Updates**: Live status changes and brutalist notifications
- **Mobile Responsive**: Full functionality on all devices
- **Brutalist Design**: Bold, geometric aesthetic with green/black theme

## 📊 Data Models

### Products
- Basic product information (name, price, images, sizes)
- Customization options (custom text, additional fees)
- Category and status management

### Orders
- Customer information (name, WhatsApp, city)
- Product details (product, size, custom text)
- Pricing breakdown (base, custom, shipping, total)
- Status tracking through order lifecycle

### Settings
- Price management (product prices, custom fees, shipping)
- Site configuration (ordering, maintenance, contact)
- Discount codes and social media links

## 🚀 Deployment

### Environment Variables
```env
MONGODB_URI="mongodb://localhost:27017/ensaoffline"
MONGODB_DB="ensaoffline"
```

### Production Considerations
- Set up MongoDB Atlas for production database
- Configure environment variables securely
- Enable HTTPS for production deployment
- Set up monitoring and logging

## 📈 Performance

### Optimization Features
- Next.js 14 performance optimizations
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient database queries with proper indexing

### Monitoring
- Track order volume and revenue metrics
- Monitor customer satisfaction and delivery times
- Analyze product performance and popular items
- Review shipping patterns and costs

## 🔒 Security

### Authentication
- Admin login with secure session management
- Protected routes requiring authentication
- Input validation and sanitization
- CSRF protection built into Next.js

### Data Protection
- Secure database connections
- Environment variable protection
- Input validation on all forms
- Error handling without sensitive data exposure

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Update documentation as needed
5. Submit a pull request

### Documentation Standards
- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include examples and code snippets
- Maintain consistent formatting

## 📞 Support

### Getting Help
- Check this documentation first
- Review error messages carefully
- Use browser developer tools for debugging
- Check the main project README for setup issues

### Common Issues
- **Login Problems**: Verify credentials (`admin` / `ensa2024`) and clear browser cache
- **Tailwind CSS Errors**: Ensure `tailwind.config.ts` includes custom theme configuration
- **GSAP Animation Issues**: Check element existence before animating with proper null checks
- **MongoDB Connection**: Verify MongoDB URI and ensure service is running
- **Port Conflicts**: Kill existing processes or use different port for development
- **Data Not Saving**: Check validation errors and ensure all required fields are completed
- **Mobile Display**: Try landscape mode or desktop view for admin interface
- **Performance Issues**: Check internet connection and refresh page

---

**ENSA OFFLINE Documentation** - *Complete guide to your brutalist merch empire*