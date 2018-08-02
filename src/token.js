import Vue       from 'vue'
import * as Vuex from 'vuex'
import Storage from  'vue-local-storage'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: !Storage.get('data-token')
    },
    mutations: {
        loginUser (state) {
            state.isLoggedIn = true
        },
        logoutUser (state) {
            state.isLoggedIn = false
        },
    }
})