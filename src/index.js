import prismicJS from 'prismic-javascript'
import prismicDOM from 'prismic-dom'

import EditButton from './components/EditButton.vue'
import Embed from './components/Embed.vue'
import Image from './components/Image.vue'
import Link from './components/Link.vue'
import RichText from './components/RichText.vue'

try {
  console.warn(
    '[prismic-vue] This git version of `prismic-vue/tree/nuxt` is deprecated and will be removed. For more information please check installation warning or https://github.com/prismicio/prismic-vue/tree/nuxt#readme'
  );
} catch (error) {
  // Fail silently
}

const PrismicVue = {
  install: function (Vue, options = {}) {
    Vue.prototype.$prismic = prismicJS
    Vue.prototype.$prismic.endpoint = options.endpoint
    Vue.prototype.$prismic.linkResolver = options.linkResolver
    Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
    Vue.prototype.$prismic.client = prismicJS.client(options.endpoint, options.apiOptions)
    Vue.prototype.$prismic.richTextAsPlain = function (field) {
      if (!field) {
        return ''
      }
      return prismicDOM.RichText.asText(field)
    }

    Vue.component('PrismicEditButton', EditButton)
    Vue.component('PrismicEmbed', Embed)
    Vue.component('PrismicImage', Image)
    Vue.component('PrismicLink', Link)
    Vue.component('PrismicRichText', RichText)
  }
}

export default PrismicVue
