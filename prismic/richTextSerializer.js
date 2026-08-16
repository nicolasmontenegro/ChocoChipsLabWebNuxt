/**
 * To learn more about the HTML serializer check out the Prismic documentation
 * https://prismic.io/docs/fields/rich-text
 */

import { asLink } from '@prismicio/client'
import linkResolver from './linkResolver'

export default function (type, node, text, children, _key) {
  // Generate links to Prismic Documents as <nuxt-link> components
  if (type === 'hyperlink') {
    if (node.data.link_type === 'Document') {
      return `<nuxt-link to="${asLink(node.data, { linkResolver })}">${children}</nuxt-link>`
    }
    else {
      const target = node.data.target ? `target="${node.data.target}" rel="noopener"` : ''
      return `<a href="${node.data.url}" ${target}>${children}</a>`
    }
  }

  // If the image is also a link to a Prismic Document, it will return a <nuxt-link> component
  if (type === 'image') {
    let result = `<img src="${node.url}" alt="${node.alt || ''}" copyright="${node.copyright || ''}">`

    if (node.linkTo) {
      if (node.linkTo.link_type === 'Document') {
        result = `<nuxt-link to="${asLink(node.linkTo, { linkResolver })}">${result}</nuxt-link>`
      }
      else {
        const target = node.linkTo.target ? `target="${node.linkTo.target}" rel="noopener"` : ''
        result = `<a href="${node.linkTo.url}" ${target}>${result}</a>`
      }
    }
    const wrapperClassList = [node.label || '', 'block-img']
    return `<p class="${wrapperClassList.join(' ')}">${result}</p>`
  }

  switch (type) {
    case 'heading1':
      return `<h1 class='title is-1 m-0'>${children}</h1>`

    case 'heading2':
      return `<h2 class='title is-2 m-0'>${children}</h2>`

    case 'heading3':
      return `<h3 class='title is-3 m-0'>${children}</h3>`

    case 'heading4':
      return `<h4 class='title is-4 m-0'>${children}</h4>`

    case 'heading5':
      return `<h5 class='title is-5 m-0'>${children}</h5>`

    case 'heading6':
      return `<h6 class='title is-6 m-0'>${children}</h6>`

    case 'paragraph':
      return `<p>${children}</p>`

    case 'preformatted':
      return `<pre>${children}</pre>`

    case 'strong':
      return `<strong>${children}</strong>`

    case 'em':
      return `<em>${children}</em>`

    case 'listItem':
      return `<li>${children}</li>`

    case 'oListItem':
      return `<li>${children}</li>`

    case 'list':
      return `<ul>${children}</ul>`

    case 'oList':
      return `<ol>${children}</ol>`

    case 'embed':
      return (`
        <div data-oembed="${node.oembed.embed_url}"
          data-oembed-type="${node.oembed.type}"
          data-oembed-provider="${node.oembed.provider_name}"
        >
          ${node.oembed.html}
        </div>
      `)

    case 'label':
      return `<span ${node.data.label ? ` class="${node.data.label}"` : ''}>${children}</span>`

    case 'span':
      return text ? text.replace(/\n/g, '<br />') : ''

    default:
      return null
  }
}
