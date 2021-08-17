import Vue from 'vue'

export default (context, inject) => {
  const entryData = (entry) => {
    if (entry.id) {
      return context.$prismic.api.getByUID(
        entry.type,
        entry.uid,
        { lang: context.app.i18n.locales.find(e => e.code === context.app.i18n.locale).iso })
    } else {
      return null
    }
  }

  Vue.prototype.$entryData = context.$entryData = entryData
}
