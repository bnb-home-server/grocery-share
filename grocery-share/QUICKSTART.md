# Quick Start Guide

## Running the Application

### Important: Node.js Version

This project requires Node.js 20+ or 22+. Check your version:

```bash
node --version
```

If you need to update Node.js, visit: https://nodejs.org/

### Development Server

1. Navigate to the project directory:
```bash
cd grocery-share
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:8100`

### Using the App

#### First Time Setup

1. **Add People** (Required)
   - Click the people icon in the top right
   - Add at least 2 people who will share purchases
   - Click save

2. **Create Your First Purchase**
   - Click the + button on the main screen
   - Enter a store name (e.g., "Walmart", "Target")
   - Select which people are participating
   - Click "Create Purchase"

3. **Add Items**
   - Click the + button on the purchase detail screen
   - Enter product name (e.g., "Milk", "Bread")
   - Optionally enter the price
   - Click "Add"

4. **Configure Items**
   - By default, items are "Divided" (split among all people)
   - Click the person chip to assign to a specific person
   - Click the price button to add or update the price

5. **Complete Purchase**
   - Once all items have prices, click the checkmark icon
   - Review the summary showing each person's total
   - Confirm to complete the purchase

#### Key Features

- **Auto-save**: Everything is saved automatically as you type
- **Smart Suggestions**: Recently used stores appear as quick options
- **Flexible Assignment**: Switch items between divided and individual anytime
- **Dark Mode**: Toggle theme using the moon/sun icon
- **Offline First**: All data stored locally in SQLite

#### Understanding Costs

The app calculates each person's total as:
- **Individual Items**: Full price goes to assigned person
- **Divided Items**: Price split equally among all participants
- **Person Total**: Their individual items + their share of divided items

Example:
- Purchase with Alice and Bob
- Milk ($3) - Divided
- Bread ($2) - Divided  
- Alice's snacks ($5) - Individual (Alice)
- **Result**: Alice pays $7.50, Bob pays $2.50

### Troubleshooting

**"No people added"**
- You must add people before creating a purchase
- Go to the People page and add at least one person

**"Items without price"**
- When completing a purchase, all items must have prices
- You can either add prices or remove items without prices

**Database errors**
- The app uses SQLite for storage
- Data is stored in your browser's local storage
- Clearing browser data will delete all purchases

### Tips

1. **Add people first** - This makes creating purchases easier
2. **Use recent establishments** - Tap a suggestion instead of typing
3. **Add prices as you shop** - The app auto-saves, so you can close it anytime
4. **Review before completing** - The summary shows everyone's totals
5. **Keep it simple** - Items default to "Divided" which works for most groceries

## Building for Mobile

### iOS

```bash
npm run build
npx cap add ios
npx cap sync
npx cap open ios
```

Then build and run from Xcode.

### Android

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

Then build and run from Android Studio.

## Support

For issues or questions, check the main README.md for more detailed documentation.
