# Email Verification Setup Guide

## Overview
Your PlanIt application now has a complete email verification system with OTP (One-Time Password) verification for new user registrations.

## Features Implemented

### Backend (Node.js + Express + MongoDB)
✅ Email service with Nodemailer configured for Gmail SMTP
✅ OTP generation (6-digit random codes)
✅ OTP expiry (10 minutes)
✅ User model extended with `verificationOTP` and `verificationOTPExpire` fields
✅ Email verification endpoints:
   - `POST /api/users/verify-otp` - Verify OTP code
   - `POST /api/users/resend-otp` - Resend OTP code
✅ Welcome email sent after successful verification
✅ Beautiful HTML email templates with professional styling

### Frontend (Next.js + React)
✅ OTP verification page at `/verify-otp`
✅ 6-digit OTP input with auto-focus and paste support
✅ Countdown timer for resend button (60 seconds)
✅ Redirect to OTP page after registration
✅ Redirect to OTP page on login if not verified
✅ Welcome message after successful verification
✅ Role-based dashboard redirect after verification

### Landing Page Updates
✅ White background in light mode (bg-white)
✅ Footer with white background in light mode
✅ Functional CTA buttons:
   - "Start Planning" → `/register`
   - "Browse Vendors" → `/vendors`
   - "Become a Vendor" → `/register`

## Setup Instructions

### 1. Configure Email Settings

**Option A: Using Gmail (Recommended)**

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

**Option B: Using Other Email Providers**

For other providers, get the SMTP settings from your email provider's documentation.

### 2. Update Backend Environment Variables

Edit `backend/.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies (if not already installed)

```bash
cd backend
npm install nodemailer @types/nodemailer
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## How It Works

### Registration Flow
1. User fills out registration form (`/register`)
2. Backend creates user with `isVerified: false`
3. Backend generates 6-digit OTP
4. OTP saved to user document with 10-minute expiry
5. Email sent with OTP code
6. User redirected to `/verify-otp?email=user@example.com`
7. User enters OTP code
8. Backend verifies OTP and expiry
9. User marked as verified (`isVerified: true`)
10. Welcome email sent
11. User redirected to role-based dashboard

### Login Flow
1. User enters credentials at `/login`
2. Backend checks if user is verified
3. **If verified:** Normal login, redirect to dashboard
4. **If not verified:**
   - New OTP generated and sent
   - User redirected to `/verify-otp?email=user@example.com`

### Resend OTP
- Available after 60-second countdown
- Generates new OTP with fresh 10-minute expiry
- Replaces previous OTP in database

## Email Templates

### OTP Email
- Professional gradient purple design
- Clear instructions
- 10-minute expiry notice
- PlanIt branding

### Welcome Email
- Personalized with user's name
- Role-specific content (Client/Vendor/Admin)
- Next steps guidance
- Support information

## API Endpoints

### Register User
```
POST /api/users/register
Body: { name, email, password, role?, businessName? }
Response: { success: true, message: "Please check your email..." }
```

### Login User
```
POST /api/users/login
Body: { email, password }
Response:
  - If verified: { success: true, data: { user, token } }
  - If not verified: { success: true, data: { requiresVerification: true } }
```

### Verify OTP
```
POST /api/users/verify-otp
Body: { email, otp }
Response: { success: true, data: { user, token } }
```

### Resend OTP
```
POST /api/users/resend-otp
Body: { email }
Response: { success: true, message: "New OTP sent" }
```

## Security Features

✅ OTP expires after 10 minutes
✅ OTP stored hashed in database (can be enhanced)
✅ Rate limiting can be added for resend
✅ Email validation before OTP generation
✅ User must be unverified to resend OTP

## Troubleshooting

### Email not sending
1. Check SMTP credentials in `.env`
2. Ensure 2-Step Verification is enabled (Gmail)
3. Use App Password, not regular password
4. Check firewall/antivirus blocking port 587
5. Check backend console for error messages

### OTP not working
1. Check OTP hasn't expired (10 minutes)
2. Verify email matches registration email
3. Check for typos in OTP code
4. Try resending OTP

### User stuck on OTP page
1. Check email inbox (including spam)
2. Use resend OTP button
3. Check backend logs for email sending errors

## Next Steps (Optional Enhancements)

- [ ] Add SMS OTP as fallback
- [ ] Add rate limiting for resend (max 3 per hour)
- [ ] Store OTP attempts to prevent brute force
- [ ] Add email verification link as alternative to OTP
- [ ] Implement password reset with OTP
- [ ] Add 2FA with OTP for login
- [ ] Customize email templates per role
- [ ] Add email notification preferences

## Support

For issues or questions:
- Check backend console logs
- Verify .env configuration
- Ensure MongoDB is running
- Test email sending separately

---

**Ready to Test:**
1. Start both frontend and backend servers
2. Register a new user
3. Check your email for OTP
4. Enter OTP on verification page
5. Receive welcome email
6. Access your dashboard!
