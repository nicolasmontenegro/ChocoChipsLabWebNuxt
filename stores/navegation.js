import { defineStore } from 'pinia'

export const useNavegationStore = defineStore('navegation', {
  state: () => ({
    section: {
      name: null,
      style: null
    },
    back: {
      url: null,
      name: null
    }
  }),
  actions: {
    setNavegation (statuses) {
      Object.assign(this, statuses)
    }
  }
})
