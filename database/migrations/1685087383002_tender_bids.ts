import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tender_bids'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('tender_id')
        .unsigned()
        .references('id')
        .inTable('tenders')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
      table.decimal('price', 20, 4).notNullable()
      table.unique(['tender_id', 'profile_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
