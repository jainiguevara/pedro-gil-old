/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {
  connection: 'ML_txTracking',
  attributes: {
    
    username : { 
      type: 'string',
      required: true,
      unique: true
    },
    
    firstName : { 
      type: 'string', 
      required: true
    },
    
    lastName : { 
      type: 'string', 
      required: true
    },
    
    dateOfBirth : { 
      type: 'date', 
      required: true
    },
    
    email : { 
      type: 'email', 
      unique: true
    },
    
    role : { 
      type: 'string',
      required: true
    },
    
    password : { 
      type: 'string',
      minLength: 8,
      required: true,
      columnName: 'encrypted_password'
    },
    
    title : { type: 'string' },
    
    status : {
      type: 'integer',
      enum: [1, 0],
      defaultsTo : 1,
      required: true
    },
    
    createdBy : {
      type: 'string',
      required: true
    },
    
    updatedBy : {
      type: 'string',
      required: true
    },
  },
    // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
    var date = sails.config.globals.phDate;
    var defaultPw = values.username + "-P@ssw0rd1234";
    console.log(defaultPw);
    // Encrypt password
    bcrypt.hash(defaultPw, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      values.createdAt = date;
      values.updatedAt = date;
      
      cb();
    });
  },

  beforeUpdate: function (values, cb) {
    var date = sails.config.globals.phDate;
    values.updatedAt = date;
    console.log(values.password);
    if (values.password !== undefined & values.password !== '')
    {
      // Encrypt password
      bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      
      console.log(values.status);
          cb();
      });
    } else cb();   
  }
};

