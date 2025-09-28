# ENSA OFFLINE

A brutalist graffiti-style merch website built with Next.js 14, TypeScript, Tailwind CSS, GSAP, and MongoDB. Features a complete admin dashboard with orders management, product management, and comprehensive settings panel.

## 🎨 Features

### Customer-Facing Features
- **Brutalist Design** - Bold, geometric design with green (#8BC34A) and black accents
- **Hero Section** - Impressive brutalist hero with character-by-character animations and video section
- **Smart Navigation** - Auto-hiding header that disappears on scroll down and reappears on scroll up
- **Product Showcase** - Grid layout with filtering and GSAP animations
- **Product Detail Pages** - High-quality image galleries with zoom functionality
- **Order Form** - Comprehensive order form with real-time price calculation
- **Custom Text Options** - Add custom text to products with additional fees
- **City-Based Shipping** - Dynamic shipping fees based on Moroccan cities
- **Order Confirmation** - Beautiful confirmation page with order tracking
- **Mobile-First Design** - Fully responsive across all devices

### Admin Dashboard Features
- **Modern Sidebar Navigation** - Professional Lucide React icons with collapsed state
- **Secure Authentication** - Login system with session management
- **Modern Orders Management** - Dual view modes (cards/table) with pagination and filtering
- **Product Management** - Manage product inventory and pricing with professional icons
- **Settings Panel** - Comprehensive configuration for prices, shipping, and site settings
- **Analytics Dashboard** - Sales metrics and performance insights
- **Export Functionality** - CSV and styled HTML export with timestamped filenames
- **Brutalist Notifications** - Custom notification system matching website design
- **Click-Outside-to-Close** - All modals close when clicking outside
- **Real-time Updates** - Live status updates and immediate feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ensaofflin
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
MONGODB_URI="mongodb://localhost:27017/ensaoffline"
MONGODB_DB="ensaoffline"
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ensaofflin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── orders/         # Orders management
│   │   │   ├── products/       # Products management
│   │   │   ├── settings/       # Settings panel
│   │   │   ├── analytics/      # Analytics dashboard
│   │   │   └── login/          # Admin login
│   │   ├── product/[id]/       # Product detail pages
│   │   ├── order/[id]/         # Order pages
│   │   ├── confirmation/        # Order confirmation
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── NavBar.tsx          # Main navigation
│   │   ├── Hero.tsx            # Hero section
│   │   ├── ProductCard.tsx     # Product display
│   │   ├── ProductShowcase.tsx # Product grid
│   │   ├── OrderForm.tsx       # Order form
│   │   ├── AdminDashboard.tsx  # Admin layout
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Authentication context
│   ├── lib/                    # Utilities
│   │   └── mongodb.ts          # Database connection
│   └── models/                 # MongoDB schemas
│       ├── Product.ts          # Product model
│       ├── Order.ts            # Order model
│       └── Settings.ts         # Settings model
├── docs/                       # Documentation
│   ├── api.md                  # API documentation
│   └── schemas.md              # Schema documentation
└── public/                     # Static assets
```

## 🎯 Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS with custom brutalist theme and utilities
- **Animations**: GSAP (GreenSock Animation Platform) with ScrollTrigger
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom session-based auth with React Context
- **State Management**: React Context API + SessionStorage
- **Design System**: Custom brutalist utilities and components
- **Icons**: Lucide React icons for professional appearance

## 🔐 Admin Access

### Login Credentials
- **Username**: `admin`
- **Password**: `ensa2024`

### Admin Features
1. **Dashboard** - Overview with key metrics and recent orders
2. **Orders Management** - Complete order lifecycle management
3. **Products Management** - Inventory and pricing control
4. **Settings** - Site configuration and pricing management
5. **Analytics** - Sales performance and insights

## 📊 Database Schema

### Product Schema
```typescript
{
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  isCustomizable: boolean;
  customPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Schema
```typescript
{
  orderId: string; // Auto-generated unique ID
  customerInfo: {
    fullName: string;
    whatsappNumber: string;
    city: string;
    isTetouan: boolean;
  };
  productDetails: {
    productId: string;
    size: string;
    isCustom: boolean;
    customText?: string;
  };
  pricing: {
    basePrice: number;
    customFee: number;
    shippingFee: number;
    totalPrice: number;
  };
  status: 'pending' | 'contacted' | 'printed' | 'delivering' | 'delivered' | 'finished';
  createdAt: Date;
  updatedAt: Date;
}
```

### Settings Schema
```typescript
{
  shippingFees: Map<string, number>; // City -> Fee mapping
  customTextPrice: number;
  isOrderingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Design System

### Colors
- **Primary**: #8BC34A (Green)
- **Secondary**: #000000 (Black)
- **Background**: #FFFFFF (White)
- **Accent**: #333333 (Dark Gray)

### Typography
- **Headers**: Inter Black, Oswald (Bold, condensed)
- **Display**: Graffiti-style fonts for hero sections
- **Body**: Clean sans-serif fonts

### Brutalist Elements
- **Borders**: Thick borders (`border-6`)
- **Shadows**: Brutalist shadows (`shadow-brutal`, `shadow-brutalMd`, `shadow-brutalLg`)
- **Typography**: Uppercase, tracked fonts
- **Spacing**: Generous padding and margins

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PATCH /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order

### Settings
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings
- `DELETE /api/settings/reset` - Reset settings

## 📱 Mobile Responsiveness

The entire application is built with mobile-first design principles:
- **Responsive Grids** - Adapts to all screen sizes
- **Touch-Friendly** - Large buttons and touch targets
- **Optimized Images** - Proper image sizing and loading
- **Mobile Navigation** - Hamburger menu for mobile
- **Admin Mobile** - Full admin functionality on mobile

## 🎬 GSAP Animations

### Customer-Facing Animations
- **Hero Section** - Staggered text entrance, floating elements
- **Product Cards** - Hover effects, entrance animations
- **Order Form** - Field focus effects, validation animations
- **Confirmation** - Celebratory entrance animations

### Admin Animations
- **Dashboard** - Smooth page transitions
- **Tables** - Row entrance animations
- **Modals** - Scale and bounce effects
- **Notifications** - Slide-in notifications

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 📈 Performance

- **Next.js 14** - Latest performance optimizations
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **GSAP** - Hardware-accelerated animations
- **MongoDB** - Efficient database queries

## 🔒 Security

- **Authentication** - Session-based admin authentication
- **Protected Routes** - Admin routes require authentication
- **Input Validation** - Comprehensive form validation
- **CSRF Protection** - Built-in Next.js protection
- **Environment Variables** - Secure configuration

## 📚 Documentation

- **API Documentation** - Complete API reference in `/docs/api.md`
- **Schema Documentation** - Database schema details in `/docs/schemas.md`
- **Admin Guide** - Comprehensive admin dashboard guide in `/docs/admin-guide.md`
- **Component Documentation** - Inline code documentation

## 🔧 Troubleshooting

### Common Issues

#### Tailwind CSS Classes Not Working
- **Problem**: `font-display` or other custom classes not recognized
- **Solution**: Ensure `tailwind.config.ts` includes the custom theme configuration
- **Fix**: Restart the development server after config changes

#### GSAP Animations Not Working
- **Problem**: Animations not triggering or elements not found
- **Solution**: Check that elements exist before animating with proper null checks
- **Fix**: Use `useRef` and `useEffect` properly for GSAP animations

#### MongoDB Connection Issues
- **Problem**: Database connection errors
- **Solution**: Verify MongoDB URI in `.env.local` file
- **Fix**: Ensure MongoDB is running locally or cloud instance is accessible

#### Port Already in Use
- **Problem**: `EADDRINUSE: address already in use :::3000`
- **Solution**: Kill existing process or use different port
- **Fix**: `taskkill /PID <process_id> /F` (Windows) or `lsof -ti:3000 | xargs kill` (Mac/Linux)

#### Admin Login Not Working
- **Problem**: Cannot access admin dashboard
- **Solution**: Use correct credentials: `admin` / `ensa2024`
- **Fix**: Clear browser cache and try again

### Development Tips

- **Hot Reload**: Changes to components update automatically
- **TypeScript**: Use proper types for better development experience
- **GSAP**: Register plugins before using ScrollTrigger
- **Tailwind**: Use custom utilities defined in `globals.css`
- **MongoDB**: Use Mongoose schemas for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- **Payment Integration** - Stripe/PayPal integration
- **Inventory Management** - Stock tracking and alerts
- **Email Notifications** - Order confirmations and updates
- **Advanced Analytics** - Detailed sales reports
- **Multi-language Support** - Arabic/French localization
- **Mobile App** - React Native companion app

---

**ENSA OFFLINE** - *grace under pressure*