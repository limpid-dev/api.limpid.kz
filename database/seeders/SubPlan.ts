import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SubPlans from '../../app/Models/SubPlans'

export default class extends BaseSeeder {
  public static environment = ['development', 'production']
  public async run() {
    await SubPlans.createMany([
      {
        name: 'light_month',
        amount: 4990,
        projects_attempts: 3,
        auctions_attempts: 7,
        duration: 30,
      },
      {
        name: 'light_quarter',
        amount: 12990,
        projects_attempts: 9,
        auctions_attempts: 21,
        duration: 90,
      },
      {
        name: 'light_year',
        amount: 37990,
        projects_attempts: 36,
        auctions_attempts: 84,
        duration: 365,
      },
      {
        name: 'standart_month',
        amount: 8990,
        projects_attempts: 5,
        auctions_attempts: 15,
        duration: 30,
      },
      {
        name: 'standart_quarter',
        amount: 20990,
        projects_attempts: 15,
        auctions_attempts: 45,
        duration: 90,
      },
      {
        name: 'standart_year',
        amount: 59900,
        projects_attempts: 60,
        auctions_attempts: 180,
        duration: 365,
      },
      {
        name: 'premium_quarter',
        amount: 199900,
        projects_attempts: 10000,
        auctions_attempts: 10000,
        duration: 90,
      },
      {
        name: 'premium_year',
        amount: 639900,
        projects_attempts: 10000,
        auctions_attempts: 10000,
        duration: 365,
      },
      {
        name: 'create_atmpt',
        amount: 1999,
        projects_attempts: 0,
        auctions_attempts: 1,
        duration: 365,
      },
    ])
  }
}
