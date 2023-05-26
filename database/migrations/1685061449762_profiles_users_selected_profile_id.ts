import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('selected_profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('NO ACTION')
        .notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('selected_profile_id')
    })
  }
}
