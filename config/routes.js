/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
      
  'get /': 'PageController.marshallHomepage',
  'get /dashboard' : 'DashboardController.dashboard',
  'get /login': {
    view: 'login',
    locals: 
    {
      layout: 'layout-public',
      title: 'Login'
    }
      },
    
  /* JSON API */
  //Permission
  'post /command/create' : 'CommandController.create',
  'post /command/update' : 'CommandController.update',
  //User
  'post /login' : 'UserController.login',
  'post /user/reset' : 'UserController.reset',
  'post /user/create' : 'UserController.create',

  //Applicant
  'get /applicant/search' : 'ApplicantController.search',
  'post /applicant/create' : 'ApplicantController.create',
  'post /applicant/update' : 'ApplicantController.update',
  'post /applicant/deploy' : 'ApplicantController.deploy',
  //Payment
  'post /payment/create' : 'PaymentController.create',
  'post /payment/update' : 'PaymentController.update',
  //Expense
  'post /expense/create' : 'ExpenseController.create',
  'post /expense/update' : 'ExpenseController.update',
  //Service Fee
  'post /servicefee/create' : 'ServiceFeeController.create',
  'post /servicefee/update' : 'ServiceFeeController.update',
  //Type
  'post /type/create' : 'TypeController.create',
  'post /type/update' : 'TypeController.update',
  //Tie-Up
  'post /tieup/create' : 'TieUpController.create',
  'post /tieup/update' : 'TieUpController.update',
  
  /* GET ACTIONS RE-ROUTES */
  //Permission
  'get /permission/create' : 'UserController.create',
  'get /permission/update' : 'UserController.update',
  //User
  'get /user/create' : '/',
  'get /user/reset' : '/',
  //'get /user' : '/',
  //Applicant
  'get /applicant/create' : '/',
  'get /applicant/update' : '/',
  //Payment
  'get /payment/create' : '/',
  'get /payment/update' : '/',
  //Expense
  'get /expense/create' : '/',
  'get /expense/update' : '/',
  //Service Fee
  'get /servicefee/create' : '/',
  'get /servicefee/update' : '/',
  //Type
  'get /type/create' : '/',
  'get /type/update' : '/',
  //Tie-Up
  'get /tieup/create' : '/',
  'get /tieup/update' : '/'
  
};
