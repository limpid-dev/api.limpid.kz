import { ColumnOptions, LucidModel, OptionalTypedDecorator } from '@ioc:Adonis/Lucid/Orm'
import { Duration, DurationOptions } from 'luxon'

export type DurationDecorator = (
  options?: DurationOptions & Partial<ColumnOptions>
) => OptionalTypedDecorator<Duration | null>

export const duration: DurationDecorator = (options) => {
  return function (target, property) {
    const Model = target.constructor as LucidModel
    Model.boot()

    const { locale, numberingSystem, conversionAccuracy, ...columnOptions } = options || {}

    Model.$addColumn(property, {
      consume: (value) => (value ? Duration.fromISO(value) : null),
      prepare: (value) => (value ? value.toISO() : null),
      serialize: (value) => (value ? JSON.stringify(value.toObject()) : null),
      ...columnOptions,
    })
  }
}