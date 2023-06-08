import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('display_name', 255).notNullable()
      table.string('description', 255).notNullable()
      table.string('location', 255).notNullable()
      table.string('industry', 255).notNullable()
      table.string('owned_intellectual_resources', 2048).nullable()
      table.string('owned_material_resources', 2048).nullable()
      table.string('tin', 255).notNullable()
      table.string('performance', 2048).nullable()
      table.string('legal_structure', 255).nullable()
      table.integer('views').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable()
      table.boolean('is_personal').notNullable()
      table.json('avatar').nullable()
      table.string('instagram_url', 2048).nullable()
      table.string('whatsapp_url', 2048).nullable()
      table.string('website_url', 2048).nullable()
      table.string('telegram_url', 2048).nullable()
      table.string('two_gis_url', 2048).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('tin_verified_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
