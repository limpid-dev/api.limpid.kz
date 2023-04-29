import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('certificate_id')
        .unsigned()
        .references('id')
        .inTable('certificates')
        .onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('certificate_id')
    })
  }
}
