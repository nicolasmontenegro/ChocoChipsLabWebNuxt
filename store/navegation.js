export const state = () => ({
  section: {
    name: null,
    style: null
  },
  back: {
    url: null,
    name: null
  }
})

export const mutations = {
  setNavegation (state, statuses) {
    Object.assign(state, statuses)
  }
}
