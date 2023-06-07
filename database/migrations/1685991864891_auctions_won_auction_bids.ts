import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'auctions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('won_auction_bid_id')
        .unsigned()
        .references('id')
        .inTable('auction_bids')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('won_auction_bid_id')
    })
  }
}
