/**
 * How Prismic rich text is rendered by <PrismicRichText> (registered in nuxt.config.js).
 * Each entry is a shorthand: its attributes are added to the element Prismic renders by default.
 * Everything not listed here uses Prismic's defaults: links (internal ones as <NuxtLink>, through
 * linkResolver), images in a <p class="block-img">, embeds, labels and line breaks.
 * https://prismic.io/docs/fields/rich-text
 */
export default {
  heading1: { class: 'title is-1 m-0' },
  heading2: { class: 'title is-2 m-0' },
  heading3: { class: 'title is-3 m-0' },
  heading4: { class: 'title is-4 m-0' },
  heading5: { class: 'title is-5 m-0' },
  heading6: { class: 'title is-6 m-0' },
}
