import postscribe from 'postscribe'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      postscribe
    }
  }
})
