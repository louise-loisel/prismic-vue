try {
  console.warn(
    "\x1b[31m",
    "\n[prismic-vue]\n\nThis git version of `prismic-vue/tree/nuxt` is deprecated:\n\n- prismic-vue@git+https://github.com/prismicio/prismic-vue.git#nuxt\n\nIt hasn't been maintained over a two year period and it won't be. To \nmove forward this git version will be removed from our repository in\nthe near future! Its purpose back then was to be used as a workaround\nwhile waiting for a first-class Nuxt integration. Please upgrade to\nthe NPM version of `prismic-vue`.\n\nWe have since released a first class integration for Nuxt! Here's the\nmigration article:\n\n- https://prismic.io/docs/technologies/migrating-to-the-nuxtjs-prismic-module-vuejs\n\nCheck out `@nuxtjs/prismic` on:\n\n- NPM: https://npmjs.com/package/@nuxtjs/prismic\n- GitHub: https://github.com/nuxt-community/prismic-module\n- Documentation: https://prismic.nuxtjs.org\n\nIf you encounter any problem migrating please reach out to us on our\ncommunity forum:\n\n- https://community.prismic.io/c/kits-and-dev-languages/nuxt-js/26\n\n"
  );
} catch (error) {
  // Fail silently
}
