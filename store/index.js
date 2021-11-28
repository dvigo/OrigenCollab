export const getters = {
    isAuthenticated (state) {
      return state.auth.loggedIn
    },
    loggedInUser (state) {
      return state.auth.user
    },
    getCurrentCart(state) {
        return state.auth.user.current_cart
    }
  }

export const mutations = {
  changeCurrentCart(state, cart) {
      state.auth.user.current_cart = cart
  }
}
