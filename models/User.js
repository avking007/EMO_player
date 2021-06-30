const mongo = require('mongoose');

const UserSchema = new mongo.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  songDetails: [{
    songId: {
      type: String
    },
    likedCount: {
      type: Number,
      default: 0,
    },
    SkippedCount: {
      type: Number,
      default: 0,
    }
  }
  ]
}
);

module.exports = User = mongo.model('user', UserSchema);
