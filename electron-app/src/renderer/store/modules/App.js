const state = {
  devtoolsOpen: true,
  url: ''
}

const mutations = {
  OPEN_DEVTOOLS (state) {
    state.devtoolsOpen = true;
  },
  CLOSE_DEVTOOLS (state) {
    state.devtoolsOpen = false;
  },
  SET_URL (state, url) {
    state.url = url;
  }
}

const actions = {
  openDevtools ({ commit }) {
    commit('OPEN_DEVTOOLS')
  },
  closeDevtools ({ commit }) {
    commit('CLOSE_DEVTOOLS')
  },
  setUrl ({ commit }, url) {
    commit('SET_URL', url)
  }
}

export default {
  state,
  mutations,
  actions
}
