# PostgreSQL Migration Guide

## ✅ Completed Steps

1. ✅ Removed Firebase dependencies from package.json
2. ✅ Added Prisma, PostgreSQL client, and bcryptjs
3. ✅ Created Prisma schema with User, UserProfile, and Link models
4. ✅ Generated Prisma client
5. ✅ Created Prisma database helper (`lib/prisma.ts`)
6. ✅ Updated NextAuth options to use PostgreSQL with bcrypt
7. ✅ Updated all server actions and queries to use Prisma
8. ✅ Updated TypeScript types for NextAuth

## 🔧 Steps You Need to Complete

### 1. Install and Start PostgreSQL

**Option A: Using Homebrew (Recommended for macOS)**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb devlink
```

**Option B: Using Docker**
```bash
docker run --name postgres-devlink \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=devlink \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Download from postgresql.org**
Visit https://www.postgresql.org/download/macosx/

### 2. Configure Environment Variables

Create or update your `.env` file:

```env
# Database - Update with your actual credentials
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/devlink?schema=public"

# NextAuth - Generate a secret key
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Keep your existing Cloudinary credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Push Database Schema

Once PostgreSQL is running:
```bash
pnpm prisma db push
```

This will create all the tables in your database.

### 4. (Optional) View Your Database

```bash
pnpm prisma studio
```

This opens a GUI at http://localhost:5555 to view/edit your database.

### 5. Delete Old Firebase Configuration

You can safely delete:
```bash
rm config/firebase.ts
```

Remove Firebase env variables from your `.env` file:
- NEXT_PUBLIC_FIREBASE_APIKEY
- NEXT_PUBLIC_FIREBASE_AUTHDOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

### 6. Test Your Application

```bash
pnpm dev
```

## 📝 Important Changes

### Authentication
- **Before:** Firebase Authentication
- **After:** NextAuth.js with PostgreSQL + bcrypt
- Passwords are now hashed with bcryptjs (10 rounds)

### Database Structure

**Users Table:**
- `id` - Unique identifier (cuid)
- `email` - User email (unique)
- `password` - Hashed password
- `createdAt`, `updatedAt` - Timestamps

**UserProfile Table:**
- `id` - Unique identifier
- `userId` - Foreign key to User
- `firstName`, `lastName` - User names
- `photoURL` - Profile image URL
- `createdAt`, `updatedAt` - Timestamps

**Links Table:**
- `id` - Unique identifier
- `userId` - Foreign key to User
- `platform` - Social platform name
- `url` - Link URL
- `createdAt`, `updatedAt` - Timestamps

### Updated Function Names

All functions now use `userId` instead of `uid`:
- `createAccount(formData)` - Creates user with hashed password
- `createLink(userId, links)` - Creates multiple links
- `fetchLinks(userId)` - Fetches user's links
- `fetchProfileData(userId)` - Fetches user profile
- `updateProfileData(userId, profileData)` - Updates/creates profile

## 🚀 Next Steps After Migration

1. **Data Migration** (if you have existing Firebase data):
   - Export data from Firebase
   - Write a script to import into PostgreSQL
   - Let me know if you need help with this

2. **Update all components** that reference `uid` to use `userId` or `id`

3. **Test all features:**
   - Sign up
   - Login
   - Create links
   - Update profile
   - View links

## 🆘 Troubleshooting

### Can't connect to database
- Make sure PostgreSQL is running: `brew services list`
- Check DATABASE_URL in .env
- Test connection: `psql devlink`

### Prisma errors
- Regenerate client: `pnpm prisma generate`
- Reset database: `pnpm prisma db push --force-reset`

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && pnpm install`

## 📚 Useful Commands

```bash
# Generate Prisma client
pnpm prisma generate

# Push schema changes to DB
pnpm prisma db push

# Open Prisma Studio (DB GUI)
pnpm prisma studio

# Create a migration (for production)
pnpm prisma migrate dev --name init

# View database
psql devlink

# Reset database (careful!)
pnpm prisma db push --force-reset
```

## ✨ Benefits of PostgreSQL over Firebase

1. **No vendor lock-in** - Open source database
2. **Better performance** for relational data
3. **Advanced querying** - Complex joins, aggregations
4. **Cost control** - Self-hosted or cheaper hosting
5. **Data integrity** - Foreign keys, constraints
6. **Better for dev** - Local database, easier testing
7. **No security vulnerabilities** - No more npm audit issues!

Need help with any step? Let me know! 🚀
