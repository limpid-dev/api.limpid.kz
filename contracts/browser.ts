declare module '@ioc:Browser' {
  import { Browser as PuppeteerBrowser } from 'puppeteer'
  const Browser: PuppeteerBrowser
  export default Browser
}
