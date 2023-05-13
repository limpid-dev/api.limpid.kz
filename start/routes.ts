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
import './routes/project-membership'
import './routes/project-file'
import './routes/profile-contact'
import './routes/certificate'
import './routes/education'
import './routes/experience'
import './routes/skill'
import './routes/tender'
import './routes/tender-file'
import './routes/tender-bid'
import './routes/organization'
import './routes/organization-file'
import './routes/organization-contact'
import './routes/organization-membership'
import './routes/organization-certificate'
import './routes/organization-experience'
import './routes/payment'

Route.get('templates/:template', 'TemplatesController.show')

Route.get('health', async ({ response }) => {
  const data = await HealthCheck.getReport()

  return data.healthy ? response.ok({ data }) : response.badRequest({ data })
})

Route.get('csrf', () => { })
