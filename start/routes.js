'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

const { sendTestEmail } = require('../app/Services/SendGrid/SendGrid');

Route.group(() => {
  Route.post('/register', 'AuthController.register').validator('Register');
  Route.post('/login', 'AuthController.login');
  Route.get('/me', 'AuthController.session').middleware(['auth']);
}).prefix('/auth');

Route.resource('file', 'FileController')
  .middleware(new Map([[['destroy', 'store', 'index', 'show'], ['auth']]]))
  .apiOnly();

Route.resource('user', 'UserController')
  .middleware(new Map([[['destroy', 'store', 'index', 'show'], ['auth']]]))
  .apiOnly();

Route.get('/sendmail', async ({ response }) => {
  try {
    return await sendTestEmail();
  } catch (error) {
    return response.status(500).json(error);
  }
});
