/**
 * Applicant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'ML_txTracking',
  attributes: {
    
    referenceNo : { 
      type: 'string',
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
    
    passportNo : { 
      type: 'string', 
      required: true,
      unique: false
    },
    
    oec : { 
      type: 'string', 
      unique: false
    },
    
    cg : { 
      type: 'string',
      unique: false
    },
    
    pdos : { 
      type: 'string', 
      unique: false
    },
    
    principal : { //tie-up
      type: 'string',
    },
    
    employer : { 
      type: 'string',
    },
    
    state : {
      type: 'integer',
      enum: [0, 1], //0 - in progress, 1 - deployed
      defaultsTo : 0,
      required: true
    },
    
    dateDeployed : { 
      type: 'date'
    },
    
    country : { 
      type: 'string',
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
    
    payments: {
      collection: 'payment',
      via: 'owner'
    },
    
    expenses: {
      collection: 'expense',
      via: 'owner'
    },
    
    servicefees: {
      collection: 'servicefee',
      via: 'owner'
    },
    
    collectibles: {
      collection: 'collectible',
      via: 'owner'
    }
  },
  
  beforeCreate: function (values, cb) {
    try {
    var date = sails.config.globals.phDate;
    var refNo = values.firstName.substring(0,1) + 
                values.lastName.substring(0,1) + 
                values.passportNo + 
                date.getMonth() + 
                date.getDay() + 
                date.getYear() +
                date.getHours() +
                date.getMinutes();
    values.referenceNo = refNo;
    values.createdAt = date;
    values.updatedAt = date;
    } catch (e) { console.log(e);}
    cb();
  },
  
  beforeUpdate: function (values, cb) {
    var date = sails.config.globals.phDate;
    values.updatedAt = date;
    cb();
  }
};
