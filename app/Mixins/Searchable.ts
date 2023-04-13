import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'

export const Searchable = <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
  return class extends superclass {
    public static search: string[] = []
  }
}
