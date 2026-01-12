# Grocery Share

A modern Ionic + Angular application for splitting grocery purchases among multiple people.

## Features

- **People Management**: Add and manage people who will share purchases
- **Purchase Tracking**: Create and track purchases with automatic splitting
- **Flexible Item Assignment**: 
  - Divided items: Split cost among all participants
  - Individual items: Assign to specific person
- **Auto-save**: Changes are saved automatically
- **Establishment History**: Quick access to previously used stores
- **Smart Calculations**: Automatic calculation of each person's total
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Offline Support**: Full SQLite database for offline functionality

## Technology Stack

- Ionic 8
- Angular 20
- Capacitor 8
- SQLite (@capacitor-community/sqlite)
- TypeScript

## Database Schema

### Tables

- **people**: Person records (id, name)
- **purchases**: Purchase records (id, establishment, is_completed, created_at)
- **purchase_people**: Many-to-many relationship between purchases and people
- **products**: Product catalog (id, name)
- **purchase_products**: Purchase items with prices and assignment
- **settings**: Application settings (key-value pairs)

## Setup

### Prerequisites

- Node.js 20+ or 22+
- npm 8+

### Installation

```bash
cd grocery-share
npm install
```

### Run Development Server

```bash
npm start
```

The app will be available at `http://localhost:8100`

### Build for Production

```bash
npm run build
```

## Usage

### 1. Add People

First, add the people who will share purchases:
1. Navigate to the People page (person icon in header)
2. Click the + button to add a new person
3. Enter their name and save

### 2. Create a Purchase

1. From the main purchases list, click the + button
2. Enter or select an establishment name
3. Select which people will participate in this purchase
4. Click "Create Purchase"

### 3. Add Items

1. On the purchase detail page, click the + button
2. Enter the product name and optionally the price
3. The item is created as "Divided" by default

### 4. Manage Items

- **Update Price**: Click the price button to set or change the price
- **Change Assignment**: Click the person chip to toggle between:
  - Divided: Cost split among all participants
  - Individual: Assigned to a specific person
- **Delete Item**: Swipe left and tap the delete icon

### 5. Complete Purchase

1. Click the checkmark icon in the header
2. If items are missing prices, you'll be asked to remove them or cancel
3. Once completed, the purchase is marked as done

### 6. View Summary

The purchase detail page shows:
- Total purchase amount
- Each person's total (individual items + share of divided items)

## Project Structure

```
grocery-share/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── new-purchase-modal/
│   │   │   └── person-selector-modal/
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── person.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── purchase.model.ts
│   │   ├── pages/               # Application pages
│   │   │   ├── people/
│   │   │   ├── purchase-detail/
│   │   │   └── purchases/
│   │   ├── services/            # Business logic services
│   │   │   ├── database.service.ts
│   │   │   ├── people.service.ts
│   │   │   ├── products.service.ts
│   │   │   ├── purchases.service.ts
│   │   │   ├── settings.service.ts
│   │   │   └── theme.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── theme/                   # Theme and styling
│   │   └── variables.scss
│   └── global.scss
└── package.json
```

## Key Design Decisions

1. **SQLite for Data Persistence**: Ensures offline functionality and fast data access
2. **Auto-save**: All changes are immediately persisted to prevent data loss
3. **Normalized Database**: Products stored separately to avoid duplication
4. **Smart Defaults**: Last used people and establishments are remembered
5. **Flexible Assignment**: Items can be switched between divided and individual at any time
6. **Modern UI**: Clean, card-based design with smooth transitions
7. **Theme Support**: Both light and dark themes with persistent preference

## Future Enhancements

- Export purchase summaries
- Receipt photo attachment
- Shopping list templates
- Multi-currency support
- Purchase history statistics
- Share purchases via link

## License

MIT
