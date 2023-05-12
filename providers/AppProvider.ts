import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const { default: CamelCaseNamingStrategy } = await import(
      'App/Strategies/CamelCaseNamingStrategy'
    )
    const { BaseModel } = this.app.container.use('Adonis/Lucid/Orm')
    BaseModel.namingStrategy = new CamelCaseNamingStrategy()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
