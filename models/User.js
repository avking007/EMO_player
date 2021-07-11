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
  songDetails: {
    happy: [{
      songId: {
        type: String
      },
      liked:{
        type: Boolean,
        default: false,
      },
      thumbnail: {
        type: String,
        default: ""
      },
      channelTitle : {
        type: String,
        defualt:""
      },
      title: {
        type: String,
        default: ""
      },
      playCount: {
        type: Number,
        default: 0,
      },
      SkippedCount: {
        type: Number,
        default: 0,
      },
    }],

    sad: [{
      songId: {
        type: String
      },
      liked:{
        type: Boolean,
        default: false,
      },
      thumbnail: {
        type: String,
        default: ""
      },
      channelTitle : {
        type: String,
        defualt:""
      },
      title: {
        type: String,
        default: ""
      },
      playCount: {
        type: Number,
        default: 0,
      },
      SkippedCount: {
        type: Number,
        default: 0,
      },
    }],
    angry: [{
      songId: {
        type: String
      },
      liked:{
        type: Boolean,
        default: false,
      },
      thumbnail: {
        type: String,
        default: ""
      },
      channelTitle : {
        type: String,
        defualt:""
      },
      title: {
        type: String,
        default: ""
      },
      playCount: {
        type: Number,
        default: 0,
      },
      SkippedCount: {
        type: Number,
        default: 0,
      },
    }],
    neutral: [{
      songId: {
        type: String
      },
      thumbnail: {
        type: String,
        default: ""
      },
      liked:{
        type: Boolean,
        default: false,
      },
      channelTitle : {
        type: String,
        defualt:""
      },
      title: {
        type: String,
        default: ""
      },
      playCount: {
        type: Number,
        default: 0,
      },
      SkippedCount: {
        type: Number,
        default: 0,
      },
    }],

  }
}
);

module.exports = User = mongo.model('user', UserSchema);
