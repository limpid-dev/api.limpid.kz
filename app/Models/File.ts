import { parse } from 'path'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import {
  BelongsTo,
  ModelPaginatorContract,
  afterCreate,
  afterDelete,
  afterFetch,
  afterFind,
  afterPaginate,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Auction from './Auction'
import Certificate from './Certificate'
import Project from './Project'
import User from './User'
import Tender from './Tender'
import Organization from './Organization'

export default class File extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public size: number

  @column()
  public mimeType: string

  @column()
  public extname: string

  @column()
  public organizationId: number | null

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column()
  public userId: number | null

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public certificateId: number | null

  @belongsTo(() => Certificate)
  public certificate: BelongsTo<typeof Certificate>

  @column()
  public projectId: number | null

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public auctionId: number | null

  @belongsTo(() => Auction)
  public auction: BelongsTo<typeof Auction>

  @column()
  public tenderId: number | null

  @belongsTo(() => Tender)
  public tender: BelongsTo<typeof Tender>

  public static from(multipart: MultipartFileContract) {
    const file = new File()

    file.size = multipart.size
    file.mimeType = `${multipart.type}/${multipart.subtype}`
    file.extname = `.${multipart.extname}`
    file.name = `${parse(multipart.clientName.replace(' ', '_')).name}_${cuid()}.${
      multipart.extname
    }`

    file.$extras._multipart = multipart

    return file
  }

  public serializeExtras() {
    return {
      url: this.$extras._url,
    }
  }

  public async preComputeUrl() {
    this.$extras._url = await Drive.getUrl(this.name)
  }

  @afterCreate()
  public static async afterCreate(file: File) {
    const multipart = file.$extras._multipart as MultipartFileContract

    await multipart.moveToDisk('./', { name: file.name })
  }

  @afterDelete()
  public static async afterDelete(file: File) {
    await Drive.delete(file.name)
  }

  @afterFind()
  public static async afterFind(file: File) {
    await file.preComputeUrl()
  }

  @afterFetch()
  public static async afterFetch(file: File[]) {
    await Promise.all(file.map(File.afterFind))
  }

  @afterPaginate()
  public static async afterPaginate(paginator: ModelPaginatorContract<File>) {
    await Promise.all(paginator.all().map(File.afterFind))
  }
}
