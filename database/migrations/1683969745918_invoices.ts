import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('plan_id')
        .unsigned()
        .references('id')
        .inTable('sub_plans')
        .onDelete('SET NULL')
      table.integer('amount')
      table.string('currency').defaultTo('KZT')
      table.string('description').defaultTo('Оплата подписки на Lim')
      table.string('post_link')
      table.string('language').defaultTo('rus')
      table.string('terminal')
      table.string('status')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
