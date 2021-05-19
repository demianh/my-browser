const state = {
  html: null,
  css: null,
  dom: null,
  renderTree: null,
  layoutTree: null
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
  },
  SET_LAYOUTTREE (state, value) {
    state.layoutTree = value
  }
}

const actions = {
  SET_HTML (context, value) {
    context.commit('SET_HTML', value)
  },
  SET_CSS (context, value) {
    context.commit('SET_CSS', value)
  },
  SET_DOM (context, value) {
    context.commit('SET_DOM', value)
  },
  SET_RENDERTREE (context, value) {
    context.commit('SET_RENDERTREE', value)
  },
  SET_LAYOUTTREE (context, value) {
    context.commit('SET_LAYOUTTREE', value)
  },
}

export default {
  state,
  mutations,
  actions
}
