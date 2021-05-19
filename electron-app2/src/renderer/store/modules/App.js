const state = {
  devtoolsOpen: true,
  devtoolsHeight: 300,
  scrollPosition: 0,
  url: '',
  isLoading: false,
  selectedLayoutTreeNode: null,
  showDebugLayers: true,
  compareOverlayOpacity: 0
}

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
  SET_DEVTOOLS_HEIGHT (state, height) {
    state.devtoolsHeight = height
  },
  SET_SCROLL_POSITION (state, scrollPosition) {
    state.scrollPosition = scrollPosition
  },
  SHOW_LOADING (state) {
    state.isLoading = true
  },
  HIDE_LOADING (state) {
    state.isLoading = false
  },
  SET_SELECTED_LAYOUT_TREE_NODE (state, node) {
    state.selectedLayoutTreeNode = node
  },
  SET_SHOW_DEBUG_LAYERS (state, value) {
    state.showDebugLayers = value
  },
  SET_COMPARE_OVERLAY_OPACITY (state, value) {
    state.compareOverlayOpacity = value
  }
}

const actions = {
  OPEN_DEVTOOLS (context) {
      context.commit('OPEN_DEVTOOLS')
  },
  CLOSE_DEVTOOLS (context) {
      context.commit('CLOSE_DEVTOOLS')
  },
  SET_URL (context, url) {
      context.commit('SET_URL', url)
  },
  SET_DEVTOOLS_HEIGHT (context, height) {
      context.commit('SET_DEVTOOLS_HEIGHT', height)
  },
  SET_SCROLL_POSITION (context, scrollPosition) {
      context.commit('SET_SCROLL_POSITION', scrollPosition)
  },
  SHOW_LOADING (context) {
      context.commit('SHOW_LOADING')
  },
  HIDE_LOADING (context) {
      context.commit('HIDE_LOADING')
  },
  SET_SELECTED_LAYOUT_TREE_NODE (context, node) {
      context.commit('SET_SELECTED_LAYOUT_TREE_NODE', node)
  },
  SET_SHOW_DEBUG_LAYERS (context, value) {
      context.commit('SET_SHOW_DEBUG_LAYERS', value)
  },
  SET_COMPARE_OVERLAY_OPACITY (context, value) {
      context.commit('SET_COMPARE_OVERLAY_OPACITY', value)
  },
}

export default {
  state,
  mutations,
  actions
}
