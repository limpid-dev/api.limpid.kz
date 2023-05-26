import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('display_name', 255).notNullable()
      table.string('description', 255).nullable()
      table.string('location', 255).nullable()
      table.string('industry', 255).nullable()
      table.string('owned_intellectual_resources', 2048).nullable()
      table.string('owned_material_resources', 2048).nullable()
      table.string('bin', 12).nullable()
      table.string('perfomance', 2048).nullable()
      table.string('type').nullable()
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.boolean('is_personal').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('verified_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
