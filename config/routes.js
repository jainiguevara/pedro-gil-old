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
  'get /adminportal' : 'AdminController.admin',
  'get /login': {
    view: 'login',
    locals: 
    {
      layout: 'layout-public',
      title: 'Login'
    }
      },
  /* REPORTS */
  'get /report/expense' : 'ReportController.expense',
  'get /report/collection' : 'ReportController.collection',
  'get /report/collectibles' : 'ReportController.collectibles',
  'get /report/deployment' : 'ReportController.deployment',
  'get /report/ledger' : 'ReportController.ledger',
  
  /* JSON API */
  
  //Command
  'post /command/create' : 'CommandController.create',
  'post /command/update' : 'CommandController.update',
  //User
  'post /login' : 'UserController.login',
  'get /logout' : 'UserController.logout',
  'post /user/reset' : 'UserController.reset',
  'post /user/changePassword' : 'UserController.changePassword',
  'post /user/create' : 'UserController.create',
  'post /user/update' : 'UserController.update',
  'get /user/search' : 'UserController.search',
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
  //Collectible
  'post /collectible/create' : 'CollectibleController.create',
  'post /collectible/update' : 'CollectibleController.update',
  //Service Fee
  'post /servicefee/create' : 'ServiceFeeController.create',
  'post /servicefee/update' : 'ServiceFeeController.update',
  //Type
  'post /type/create' : 'TypeController.create',
  'post /type/update' : 'TypeController.update',
  'get /type/get' : 'TypeController.get',
  'get /type/search' : 'TypeController.search',
  //Tie-Up
  'post /tieup/create' : 'TieUpController.create',
  'post /tieup/update' : 'TieUpController.update',
  'get /tieup/get' : 'TieUpController.get',
  'get /tieup/search' : 'TieUpController.search',
  //Country
  'post /country/create' : 'CountryController.create',
  'post /country/update' : 'CountryController.update',
  'get /country/get' : 'CountryController.get',
  'get /center/search' : 'CountryController.search',
  //Center
  'post /center/create' : 'CenterController.create',
  'post /center/update' : 'CenterController.update',
  'get /center/get' : 'CenterController.get',
  'get /center/search' : 'CenterController.search',
  /* GET ACTIONS RE-ROUTES */
  //Command
  'get /command' : '/',
  'get /permission' : '/',
  'get /permission/create' : 'UserController.create',
  'get /permission/update' : 'UserController.update',
  //User
  'get /user' : '/',
  'get /user/create' : '/',
  'get /user/reset' : '/',
  //Applicant
  'get /applicant' : '/',
  'get /applicant/create' : '/',
  'get /applicant/update' : '/',
  //Payment
  'get /payment' : '/',
  'post /payment/view' : '/',
  'get /payment/create' : '/',
  'get /payment/update' : '/',
  //Expense
  'get /expense' : '/',
  'get /expense/create' : '/',
  'get /expense/update' : '/',
  //Collectible
  'get /collectible' : '/',
  'get /collectible/create' : '/',
  'get /collectible/update' : '/',
  //Service Fee
  'get /servicefee' : '/',
  'get /servicefee/create' : '/',
  'get /servicefee/update' : '/',
  //Type
  'get /type' : '/',
  'get /type/create' : '/',
  'get /type/update' : '/',
  //Tie-Up
  'get /tieup' : '/',
  'get /tieup/create' : '/',
  'get /tieup/update' : '/',
  //Country
  'get /country' : '/',
  'get /country/create' : '/',
  'get /country/update' : '/',
  //Center
  'get /center' : '/',
  'get /center/create' : '/',
  'get /center/update' : '/'
};
