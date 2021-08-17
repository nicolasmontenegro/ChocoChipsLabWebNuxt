import Vue from 'vue'

const openGraph = ({ twitter = true, title, description, image, article }) => {
  const listMeta = []

  // Twitter meta
  if (twitter) {
    listMeta.push(...[
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary'
      },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@NicoChocoChips'
      },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@NicoChocoChips'
      }
    ])
  }

  // Facebook's OpenGraph meta
  listMeta.push(...[
    {
      hid: 'og:title',
      property: 'og:title',
      content: title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: (article ? 'article' : 'website')
    }
  ])

  if (image) {
    const { imgURL, imgwidth, imgHeight, imgAlt } = image
    if (imgURL) {
      listMeta.push(...[
        {
          hid: 'og:image',
          property: 'og:image',
          content: imgURL
        },
        {
          hid: 'og:image:url',
          property: 'og:image:url',
          content: imgURL
        }
      ])
    }
    // if (imgType) {
    //   listMeta.push({
    //     hid: 'og:image:type',
    //     property: 'og:image:type',
    //     content: imgType
    //   })
    // }
    if (imgwidth) {
      listMeta.push({
        hid: 'og:image:width',
        property: 'og:image:width',
        content: imgwidth
      })
    }
    if (imgHeight) {
      listMeta.push({
        hid: 'og:image:height',
        property: 'og:image:height',
        content: imgHeight
      })
    }
    if (imgAlt) {
      listMeta.push({
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: imgAlt
      })
    }
  }

  if (article) {
    const { publishedTime, modifiedTime, expirationTime, author, section, tags } = article
    listMeta.push({
      hid: 'og:type',
      property: 'og:type',
      content: 'article'
    })
    if (publishedTime) {
      listMeta.push({
        hid: 'article:published_time',
        property: 'article:published_time',
        content: publishedTime
      })
    }
    if (modifiedTime) {
      listMeta.push({
        hid: 'article:modified_time',
        property: 'article:modified_time',
        content: modifiedTime
      })
    }
    if (expirationTime) {
      listMeta.push({
        hid: 'article:expiration_time',
        property: 'article:expiration_time',
        content: expirationTime
      })
    }
    if (author) {
      listMeta.push({
        hid: 'article:author',
        property: 'article:author',
        content: author
      })
    }
    if (section) {
      listMeta.push({
        hid: 'article:section',
        property: 'article:section',
        content: section
      })
    }
    if (tags) {
      listMeta.push(...tags.map(tag => ({
        hid: 'article:tag',
        property: 'article:tag',
        content: tag
      })))
    }
  }

  return listMeta
}

export default (context, inject) => {
  Vue.prototype.$openGraph = openGraph
}
