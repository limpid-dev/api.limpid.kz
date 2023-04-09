import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export default Factory.define(User, ({ faker }) => {
  return {
    bornAt: DateTime.now(),
    id: Number(faker.random.numeric(10)),
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    rememberMeToken: null,
    verifiedAt: faker.helpers.maybe(() => DateTime.now()),
  }
}).build()
