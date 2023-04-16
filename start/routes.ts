/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import './routes/session'
import './routes/verification'
import './routes/recovery'
import './routes/user'
import './routes/profile'
import './routes/project'
import './routes/message'
import './routes/membership'
import './routes/project-file'
import './routes/certificate-file'
import './routes/resource'
import './routes/contact'
import './routes/certificate'
import './routes/education'
import './routes/auction'
import './routes/auction-file'
import './routes/auction-bid'
import './routes/experience'
import './routes/notification'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.get('csrf', async ({ response }) => {
  return response.ok({})
})
