import puppeteer, { Browser } from 'puppeteer'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

const minimalArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class BrowserProvider {
  constructor(protected app: ApplicationContract) {}

  private browser: Browser

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const Redis = this.app.container.use('Adonis/Addons/Redis')
    const wsEndpoint = await Redis.get('wsEndpoint')
    // All bindings are ready, feel free to use them

    if (wsEndpoint) {
      try {
        const browser = await puppeteer.connect({
          browserWSEndpoint: wsEndpoint,
        })
        this.browser = browser

        this.app.container.singleton('Browser', () => browser)
      } catch (error) {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: minimalArgs,
          executablePath: '/usr/bin/google-chrome',
        })

        await Redis.set('wsEndpoint', browser.wsEndpoint())
        this.browser = browser

        this.app.container.singleton('Browser', () => browser)
      }
    } else {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: minimalArgs,
        executablePath: '/usr/bin/google-chrome',
      })

      await Redis.set('wsEndpoint', browser.wsEndpoint())
      this.browser = browser

      this.app.container.singleton('Browser', () => browser)
    }
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    await this.browser.close()
    // Cleanup, since app is going down
  }
}
