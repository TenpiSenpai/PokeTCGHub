import { defineFontProvider } from 'unifont'

const resolvableFonts = new Set<string>()
export default defineFontProvider('custom', () => {
  // Do some stuff
  resolvableFonts.add('ptcg')
  return {
    async resolveFont(fontFamily) {
      if (!resolvableFonts.has(fontFamily)) {
        return
      }
      console.log('test2')
      return {
        fonts: [
          { src: [{ url: '/ptcg-font-19.ttf', format: 'ttf' }] },
        ],
      }
    },
  }
})
