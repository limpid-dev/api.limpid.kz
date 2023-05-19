import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('pay_id')
      table.string('cancel_token')
    })
  }
}
