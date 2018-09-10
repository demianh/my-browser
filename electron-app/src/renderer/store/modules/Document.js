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

const actions = {
  setHTML ({commit}, value) {
    commit('SET_HTML', value)
  },
  setCSS ({commit}, value) {
    commit('SET_CSS', value)
  },
  setDOM ({commit}, value) {
    commit('SET_DOM', value)
  },
  setRenderTree ({commit}, value) {
    commit('SET_RENDERTREE', value)
  }
}

export default {
  state,
  mutations,
  actions
}
