import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import execa from 'execa'

export default class Resource extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'resource'

  @args.string({ description: 'Name of the resource to create' })
  public name: string

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Combines make commands to generate a resource'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    await execa.node('ace', ['make:controller', this.name, '-r'], {
      stdio: 'inherit',
    })
    await execa.node('ace', ['make:model', this.name, '-m'], {
      stdio: 'inherit',
    })
    await execa.node('ace', ['make:validator', `${string.pluralize(this.name)}Index`], {
      stdio: 'inherit',
    })
    await execa.node('ace', ['make:validator', `${string.pluralize(this.name)}Store`], {
      stdio: 'inherit',
    })
    await execa.node('ace', ['make:validator', `${string.pluralize(this.name)}Update`], {
      stdio: 'inherit',
    })
    await execa.node('ace', ['make:validator', `${string.pluralize(this.name)}Destroy`], {
      stdio: 'inherit',
    })
  }
}
