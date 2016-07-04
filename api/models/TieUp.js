/**
 * TieUp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name : {
      type: 'string',
      required: true,
      unique: true
    },
    
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
    }
  },
  
  beforeCreate: function (values, cb) {
    var date = sails.config.globals.phDate;
    values.createdAt = date;
    values.updatedAt = date;
    cb();
  },
  
  beforeUpdate: function (values, cb) {
    var date = sails.config.globals.phDate;
    values.updatedAt = date;
    cb();
  }
};

