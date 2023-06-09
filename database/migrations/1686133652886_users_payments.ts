import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('projects_atmpts').defaultTo(1);
      table.integer('auction_atmpts').defaultTo(1);
      table.timestamp('payment_start', { useTz: true })
      table.timestamp('payment_end', { useTz: true })
    })
  }
}
