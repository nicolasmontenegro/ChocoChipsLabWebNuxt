import Vue from 'vue'

const openGraph = ({ title, description, image, imageAlt, article }) => {
  const listMeta = [
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: image
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: imageAlt
    },
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
      hid: 'og:image',
      property: 'og:image',
      content: image
    },
    {
      hid: 'og:image:alt',
      property: 'og:image:alt',
      content: imageAlt
    },
    {
      hid: 'og:image:secure_url',
      property: 'og:image:secure_url',
      content: image
    }
  ]

  if (article) {
    const { publishedTime, modifiedTime, expirationTime, author, section, tag } = article
    if (publishedTime) {
      listMeta.concat({
        hid: 'og:published_time',
        property: 'og:published_time',
        content: publishedTime
      })
    }
    if (modifiedTime) {
      listMeta.concat({
        hid: 'og:modified_time',
        property: 'og:modified_time',
        content: modifiedTime
      })
    }
    if (expirationTime) {
      listMeta.concat({
        hid: 'og:expiration_time',
        property: 'og:expiration_time',
        content: expirationTime
      })
    }
    if (author) {
      listMeta.concat({
        hid: 'og:author',
        property: 'og:author',
        content: author
      })
    }
    if (section) {
      listMeta.concat({
        hid: 'og:section',
        property: 'og:section',
        content: section
      })
    }
    if (tag) {
      listMeta.concat({
        hid: 'og:tag',
        property: 'og:tag',
        content: tag
      })
    }
    listMeta.concat({
      hid: 'og:image:secure_url',
      property: 'og:image:secure_url',
      content: image
    })
  }
  return listMeta
}

export default (context, inject) => {
  Vue.prototype.$openGraph = openGraph
}
