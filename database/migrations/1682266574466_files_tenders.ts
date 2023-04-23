import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tender_id').unsigned().references('id').inTable('tenders').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('tender_id')
    })
  }
}
