# Changelog

## [1.0.0] - 2026-01-10

### Added

#### Database & Services
- SQLite database integration with @capacitor-community/sqlite
- Database service with complete schema initialization
- People service for managing participants
- Products service for product catalog
- Purchases service for purchase and item management
- Settings service for application preferences
- Theme service for dark/light mode toggle

#### Pages
- Purchases list page with recent purchases
- Purchase detail page with item management and summary
- People management page

#### Components
- New purchase modal with establishment and people selection
- Person selector modal for individual item assignment

#### Features
- Complete CRUD operations for people
- Create and manage purchases
- Add/edit/delete items in purchases
- Flexible item assignment (divided/individual)
- Auto-save functionality
- Smart establishment history
- Remember last used people
- Real-time cost calculations
- Per-person total summaries
- Purchase completion with validation
- Dark/light theme toggle with persistence

#### UI/UX
- Modern card-based design
- Smooth animations and transitions
- Responsive layout
- Empty states with helpful messages
- Confirmation dialogs
- Swipe gestures for delete
- Pull-to-refresh
- Floating action buttons

#### Documentation
- Comprehensive README
- Quick start guide
- Implementation summary
- Code comments where necessary

### Technical Details

- **Framework**: Ionic 8 + Angular 20
- **Platform**: Capacitor 8
- **Database**: SQLite with normalized schema
- **Architecture**: Service-based with TypeScript interfaces
- **Styling**: SCSS with CSS variables for theming
- **Code Style**: English names, minimal comments, no emojis

### Database Schema

```sql
CREATE TABLE people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  establishment TEXT NOT NULL,
  is_completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE purchase_people (
  purchase_id INTEGER NOT NULL,
  person_id INTEGER NOT NULL,
  PRIMARY KEY (purchase_id, person_id),
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE purchase_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  price REAL,
  is_divided INTEGER DEFAULT 1,
  person_id INTEGER,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE SET NULL
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

### File Structure

```
grocery-share/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── new-purchase-modal/
│   │   │   └── person-selector-modal/
│   │   ├── models/
│   │   │   ├── person.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── purchase.model.ts
│   │   ├── pages/
│   │   │   ├── people/
│   │   │   ├── purchase-detail/
│   │   │   └── purchases/
│   │   ├── services/
│   │   │   ├── database.service.ts
│   │   │   ├── people.service.ts
│   │   │   ├── products.service.ts
│   │   │   ├── purchases.service.ts
│   │   │   ├── settings.service.ts
│   │   │   └── theme.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── theme/
│   │   └── variables.scss
│   └── global.scss
├── capacitor.config.json
├── README.md
├── QUICKSTART.md
└── IMPLEMENTATION.md
```

### Breaking Changes
None (initial release)

### Known Issues
- Requires Node.js 20+ or 22+ to build
- Web version requires modern browser with IndexedDB support

### Migration Guide
Not applicable (initial release)

---

## Future Versions (Planned)

### [1.1.0] - Enhancements
- Receipt photo attachment
- Export purchase summaries (PDF/CSV)
- Shopping list templates
- Purchase history search and filter

### [1.2.0] - Advanced Features
- Multi-currency support
- Purchase sharing via link
- Statistics and analytics
- Recurring purchase templates

### [2.0.0] - Cloud Features
- Cloud sync across devices
- User accounts
- Group management
- Real-time collaboration
