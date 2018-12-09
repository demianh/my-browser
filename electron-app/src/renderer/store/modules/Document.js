const state = {
  html: null,
  css: null,
  dom: null,
  renderTree: null
}

const mutations = {
  SET_HTML (state, value) {
    state.html = value
  },
  SET_CSS (state, value) {
    state.css = value
  },
  SET_DOM (state, value) {
    state.dom = value
  },
  SET_RENDERTREE (state, value) {
    state.renderTree = value
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
