const state = {
    devtoolsOpen: true,
    url: '',
    selectedRenderTreeNode: null,
    showDebugLayers: true,
    compareOverlayOpacity: 0
};

const mutations = {
  OPEN_DEVTOOLS (state) {
    state.devtoolsOpen = true
  },
  CLOSE_DEVTOOLS (state) {
    state.devtoolsOpen = false
  },
  SET_URL (state, url) {
    state.url = url
  },
  SET_SELECTED_RENDER_TREE_NODE (state, node) {
    state.selectedRenderTreeNode = node
  },
  SET_SHOW_DEBUG_LAYERS (state, value) {
    state.showDebugLayers = value
  },
  SET_COMPARE_OVERLAY_OPACITY (state, value) {
    state.compareOverlayOpacity = value
  },
};

const actions = {
  openDevtools ({ commit }) {
    commit('OPEN_DEVTOOLS')
  },
  closeDevtools ({ commit }) {
    commit('CLOSE_DEVTOOLS')
  },
  setUrl ({ commit }, url) {
    commit('SET_URL', url)
  },
  setSelectedRenderTreeNode ({ commit }, node) {
    commit('SET_SELECTED_RENDER_TREE_NODE', node)
  },
  setShowDebugLayers ({ commit }, value) {
    commit('SET_SHOW_DEBUG_LAYERS', value)
  },
  setCompareOverlayOpacity ({ commit }, value) {
    commit('SET_COMPARE_OVERLAY_OPACITY', value)
  }
};

export default {
  state,
  mutations,
  actions
}
