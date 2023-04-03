import { BaseCommand, args } from '@adonisjs/core/build/standalone'

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
    this.logger.info('Hello world!')
  }
}
