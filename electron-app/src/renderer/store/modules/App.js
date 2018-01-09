const state = {
    devtoolsOpen: true,
    url: '',
    selectedRenderTreeNode: null
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
  }
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
  }
};

export default {
  state,
  mutations,
  actions
}
