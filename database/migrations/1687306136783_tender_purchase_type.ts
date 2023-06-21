import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tenders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('purchase_type', 255).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('purchase_type')
    })
  }
}
