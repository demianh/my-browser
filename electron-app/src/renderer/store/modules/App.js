const state = {
  devtoolsOpen: true,
  devtoolsHeight: 300,
  scrollPosition: 0,
  url: '',
  isLoading: false,
  selectedRenderTreeNode: null,
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
  SET_SELECTED_RENDER_TREE_NODE (state, node) {
    state.selectedRenderTreeNode = node
  },
  SET_SHOW_DEBUG_LAYERS (state, value) {
    state.showDebugLayers = value
  },
  SET_COMPARE_OVERLAY_OPACITY (state, value) {
    state.compareOverlayOpacity = value
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
