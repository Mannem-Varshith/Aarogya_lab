# Admin Setup Guide

## Database Setup

1. Run the initial schema:
```bash
mysql -u your_username -p < src/config/schema.sql
```

2. Run the updates to add admin support:
```bash
mysql -u your_username -p < src/config/schema_updates.sql
```

3. Create the admin user:
```bash
node src/scripts/createAdmin.js
```

This will create an admin user with:
- **Username**: Admin
- **Password**: Admin@123

## Admin Login

Access the admin panel at: `http://localhost:5173/admin/login`

## Admin Features

1. **Dashboard**: View statistics about users, pending approvals, etc.
2. **Approvals**: Approve or reject doctor and lab registrations
3. **Users**: Manage all users (coming soon)
4. **Reports**: View and manage reports (coming soon)
5. **Settings**: Admin settings (coming soon)

## Approval Workflow

1. When a doctor or lab registers, their account is set to `pending` status
2. They cannot login until approved
3. Admin can view pending approvals in the Approvals page
4. Admin can approve or reject each request
5. Once approved, the user can login normally

## API Endpoints

### Admin Login
- `POST /api/auth/admin/login`
  - Body: `{ username: "Admin", password: "Admin@123" }`

### Get Pending Approvals
- `GET /api/admin/approvals/pending`
  - Requires: Admin token

### Approve User
- `PUT /api/admin/approvals/:userId/approve`
  - Requires: Admin token

### Reject User
- `PUT /api/admin/approvals/:userId/reject`
  - Requires: Admin token

### Dashboard Stats
- `GET /api/admin/dashboard/stats`
  - Requires: Admin token

