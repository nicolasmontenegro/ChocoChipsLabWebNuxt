export const useOpenGraph = ({ twitter = true, title, description, image, article } = {}) => {
  const listMeta = []

  // Twitter meta
  if (twitter) {
    listMeta.push(...[
      {
        key: 'twitter:card',
        name: 'twitter:card',
        content: 'summary',
      },
      {
        key: 'twitter:creator',
        name: 'twitter:creator',
        content: '@NicoChocoChips',
      },
    ])
  }

  // Facebook's OpenGraph meta
  listMeta.push(...[
    {
      key: 'og:title',
      property: 'og:title',
      content: title,
    },
    {
      key: 'og:description',
      property: 'og:description',
      content: description,
    },
    {
      key: 'og:type',
      property: 'og:type',
      content: (article ? 'article' : 'website'),
    },
  ])

  if (image) {
    const { imgURL, imgwidth, imgHeight, imgAlt } = image
    if (imgURL) {
      listMeta.push(...[
        {
          key: 'og:image',
          property: 'og:image',
          content: imgURL,
        },
        {
          key: 'og:image:url',
          property: 'og:image:url',
          content: imgURL,
        },
      ])
    }
    if (imgwidth) {
      listMeta.push({
        key: 'og:image:width',
        property: 'og:image:width',
        content: imgwidth,
      })
    }
    if (imgHeight) {
      listMeta.push({
        key: 'og:image:height',
        property: 'og:image:height',
        content: imgHeight,
      })
    }
    if (imgAlt) {
      listMeta.push({
        key: 'og:image:alt',
        property: 'og:image:alt',
        content: imgAlt,
      })
    }
  }

  if (article) {
    const { publishedTime, modifiedTime, expirationTime, author, section, tags } = article
    listMeta.push({
      key: 'og:type',
      property: 'og:type',
      content: 'article',
    })
    if (publishedTime) {
      listMeta.push({
        key: 'article:published_time',
        property: 'article:published_time',
        content: publishedTime,
      })
    }
    if (modifiedTime) {
      listMeta.push({
        key: 'article:modified_time',
        property: 'article:modified_time',
        content: modifiedTime,
      })
    }
    if (expirationTime) {
      listMeta.push({
        key: 'article:expiration_time',
        property: 'article:expiration_time',
        content: expirationTime,
      })
    }
    if (author) {
      listMeta.push({
        key: 'article:author',
        property: 'article:author',
        content: author,
      })
    }
    if (section) {
      listMeta.push({
        key: 'article:section',
        property: 'article:section',
        content: section,
      })
    }
    if (tags) {
      listMeta.push(...tags.map(tag => ({
        key: 'article:tag',
        property: 'article:tag',
        content: tag,
      })))
    }
  }

  return listMeta
}
