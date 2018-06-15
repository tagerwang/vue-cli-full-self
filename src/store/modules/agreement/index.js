import { $utils } from '@helper'
import types from './types'

const {getter, mutation} = $utils.importStoreTypes(types).agreement

/**
 * initial state
 * @user [object]
 *
 */
const state = {
  detail: null
}

/**
 * getters
 */
const getters = {
  [getter.detail]: state => state.detail
}

/**
 * actions
 */
const actions = {}

/**
 * mutations
 */
const mutations = {
  [mutation.clear] (state) {
    state.detail = null
  },
  [mutation.update] (state, data) {
    state.detail = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
