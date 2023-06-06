import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('chat_id')
        .unsigned()
        .references('id')
        .inTable('chats')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('chat_id')
    })
  }
}
