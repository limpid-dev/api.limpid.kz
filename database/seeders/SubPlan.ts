import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SubPlans from '../../app/Models/SubPlans'

export default class extends BaseSeeder {
  public static environment = ['development', 'production']
  public async run() {
    await SubPlans.createMany([
      {
        name: 'light_month',
        amount: 4990,
        projectsAttempts: 3,
        auctionsAttempts: 7,
        duration: 30,
      },
      {
        name: 'light_quarter',
        amount: 12990,
        projectsAttempts: 9,
        auctionsAttempts: 21,
        duration: 90,
      },
      {
        name: 'light_year',
        amount: 37990,
        projectsAttempts: 36,
        auctionsAttempts: 84,
        duration: 365,
      },
      {
        name: 'standart_month',
        amount: 8990,
        projectsAttempts: 5,
        auctionsAttempts: 15,
        duration: 30,
      },
      {
        name: 'standart_quarter',
        amount: 20990,
        projectsAttempts: 15,
        auctionsAttempts: 45,
        duration: 90,
      },
      {
        name: 'standart_year',
        amount: 59900,
        projectsAttempts: 60,
        auctionsAttempts: 180,
        duration: 365,
      },
      {
        name: 'premium_quarter',
        amount: 199900,
        projectsAttempts: 10000,
        auctionsAttempts: 10000,
        duration: 90,
      },
      {
        name: 'premium_year',
        amount: 639900,
        projectsAttempts: 10000,
        auctionsAttempts: 10000,
        duration: 365,
      },
      {
        name: 'create_atmpt',
        amount: 1999,
        projectsAttempts: 0,
        auctionsAttempts: 1,
        duration: 365,
      },
    ])
  }
}
