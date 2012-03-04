
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
  password: {
    everyauth: {
        getLoginPath: '/login'
      , postLoginPath: '/login'
      , loginView: 'login.hbs'
      , getRegisterPath: '/register'
      , postRegisterPath: '/register'
      , registerView: 'register.hbs'
      , loginSuccessRedirect: '/account'
      , registerSuccessRedirect: '/account'
    }
  }
});

userSchema.statics.getFollowed = function(query, result) {

  function map() {
    for(var i in this.followers) {
      emit(this.followers[i], this._id); 
    }
  }

  function reduce(key, values) {
    var users = [];
    values.forEach(function(v){
      users.push(v);
    });
    return { users: users };
  }

  User.collection.mapReduce(
    map.toString(),
    reduce.toString(),
    {
      out: 'user_followers',
      query: query,
      include_statistics: true
    },
    result
  );
};

module.exports = User = mongoose.model('User', userSchema);