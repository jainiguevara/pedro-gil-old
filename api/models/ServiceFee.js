/**
 * ServiceFee.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type : {
      type: 'string',
      //enum: [0, 1],
      //defaultsTo : 0,
      required: true
    },
    
    transactionDate : { 
      type: 'date', 
      required: true
    },
    
    amount : { 
      type: 'float',
      required: true
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
    },
    
    owner: {
      model: 'applicant',
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

