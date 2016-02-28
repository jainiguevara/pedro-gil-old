/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    id : { 
      type: 'integer',
      //autoincrement: true,
      primaryKey : true,
      columnName: 'the_primary_key'
    },
    
    employeeID : { 
      type: 'string',
      required: true
    },
    
    firstName : { 
      type: 'string', 
      required: true
    },
    
    lastName : { 
      type: 'string', 
      required: true
    },
    
    dateofBirth : { 
      type: 'date', 
      required: true
    },
    
    email : { 
      type: 'email', 
      unique: true
    },
    
    password : { 
      type: 'string',
      minLength: 8,
      required: true,
      columnName: 'encrypted_password'
    },
    
    title : { type: 'string' },
  },
    // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};

