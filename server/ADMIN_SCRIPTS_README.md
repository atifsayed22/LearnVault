# Admin Scripts - README

## 📋 Overview

Three utility scripts for creating and managing admin users in LearnVault.

---

## 🚀 Quick Start

```bash
cd server
node create-admin.js
```

That's it! You'll get an admin account.

---

## 📚 Available Scripts

### 1. create-admin.js
**Quick admin creation with default credentials**

```bash
node create-admin.js
```

- Email: `admin@learnavault.com`
- Password: `admin@123`
- Name: `Super Admin`
- Duration: ~2-3 seconds
- No prompts, instant setup

✅ **Use this for:** Testing, quick setup, development

---

### 2. create-admin-interactive.js
**Create admin with custom credentials**

```bash
node create-admin-interactive.js
```

- Prompts for: Name, Email, Password
- Input validation
- Password confirmation
- Duration: ~2 minutes (with input)
- Beautiful formatted output

✅ **Use this for:** Production setup, custom credentials, secure setup

---

### 3. admin-management.js
**Full admin management system**

```bash
node admin-management.js
```

**Menu options:**
1. List all admins
2. Create new admin
3. Update admin password
4. Delete admin
5. Exit

✅ **Use this for:** Managing multiple admins, password resets, admin maintenance

---

## 🛠️ Setup Requirements

### Prerequisites
- Node.js installed
- MongoDB running
- `.env` file with `MONGO_URI`
- Dependencies installed: `npm install`

### Check Prerequisites
```bash
# Check Node.js
node --version

# Check MongoDB (in another terminal)
mongod

# Check dependencies
npm install
```

---

## 📖 Usage Examples

### Example 1: Quick Admin Creation
```bash
$ node create-admin.js

✓ Connected to MongoDB
✅ Admin user created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Admin Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:    admin@learnavault.com
🔐 Password: admin@123
👤 Name:     Super Admin
👑 Role:     admin
🆔 ID:       507f1f77bcf86cd799439011
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ You can now login to the admin panel!
🌐 Go to: http://localhost:5173/auth/login
```

### Example 2: Interactive Admin Creation
```bash
$ node create-admin-interactive.js

╔════════════════════════════════════════╗
║  LearnVault - Create Admin User Script  ║
╚════════════════════════════════════════╝

🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📝 Enter admin details:

👤 Admin Name: John Doe
📧 Email: john@example.com
🔐 Password: MyPassword123
🔐 Confirm Password: MyPassword123

✅ Admin user created successfully!

╔════════════════════════════════════════════════╗
║          🎉 Admin Created Successfully! 🎉     ║
╠════════════════════════════════════════════════╣
║ 👤 Name:    John Doe                          ║
║ 📧 Email:   john@example.com                  ║
║ 👑 Role:    Admin                             ║
║ 🆔 ID:      507f1f77bcf86cd799439011         ║
╠════════════════════════════════════════════════╣
║ 🌐 Login URL:                                  ║
║    http://localhost:5173/auth/login            ║
╚════════════════════════════════════════════════╝
```

### Example 3: Admin Management
```bash
$ node admin-management.js

╔════════════════════════════════════════╗
║  LearnVault - Admin Management System   ║
╚════════════════════════════════════════╝

🔄 Connecting to MongoDB...
✅ Connected to MongoDB

╔════════════════════════════════════════╗
║        Admin Management Menu            ║
╠════════════════════════════════════════╣
║ 1. List all admins                     ║
║ 2. Create new admin                    ║
║ 3. Update admin password               ║
║ 4. Delete admin                        ║
║ 5. Exit                                ║
╚════════════════════════════════════════╝

Enter your choice (1-5): 1

╔════════════════════════════════════════════════════════════════╗
║                    📋 Registered Admins                         ║
╠════════════════════════════════════════════════════════════════╣

│ 1. Name: John Doe
│    Email: john@example.com
│    ID: 507f1f77bcf86cd799439011
│    Created: 1/28/2026
│    Status: ✅ Verified

│ 2. Name: Super Admin
│    Email: admin@learnavault.com
│    ID: 507f1f77bcf86cd799439012
│    Created: 1/28/2026
│    Status: ✅ Verified

╚════════════════════════════════════════════════════════════════╝
```

---

## 🔐 Security Notes

### Default Password (Quick Script)
- Email: `admin@learnavault.com`
- Password: `admin@123`
- ⚠️ **NOT secure** - Change immediately!
- Only for testing/development

### Custom Password (Interactive Script)
- ✅ **Secure** - You set it
- ✅ Strong password recommended
- ✅ Use 10+ characters
- ✅ Mix uppercase, lowercase, numbers, symbols

### Password Best Practices
1. Change default password after creation
2. Use complex passwords (10+ chars)
3. Include: UPPERCASE, lowercase, numbers, symbols
4. Example: `MyAdmin@Pass2024`
5. Store in password manager

---

## ✅ Verification

### Check if Admin Created
```bash
# Option 1: Try logging in
# Go to: http://localhost:5173/auth/login
# Use admin credentials

# Option 2: List admins
node admin-management.js
# Select option 1

# Option 3: Check database
mongosh
use learnavault
db.users.find({ role: "admin" })
```

---

## 🚨 Troubleshooting

### Issue: "Cannot find module"
```bash
# Solution: Install dependencies
npm install
```

### Issue: "MONGO_URI not found"
```bash
# Check .env file exists in server directory
cat .env
# Should show: MONGO_URI=...

# If missing, add it:
echo "MONGO_URI=mongodb://localhost:27017/learnavault" >> .env
```

### Issue: "MongoDB connection failed"
```bash
# Make sure MongoDB is running
# In another terminal:
mongod

# Or check connection string in .env
```

### Issue: "Admin with this email already exists"
```bash
# Use different email with interactive script
node create-admin-interactive.js

# Or delete existing admin:
# Run admin-management.js -> Option 4: Delete
```

### Issue: "Password must be 6+ characters"
```bash
# Use longer password when prompted
# Minimum: 6 characters
# Recommended: 10+ characters
```

---

## 📊 Comparison Table

| Feature | Quick | Interactive | Management |
|---------|-------|-------------|------------|
| Create Admin | ✅ | ✅ | ✅ |
| List Admins | ❌ | ❌ | ✅ |
| Update Password | ❌ | ❌ | ✅ |
| Delete Admin | ❌ | ❌ | ✅ |
| Custom Details | ❌ | ✅ | ✅ |
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ |
| Interaction | None | Medium | High |
| Best For | Testing | Production | Management |

---

## 🎯 Decision Guide

### Choose `create-admin.js` if:
- ✅ Quick testing needed
- ✅ Default credentials OK
- ✅ Want fastest setup
- ✅ Development environment

### Choose `create-admin-interactive.js` if:
- ✅ Production setup
- ✅ Custom credentials needed
- ✅ Want nice formatting
- ✅ Setting single admin

### Choose `admin-management.js` if:
- ✅ Managing multiple admins
- ✅ Need to update passwords
- ✅ List existing admins
- ✅ Production maintenance

---

## 📝 Typical Workflow

### First Time Setup
```bash
# 1. Create admin
node create-admin.js

# 2. Copy credentials
# Email: admin@learnavault.com
# Password: admin@123

# 3. Login to test
# URL: http://localhost:5173/auth/login

# 4. Change password
# Go to profile settings and change password
```

### Adding More Admins
```bash
# 1. Use interactive script
node create-admin-interactive.js

# 2. Enter custom details
# Name: New Admin Name
# Email: newemail@example.com
# Password: SecurePassword123

# 3. Share credentials securely

# 4. New admin should change password on first login
```

### Managing Admins
```bash
# 1. List all admins
node admin-management.js
# Choose option 1

# 2. Create new admin
node admin-management.js
# Choose option 2

# 3. Update password
node admin-management.js
# Choose option 3

# 4. Delete admin
node admin-management.js
# Choose option 4
```

---

## 📚 Documentation

For detailed information, see:
- `ADMIN_CREATION_SCRIPTS_GUIDE.md` - Complete script guide
- `ADMIN_SCRIPTS_QUICK_REFERENCE.md` - Quick reference
- `ADMIN_SETUP_INSTRUCTIONS.md` - Full setup guide

---

## 🆘 Need Help?

1. **Check docs:** `ADMIN_CREATION_SCRIPTS_GUIDE.md`
2. **Troubleshooting:** Troubleshooting section above
3. **Check console:** Look for error messages
4. **Try again:** Ensure all prerequisites met

---

## ✨ Files Included

```
server/
├── create-admin.js
├── create-admin-interactive.js
└── admin-management.js
```

---

## 🚀 You're Ready!

Everything you need to create and manage admin accounts is here.

**Next Step:** Run `node create-admin.js` and start using the admin panel!

---

**Last Updated:** January 28, 2026
**Version:** 1.0
**Maintained By:** LearnVault Team
