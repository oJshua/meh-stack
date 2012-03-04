
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , mongooseAuth = require('mongoose-auth')
  , settings = require('../settings.js')
  , ObjectId = Schema.ObjectId;

var User;
var userSchema = new Schema();
  
userSchema.add({
});

userSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function() {
        return User;
      }
    }
  },
  facebook: {
    everyauth: {
      myHostname: settings.app.callback,
      appId: settings.facebook.appId,
      appSecret: settings.facebook.appSecret,
      redirectPath: '/create'
    }
  },
  twitter: {
    everyauth: {
        myHostname: settings.app.callback
      , consumerKey: settings.twitter.consumerKey
      , consumerSecret: settings.twitter.consumerSecret
      , redirectPath: '/create'
    }
  }
});

module.exports = User = mongoose.model('User', userSchema);