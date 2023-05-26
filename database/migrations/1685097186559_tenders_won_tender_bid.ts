import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tenders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('won_tender_bid_id')
        .unsigned()
        .references('id')
        .inTable('tender_bids')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('won_tender_bid_id')
    })
  }
}
