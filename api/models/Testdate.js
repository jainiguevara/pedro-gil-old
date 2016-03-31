/**
 * Testdate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
  },
  
  beforeCreate: function (values, cb) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var newDateWithOffset = new Date(utc + (3600000 * '+8')); //(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi
    values.createdAt = newDateWithOffset;
    values.updatedAt = newDateWithOffset;
    console.log(values.createdAt);
    cb();
  },
  
  beforeUpdate: function (values, cb) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var newDateWithOffset = new Date(utc + (3600000 * '+8')); //(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi
    values.updatedAt = newDateWithOffset;
    console.log(values.createdAt);
    cb();
  }
};

