import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class CountrySeeder extends BaseSeeder {
  public static environment = ['development']
  public async run() {
    const uniqueKey = 'firstName'

    await User.updateOrCreateMany(uniqueKey, [
      {
        firstName: 'John',
        selectedProfileId: 1,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Jane',
        selectedProfileId: 2,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Alex',
        selectedProfileId: 3,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Michael',
        selectedProfileId: 4,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Ernest',
        selectedProfileId: 5,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Emma',
        selectedProfileId: 6,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Oliver',
        selectedProfileId: 7,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'Sophia',
        selectedProfileId: 8,
        emailVerifiedAt: DateTime.now(),
      },
      {
        firstName: 'David',
        selectedProfileId: 9,
        emailVerifiedAt: DateTime.now(),
      },
    ])
  }
}
