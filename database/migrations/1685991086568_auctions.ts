import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'auctions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title', 255).notNullable()
      table.string('description', 2048).notNullable()
      table.string('industry', 255).notNullable()
      table.decimal('starting_price', 20, 4).nullable()
      table.decimal('purchase_price', 20, 4).nullable()
      table.string('duration', 255).notNullable()
      table.json('technical_specification').nullable()
      table.json('photo_one').nullable()
      table.json('photo_two').nullable()
      table.json('photo_three').nullable()
      table.json('photo_four').nullable()
      table.json('photo_five').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('verified_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
