// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: true
  },
  profileImageId: { type: String, default: null },
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  friends: [{
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'rejected'],
      default: 'Pending'
    } // Friend request status
  }],
  notifications: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      default: 'Pending'
    }, // 'Pending', 'Viewed', 'Started'
    quizScore: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time when a notification is created
    },
    updatedAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time when a notification is created
    }
  }],
  friendRequestNotification: [{
    friendName: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'rejected'],
      default: 'Pending'
    },
    viewStatus: {
      type: String,
      default : ['unviewed', 'viewed'],
       default: 'unviewed'
    },
    createdAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time when a notification is created
    },
    updatedAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time when a notification is created
    }
  }]
});

// Customize the JSON output to omit empty arrays
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    if (!ret.quizzes.length) {
      delete ret.quizzes;
    }
    if (!ret.friends.length) {
      delete ret.friends;
    }
    if (!ret.notifications.length) {
      delete ret.notifications;
    }
    // m
    if (!ret.friendRequestNotification.length) {
      delete ret.friendRequestNotification;
    }


    return ret;
  }
});

// Pre-save hook to hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });


userSchema.pre('save', async function (next) {
  // Check if the password has been modified
  if (!this.isModified('password')) {
    // If password is not modified, update notification timestamps before proceeding
    this.notifications.forEach(notification => {
      notification.updatedAt = Date.now();
    });

//m
    this.friendRequestNotification.forEach(notification => {
      notification.updatedAt = Date.now();
    });


    

    return next(); // Proceed without hashing
  }

  // Hash the password if it has been modified
  this.password = await bcrypt.hash(this.password, 12);

  // Update notification timestamps
  this.notifications.forEach(notification => {
    notification.updatedAt = Date.now();
  });

  // m

  this.friendRequestNotification.forEach(notification => {
    notification.updatedAt = Date.now();
  });

  next(); // Proceed to save the document
});





// Method to compare hashed password with the input password
userSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    throw new Error('Invalid password or user record.');
  }
  return bcrypt.compare(password, this.password);
};

// Method to generate a JWT token
userSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
};

// Add a method to handle friend requests
userSchema.methods.addFriend = async function (friendId) {
  const existingRequest = this.friends.find(
    (friend) => friend.friend.toString() === friendId.toString()
  );

  if (existingRequest) {
    throw new Error('Friend request already exists or user is already a friend.');
  }

  this.friends.push({ friend: friendId, status: 'Pending' });
  return this.save();
};

// Accept a friend request
userSchema.methods.acceptFriendRequest = async function (friendId) {
  const friendRequest = this.friends.find(
    (friend) => friend.friend.toString() === friendId.toString() && friend.status === 'Pending'
  );

  if (!friendRequest) {
    throw new Error('Friend request not found.');
  }

  friendRequest.status = 'Accepted';
  return this.save();
};

// Reject a friend request
userSchema.methods.rejectFriendRequest = async function (friendId) {
  const friendRequest = this.friends.find(
    (friend) => friend.friend.toString() === friendId.toString() && friend.status === 'Pending'
  );

  if (!friendRequest) {
    throw new Error('Friend request not found.');
  }

  this.friends = this.friends.filter(
    (friend) => friend.friend.toString() !== friendId.toString()
  );
  return this.save();
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
