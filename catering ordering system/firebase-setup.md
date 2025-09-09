# Firebase Setup Guide
## Student-Teacher Booking Appointment System

---

## 🔥 Firebase Configuration Steps

### 1. Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add project"**
3. **Project name**: `student-teacher-booking`
4. **Enable Google Analytics**: Optional
5. **Click "Create project"**

### 2. Register Web App

1. **Click the web icon** (`</>`) on project overview
2. **App nickname**: `student-teacher-booking-web`
3. **Check "Also set up Firebase Hosting"**
4. **Click "Register app"**
5. **Copy the Firebase config object** (save for later)

### 3. Enable Authentication

1. **Navigate to "Authentication"**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"**
5. **Save**

### 4. Setup Firestore Database

1. **Navigate to "Firestore Database"**
2. **Click "Create database"**
3. **Select "Start in test mode"**
4. **Choose your region**
5. **Click "Done"**

### 5. Configure Firestore Security Rules

```javascript
// Replace default rules with:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - students and teachers can read/write their own
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         resource.data.teacherId == request.auth.uid);
    }
    
    // Messages - sender and receiver can read/write
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
    }
    
    // Availability - teachers can manage their own
    match /availability/{teacherId} {
      allow read, write: if request.auth != null && request.auth.uid == teacherId;
    }
    
    // Allow admins full access (you'll need to implement admin role checking)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6. Enable Firebase Hosting

1. **Navigate to "Hosting"**
2. **Click "Get started"**
3. **Follow the setup instructions**
4. **Note the hosting URL for later**

---

## 🔧 Update Your Code

### Replace Firebase Config in app.js

```javascript
// Replace this section in app.js:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Initialize Firebase Services

```javascript
// Add this to your app.js after the config:
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 📦 Firebase CLI Setup

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Initialize Project

```bash
# In your project directory
firebase init

# Select:
# - Firestore: Configure and deploy rules
# - Hosting: Configure files for Firebase Hosting
```

### Deploy to Firebase

```bash
firebase deploy
```

---

## 📊 Firestore Database Structure

### Collections to Create

```javascript
// Collection: users
{
  uid: "auto-generated",
  email: "user@example.com",
  role: "admin|teacher|student",
  name: "User Name",
  approved: true|false,
  department: "Computer Science",
  subject: "JavaScript, Python",
  phone: "+1-555-0101",
  createdAt: timestamp
}

// Collection: appointments
{
  id: "auto-generated",
  studentId: "user_uid",
  teacherId: "user_uid", 
  date: "2025-08-16",
  time: "10:00",
  status: "pending|approved|cancelled|completed",
  purpose: "Project Discussion",
  message: "Need help with final project",
  createdAt: timestamp,
  updatedAt: timestamp
}

// Collection: messages
{
  id: "auto-generated",
  senderId: "user_uid",
  receiverId: "user_uid",
  content: "Message content",
  timestamp: timestamp,
  read: false,
  appointmentId: "appointment_id"
}

// Collection: availability
{
  teacherId: "user_uid",
  monday: ["09:00-12:00", "14:00-17:00"],
  tuesday: ["10:00-13:00", "15:00-18:00"],
  wednesday: ["09:00-12:00"],
  thursday: ["10:00-13:00", "15:00-18:00"],
  friday: ["09:00-12:00", "14:00-16:00"],
  updatedAt: timestamp
}
```

---

## 🔒 Security Configuration

### Authentication Rules

1. **Email verification**: Optional but recommended
2. **Password requirements**: Minimum 6 characters
3. **Account management**: Users can delete their accounts
4. **Multiple providers**: Can enable Google, GitHub, etc.

### Firestore Security

- **User data**: Users can only access their own data
- **Role-based access**: Admins have broader permissions
- **Appointment access**: Only student and teacher involved
- **Message access**: Only sender and receiver

---

## 🚀 Deployment Process

### Option 1: Firebase Hosting

```bash
# Build your project (if using build tools)
npm run build

# Deploy to Firebase
firebase deploy

# Your app will be live at:
# https://YOUR_PROJECT_ID.web.app
```

### Option 2: GitHub Pages (Current setup)

```bash
# Push to GitHub
git add .
git commit -m "Firebase configuration added"
git push origin main

# Enable GitHub Pages in repository settings
# Your app will be live at:
# https://yourusername.github.io/repository-name
```

---

## 🧪 Testing Firebase Integration

### Test Authentication

```javascript
// Test user registration
const testRegister = async () => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', result.user.uid);
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Test user login
const testLogin = async () => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', result.user.uid);
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Test Firestore Operations

```javascript
// Test adding data
const testAddData = async () => {
  try {
    await addDoc(collection(db, 'users'), {
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      createdAt: new Date()
    });
    console.log('Data added successfully');
  } catch (error) {
    console.error('Add data error:', error);
  }
};

// Test reading data
const testReadData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach(doc => {
      console.log(doc.id, ' => ', doc.data());
    });
  } catch (error) {
    console.error('Read data error:', error);
  }
};
```

---

## 📈 Monitoring & Analytics

### Firebase Console Features

1. **Authentication**: Monitor user registrations and logins
2. **Firestore**: Database usage and performance
3. **Hosting**: Traffic and performance metrics
4. **Crashlytics**: Error reporting and crash analysis

### Performance Monitoring

```javascript
// Add to your HTML head:
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-performance.js"></script>

// Initialize in your JS:
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

---

## 🤝 Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Authentication Guide**: https://firebase.google.com/docs/auth
- **Hosting Guide**: https://firebase.google.com/docs/hosting
- **Community Support**: https://stackoverflow.com/questions/tagged/firebase

---

## ⚠️ Important Notes

1. **Firebase Quotas**: Monitor your usage to stay within free tier limits
2. **Security Rules**: Always implement proper security rules before going live
3. **Environment Variables**: Never expose API keys in public repositories
4. **Backup Strategy**: Regularly backup your Firestore data
5. **Cost Management**: Monitor usage and set up billing alerts

---

**This Firebase setup will provide a production-ready backend for your Student-Teacher Booking System!**