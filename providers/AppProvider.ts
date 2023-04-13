import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

function isFilter(query: unknown): query is Record<string, string> {
  return typeof query === 'object' && query !== null
}

function isSort(query: unknown): query is string[] {
  return Array.isArray(query)
}

function isSearch(query: unknown): query is string {
  return typeof query === 'string' && query !== ''
}

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database')
    const { string } = this.app.container.use('Adonis/Core/Helpers')

    ModelQueryBuilder.macro('qs', function (qs: Record<string, unknown>) {
      const columns = this.model.$columnsDefinitions as Map<string, unknown>

      Object.entries(qs).forEach(([key, value]) => {
        if (key === 'filter') {
          if (isFilter(value)) {
            Object.entries(value).forEach(([field, value]) => {
              if (columns.has(field)) {
                this.where(string.snakeCase(field), value)
              }
            })
          }
        }
        if (key === 'sort' && isSort(value)) {
          value.forEach((field) => {
            if (field.startsWith('-')) {
              if (columns.has(field.slice(1))) {
                this.orderBy(string.snakeCase(field.slice(1)), 'desc')
              }
            } else {
              if (columns.has(field)) {
                this.orderBy(string.snakeCase(field), 'asc')
              }
            }
          })
        }

        if (key === 'search' && isSearch(value)) {
          const search = this.model.search as Set<string>

          this.where((query) => {
            search.forEach((field) => {
              if (columns.has(field)) {
                query.orWhere(string.snakeCase(field), 'LIKE', `%${value}%`)
              }
            })
          })
        }
      })

      return this
    })
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}

declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    qs(qs: Record<string, unknown>): this
  }
}
