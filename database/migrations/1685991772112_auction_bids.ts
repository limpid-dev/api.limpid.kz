import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'auction_bids'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('auction_id')
        .unsigned()
        .references('id')
        .inTable('auctions')
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
      table.unique(['auction_id', 'profile_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
