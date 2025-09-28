# Admin Dashboard Guide

## Overview

The ENSA OFFLINE admin dashboard provides comprehensive management tools for your brutalist merch store. This guide covers all features and functionality.

## 🔐 Authentication

### Login Process
1. Navigate to `/admin/login`
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `ensa2024`
3. Click "Login" to access the dashboard

### Session Management
- Sessions persist across browser tabs
- Automatic logout after inactivity
- Secure session storage

## 📊 Dashboard Overview

### Key Metrics
- **Total Orders**: Count of all orders
- **Revenue**: Total sales amount
- **Products**: Number of active products
- **Pending Orders**: Orders awaiting action

### Recent Orders
- Latest 3 orders with status
- Quick access to order details
- Status indicators with color coding

## 📦 Orders Management

### Modern Orders Interface
- **Dual View Modes**: Switch between card view and table view
- **Card View**: Modern card layout with customer name-product title format
- **Table View**: Traditional table with inline status updates
- **Smart Truncation**: Long names automatically truncated with "..."
- **Status Dropdown**: Easy-to-reach status updates in card headers
- **Category Icons**: Product category icons (Shirt/Package) for visual identification

### Pagination System
- **Configurable Items Per Page**: 6, 12, 24, or 48 items
- **Smart Navigation**: First, Previous, Next, Last buttons
- **Page Numbers**: Clickable page numbers with current page highlight
- **Items Counter**: Shows "X-Y of Z items" information
- **Auto-reset**: Returns to page 1 when filters change
- **Responsive Design**: Adapts to different screen sizes
- **Brutalist Styling**: Matches website design theme

### Order Status Workflow
1. **Pending** - New order received
2. **Contacted** - Customer contacted via WhatsApp
3. **Printed** - Product manufactured/printed
4. **Delivering** - Order shipped to customer
5. **Delivered** - Order delivered successfully
6. **Finished** - Order completed and closed

### Order Actions
- **View Details**: Complete order information modal
- **Update Status**: Change order status
- **Delete Order**: Remove order from system
- **Bulk Actions**: Update multiple orders at once

### Order Detail Modal
- **Customer Information**: Name, WhatsApp, city, delivery area
- **Product Details**: Product name, size, custom text
- **Pricing Breakdown**: Base price, custom fee, shipping, total
- **Order Timeline**: Creation and update timestamps
- **Status Management**: Direct status updates
- **Click Outside to Close**: Click backdrop to close modal
- **Professional Icons**: Lucide React icons throughout

### Delete Confirmation Modals
- **Order Deletion**: Confirmation modal with order details
- **Product Deletion**: Confirmation modal with product information
- **Brutalist Styling**: Matches website design theme
- **Click Outside to Close**: Click backdrop to cancel deletion
- **Action Buttons**: Clear Cancel and Delete options

### Export Functionality
- **Dual Export Options**: CSV and styled HTML formats
- **CSV Export**: Traditional CSV format for data processing
- **Styled HTML Export**: Beautiful HTML with brutalist design
- **Timestamped Filenames**: Includes date and hour (YYYY-MM-DDTHH-MM-SS)
- **Complete Data**: All order information included
- **Professional Branding**: ENSA OFFLINE header and footer
- **Support Contact**: Updated to abdellahraissouni@gmail.com
- **Filtered Data**: Only exports currently filtered orders

## 🛍️ Products Management

### Product Grid
- **Visual Cards**: Product information in card format
- **Status Indicators**: Active/Inactive status
- **Quick Actions**: Edit, View, Delete buttons
- **Product Stats**: Stock levels and pricing

### Product Information
- **Basic Details**: Name, price, category, stock
- **Sizing**: Available sizes for each product
- **Customization**: Custom text options and fees
- **Status**: Active/Inactive toggle

### Product Actions
- **Add Product**: Create new product (UI ready)
- **Edit Product**: Modify product details
- **View Product**: See complete product information
- **Delete Product**: Remove product from catalog

### Product Statistics
- **Total Products**: Count of all products
- **Active Products**: Currently available products
- **Customizable Products**: Products with custom text option
- **Total Stock**: Sum of all product stock

## ⚙️ Settings Management

### Price Management

#### Product Base Prices
- **Individual Pricing**: Set price for each product
- **Real-time Updates**: Prices update immediately
- **Validation**: Prevents negative prices
- **Product Names**: Clear labels for each product

#### Custom Text Pricing
- **Global Fee**: Set custom text fee for all products
- **Smart Validation**: Prevents negative/high prices
- **Real-time Feedback**: Instant validation messages

#### Shipping Fees by City
- **City Coverage**: All major Moroccan cities
- **Individual Controls**: Each city has its own fee
- **Free Local Delivery**: Tetouan set to $0
- **Validation**: Prevents negative shipping fees

#### Discount Codes
- **Code Management**: Add/remove discount codes
- **Code Types**: Percentage or fixed amount
- **Active Status**: Enable/disable codes
- **Validation**: Uppercase letters and numbers only
- **Sample Codes**: ENSA10 (10% off), OFFLINE5 ($5 off)

### Site Configuration

#### Ordering Settings
- **Enable/Disable Ordering**: Toggle customer ordering
- **Maintenance Mode**: Show maintenance page
- **Visual Indicators**: Clear enabled/disabled status

#### Contact Information
- **WhatsApp Number**: Moroccan format validation
- **Email Address**: Email format validation
- **Physical Address**: Store location information
- **Real-time Validation**: Instant feedback on invalid formats

#### Social Media Links
- **Instagram Handle**: @ensaoffline format
- **Facebook Page**: Page name
- **Twitter Handle**: @ensaoffline format
- **Consistent Styling**: Clean input fields

### Form Features

#### Clean Input Design
- **Brutalist Styling**: Thick borders and shadows
- **Focus States**: Enhanced shadows on focus
- **Disabled States**: Gray background when not editing
- **Consistent Spacing**: Proper padding and margins

#### Save/Cancel Functionality
- **Edit Mode Toggle**: Switch between view and edit modes
- **Change Detection**: Automatically detects changes
- **Save Button**: Disabled when no changes or validation errors
- **Cancel Button**: Discards all changes
- **Reset Button**: Resets to default values

#### Real-time Validation
- **Field Validation**: Instant validation on every keystroke
- **Error Display**: Errors appear below fields
- **Validation Rules**: WhatsApp format, email format, non-negative numbers
- **Error Prevention**: Save button disabled with errors

#### Success/Error Notifications
- **Brutalist Design**: Matches website's brutalist theme
- **Slide-in Animation**: GSAP-powered entrance from right
- **Auto-dismiss**: Closes after 5 seconds automatically
- **Manual Close**: X button to close immediately
- **Type Indicators**: Success ✅, Error ❌, Info ℹ️
- **Immediate Feedback**: Shows instantly for status changes and actions

## 📈 Analytics Dashboard

### Key Metrics
- **Total Revenue**: Sales performance
- **Total Orders**: Order volume
- **Average Order**: Average order value
- **Custom Orders**: Percentage with custom text

### Sales Chart
- **Placeholder**: Chart integration ready
- **Time Series**: Sales over time visualization
- **Interactive**: Hover and click interactions

### Top Products
- **Best Sellers**: Most popular products
- **Revenue Tracking**: Revenue per product
- **Order Count**: Number of orders per product

### Geographic Distribution
- **City Breakdown**: Orders by city
- **Local vs National**: Tetouan vs other cities
- **Shipping Insights**: Delivery patterns

### Customization Insights
- **Custom Order Percentage**: How many orders have custom text
- **Popular Custom Text**: Most requested custom text
- **Average Custom Fee**: Revenue from customizations

## 📱 Mobile Responsiveness

### Desktop Features
- **Full Table View**: All columns visible
- **Sidebar Navigation**: Fixed sidebar with all options
- **Hover Effects**: Interactive hover states
- **Large Action Buttons**: Easy to click

### Mobile Features
- **Horizontal Scroll**: Table scrolls horizontally
- **Touch-Friendly**: Large touch targets
- **Responsive Modals**: Properly sized modals
- **Mobile Menu**: Hamburger menu for navigation

### Tablet Features
- **Adaptive Layout**: 2-column layouts
- **Touch Optimization**: Touch-friendly interactions
- **Responsive Grids**: Adapts to screen size

## 🎨 Design System

### Modern Sidebar Navigation
- **Professional Icons**: Lucide React icons instead of emojis
- **Collapsed State**: Optimized 80px width with centered icons
- **Brand Logo**: "E" logo for collapsed state
- **User Avatar**: Circular avatar with user initial
- **Smooth Transitions**: Enhanced hover effects and shadows
- **Responsive Design**: Adapts to different screen sizes

### Brutalist Elements
- **Thick Borders**: `border-6` throughout
- **Brutalist Shadows**: `shadow-brutal`, `shadow-brutalMd`, `shadow-brutalLg`
- **Bold Typography**: Uppercase, tracked fonts
- **Generous Spacing**: Proper padding and margins

### Color Scheme
- **Primary Green**: #8BC34A for accents and highlights
- **Black**: #000000 for text and backgrounds
- **White**: #FFFFFF for backgrounds
- **Dark Gray**: #333333 for secondary text

### Status Color Coding
- **Pending**: Yellow background
- **Contacted**: Blue background
- **Printed**: Purple background
- **Shipping**: Indigo background
- **Delivered**: Green background
- **Cancelled**: Red background

## 🔧 Technical Features

### Real-time Updates
- **Instant Status Changes**: Updates immediately in UI
- **Live Filtering**: Results update as you type
- **Bulk Operations**: Multiple changes applied instantly
- **Pagination Updates**: Page counts update automatically

### Performance Optimization
- **Efficient Rendering**: Optimized component updates
- **Lazy Loading**: Components load as needed
- **Memory Management**: Proper cleanup of animations
- **Responsive Images**: Optimized image loading

### Security Features
- **Protected Routes**: All admin pages require authentication
- **Session Security**: Secure session management
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error management

## 🚀 Best Practices

### Order Management
1. **Check Orders Daily**: Review pending orders regularly
2. **Update Status Promptly**: Keep customers informed
3. **Use Bulk Actions**: Efficiently manage multiple orders
4. **Export Data**: Regular CSV exports for backup

### Product Management
1. **Keep Prices Updated**: Regular price reviews
2. **Monitor Stock Levels**: Track inventory carefully
3. **Test Custom Options**: Verify custom text functionality
4. **Update Descriptions**: Keep product info current

### Settings Management
1. **Backup Settings**: Export settings regularly
2. **Test Changes**: Verify settings work correctly
3. **Monitor Shipping**: Keep shipping fees current
4. **Update Contact Info**: Maintain accurate contact details

### Analytics Usage
1. **Track Performance**: Monitor key metrics regularly
2. **Identify Trends**: Look for patterns in sales data
3. **Optimize Pricing**: Use data to adjust pricing
4. **Improve Service**: Use insights to enhance customer experience

## 🆘 Troubleshooting

### Common Issues

#### Login Problems
- **Problem**: Cannot log into admin dashboard
- **Solution**: Verify credentials (`admin` / `ensa2024`)
- **Fix**: Clear browser cache and cookies, try incognito mode

#### Slow Loading
- **Problem**: Dashboard loads slowly or times out
- **Solution**: Check internet connection and server status
- **Fix**: Refresh page, check browser console for errors

#### Data Not Saving
- **Problem**: Changes to orders/products/settings not persisting
- **Solution**: Check for validation errors in forms
- **Fix**: Ensure all required fields are filled correctly

#### Mobile Display Issues
- **Problem**: Admin interface not displaying properly on mobile
- **Solution**: Use landscape mode or desktop view
- **Fix**: Zoom out or use responsive design mode

#### Order Status Updates
- **Problem**: Order status not updating properly
- **Solution**: Check network connection and API responses
- **Fix**: Refresh page and try again

### Technical Support

#### Browser Console Errors
- **Check**: Open Developer Tools (F12)
- **Look for**: JavaScript errors in Console tab
- **Action**: Report errors with screenshots

#### Network Issues
- **Check**: Network tab in Developer Tools
- **Look for**: Failed API requests (red status codes)
- **Action**: Check server status and API endpoints

#### Database Connection
- **Check**: MongoDB connection status
- **Look for**: Database timeout errors
- **Action**: Verify MongoDB URI and connection

### Support Resources

- **Documentation**: Refer to API and schema documentation
- **Error Messages**: Read error messages carefully for clues
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API requests and responses
- **Server Logs**: Check application logs for backend issues

---

**ENSA OFFLINE Admin Dashboard** - *Manage your brutalist merch empire with grace under pressure*
