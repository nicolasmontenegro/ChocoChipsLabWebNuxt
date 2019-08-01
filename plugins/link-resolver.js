/**
 * To learn more about Link Resolving check out the Prismic documentation
 */

export default function (doc) {
  if (doc.isBroken) {
    return '/not-found'
  }

  if (doc.type === 'homepage') {
    return '/'
  }

  if (doc.type === 'blog_entry') {
    return '/blog/' + doc.uid
  }

  return '/not-found'
}
