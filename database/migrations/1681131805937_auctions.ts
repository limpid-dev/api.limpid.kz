import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'auctions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table.string('title')
      table.string('description', 2048)
      table.decimal('starting_price', 20, 4)
      table.decimal('purchase_price', 20, 4)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('finished_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
