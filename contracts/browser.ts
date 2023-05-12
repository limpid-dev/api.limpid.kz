declare module '@ioc:Browser' {
  import type * as Puppeteer from 'puppeteer'
  const Browser: Puppeteer.Browser
  export default Browser
}
