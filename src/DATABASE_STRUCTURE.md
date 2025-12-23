# 📊 Rizia Database Structure - Quick Reference

## 🗄️ Table Overview

| Table | Purpose | Records |
|-------|---------|---------|
| **users_login** | Authentication & Admin | Login credentials |
| **users** | User Profiles | Signup data |
| **bookings** | Transactions | Event bookings |

---

## 📋 Table 1: users_login

**Stores:** Authentication credentials, admin status, login analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated ID |
| `email` | TEXT | UNIQUE, NOT NULL | User email |
| `password_hash` | TEXT | NOT NULL | SHA-256 hashed password |
| `is_admin` | BOOLEAN | DEFAULT false | Admin privilege flag |
| `last_login_at` | TIMESTAMP | - | Last login timestamp |
| `login_count` | INTEGER | DEFAULT 0 | Total successful logins |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `idx_users_login_email` on `email`

**Sample Data:**
```sql
email: 'admin@rizia.com'
password_hash: 'sha256-hash-here'
is_admin: true
last_login_at: '2024-12-23 10:30:00'
login_count: 5
```

---

## 📋 Table 2: users

**Stores:** User profile information, preferences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated ID |
| `login_id` | UUID | FOREIGN KEY → users_login | Links to auth |
| `name` | TEXT | NOT NULL | Full name |
| `email` | TEXT | UNIQUE, NOT NULL | User email |
| `category` | TEXT | - | Preferred event category |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Signup date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `idx_users_email` on `email`

**Relationships:**
- `login_id` → `users_login.id` (CASCADE DELETE)

**Sample Data:**
```sql
name: 'Rajesh Kumar'
email: 'rajesh@example.com'
category: 'Concert'
login_id: 'uuid-from-users-login'
```

---

## 📋 Table 3: bookings

**Stores:** Complete event booking transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated ID |
| `user_id` | UUID | FOREIGN KEY → users | User who booked |
| `event_id` | TEXT | NOT NULL | Event identifier |
| `event_name` | TEXT | NOT NULL | Event title |
| `event_date` | TEXT | NOT NULL | Event date |
| `event_time` | TEXT | NOT NULL | Event time |
| `city` | TEXT | NOT NULL | Event city |
| `venue` | TEXT | NOT NULL | Event venue |
| `ticket_quantity` | INTEGER | NOT NULL, DEFAULT 1 | Number of tickets |
| `price_per_ticket` | DECIMAL | NOT NULL | Ticket price |
| `total_price` | DECIMAL | NOT NULL | Total amount |
| `booking_status` | TEXT | DEFAULT 'confirmed' | Status |
| `payment_method` | TEXT | - | Payment method |
| `booking_date` | TIMESTAMP | DEFAULT NOW() | Booking timestamp |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `idx_bookings_user_id` on `user_id`
- `idx_bookings_event_id` on `event_id`
- `idx_bookings_status` on `booking_status`
- `idx_bookings_date` on `booking_date`

**Relationships:**
- `user_id` → `users.id` (CASCADE DELETE)

**Sample Data:**
```sql
event_name: 'Sunburn Festival 2024'
event_date: '31 Dec 2024'
city: 'Goa'
venue: 'Vagator Beach'
ticket_quantity: 2
price_per_ticket: 2999.00
total_price: 6298.00 (includes 5% fee)
booking_status: 'confirmed'
payment_method: 'card'
```

**Possible booking_status values:**
- `confirmed` - Payment successful
- `pending` - Awaiting payment
- `cancelled` - User cancelled
- `completed` - Event completed

**Possible payment_method values:**
- `card` - Credit/Debit card
- `upi` - UPI payment
- `netbanking` - Net banking

---

## 🔗 Relationships Diagram

```
┌─────────────────┐
│  users_login    │
│  (Auth Data)    │
└────────┬────────┘
         │
         │ one-to-one
         │
         ↓
┌─────────────────┐
│     users       │
│  (Profile Data) │
└────────┬────────┘
         │
         │ one-to-many
         │
         ↓
┌─────────────────┐
│    bookings     │
│ (Transactions)  │
└─────────────────┘
```

---

## 🔐 Row Level Security Policies

### users_login
✅ SELECT - Anyone (for login)
✅ INSERT - Anyone (for signup)
✅ UPDATE - Own records only

### users
✅ SELECT - Anyone (for profiles)
✅ INSERT - Anyone (for signup)
✅ UPDATE - Own records only

### bookings
✅ SELECT - Own bookings only
✅ INSERT - Own bookings only
✅ UPDATE - Own bookings only
✅ DELETE - Own bookings only

---

## 📊 Query Examples

### Get user with login info:
```sql
SELECT u.*, ul.is_admin, ul.last_login_at
FROM users u
JOIN users_login ul ON u.login_id = ul.id
WHERE u.email = 'user@example.com';
```

### Get user's bookings:
```sql
SELECT * FROM bookings
WHERE user_id = 'user-uuid'
ORDER BY booking_date DESC;
```

### Get all admin users:
```sql
SELECT u.name, u.email
FROM users u
JOIN users_login ul ON u.login_id = ul.id
WHERE ul.is_admin = true;
```

### Total revenue by event:
```sql
SELECT 
  event_name,
  SUM(total_price) as total_revenue,
  SUM(ticket_quantity) as total_tickets,
  COUNT(*) as total_bookings
FROM bookings
WHERE booking_status = 'confirmed'
GROUP BY event_name
ORDER BY total_revenue DESC;
```

### User booking history:
```sql
SELECT 
  b.event_name,
  b.event_date,
  b.venue,
  b.ticket_quantity,
  b.total_price,
  b.booking_status
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE u.email = 'user@example.com'
ORDER BY b.booking_date DESC;
```

---

## 🎯 Key Design Decisions

### Why separate users_login and users tables?
- ✅ **Security:** Keep auth data separate
- ✅ **Scalability:** Can add OAuth providers later
- ✅ **Clean:** Profile updates don't touch auth
- ✅ **Admin:** is_admin flag in secure table

### Why store event details in bookings?
- ✅ **Historical record:** Event details at time of booking
- ✅ **Independence:** Bookings survive event changes
- ✅ **Reporting:** Complete transaction history
- ✅ **Audit trail:** What user actually paid for

### Why use TEXT for event_id?
- ✅ **Flexibility:** Works with any ID format
- ✅ **Migration:** Easy to change event system
- ✅ **Simple:** No foreign key dependency

---

## 📈 Performance Considerations

### Indexed Columns:
✅ Email lookups (login/signup) - **Fast**
✅ User booking queries - **Fast**
✅ Event booking lookups - **Fast**
✅ Status filtering - **Fast**

### Optimizations:
- Indexes on frequently queried columns
- CASCADE DELETE for data integrity
- Timestamp auto-updates via triggers
- Minimal joins needed

---

## 🚀 Scalability

### Current Limits:
- Users: **Unlimited** (UUID-based)
- Bookings: **Millions** (indexed properly)
- Storage: **Supabase tier-based**

### Growth Path:
1. Add read replicas for reports
2. Partition bookings by date
3. Archive old completed bookings
4. Add caching layer (Redis)

---

**Database Design by Rizia Team 🎯**
