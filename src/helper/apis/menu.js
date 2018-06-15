import $ajax from '../ajax'

export default {
  getMenu () {
    return $ajax({ method: 'get', url: '/common/test1' })
  },
  getAccount () {
    return $ajax({ method: 'get', url: '/common/test2' })
  }
}
