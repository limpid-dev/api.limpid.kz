import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SubPlans from '../../app/Models/SubPlans'

export default class extends BaseSeeder {
  public async run () {
    await SubPlans.createMany([
      {
      name: 'light_month',
      amount: 4990,
      projects_atmpts: 3,
      auction_atmpts: 7,
      duration: 30,
    },
    {
      name: 'light_quarter',
      amount: 12990,
      projects_atmpts: 9,
      auction_atmpts: 21,
      duration: 90,
    },
    {
      name: 'light_year',
      amount: 37990,
      projects_atmpts: 36,
      auction_atmpts: 84,
      duration: 365,
    },
    {
      name: 'standart_month',
      amount: 8990,
      projects_atmpts: 5,
      auction_atmpts: 15,
      duration: 30,
    },
    {
      name: 'standart_quarter',
      amount: 20990,
      projects_atmpts: 15,
      auction_atmpts: 45,
      duration: 90,
    },
    {
      name: 'standart_year',
      amount: 59900,
      projects_atmpts: 60,
      auction_atmpts: 180,
      duration: 365,
    },
    {
      name: 'premium_quarter',
      amount: 199900,
      projects_atmpts: 1000,
      auction_atmpts: 1000,
      duration: 90,
    },
    {
      name: 'premium_year',
      amount: 639900,
      projects_atmpts: 1000,
      auction_atmpts: 1000,
      duration: 365,
    },
    {
      name: 'create_atmpt',
      amount: 1999,
      projects_atmpts: 0,
      auction_atmpts: 1,
      duration: 365,
    },
  ])
  }
}