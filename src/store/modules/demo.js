// import { queryUsers } from '@/common/fetch.js'
// import { queryUsers } from '@/api/common.js'

// initial state
const state = {
  users: []
}

// getters
const getters = {
  users: state => {
    return state.users
  }
}

// actions
const actions = {
  // QueryUsers({ commit }) {
  //     return new Promise((resolve, reject) => {
  //         queryUsers()
  //             .then(resp => {
  //                 commit('SET_USERS', resp)
  //                 resolve()
  //             })
  //             .catch(error => {
  //                 reject(error)
  //             })
  //     })
  // },
  // SetUsers({ commit }, users) {
  //     commit('SET_USERS', users)
  // },
}

// mutations
const mutations = {
  // SET_USERS: (state, users) => {
  //     state.users = users
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
