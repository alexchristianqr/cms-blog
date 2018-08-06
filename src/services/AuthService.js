import Vue        from 'vue'
import * as Vuex  from 'vuex'
import Axios      from 'axios'
import Env        from './../env'
import Storage    from 'vue-local-storage'
import StoreToken from './../token'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        doLogin({commit}, {self}){
            Axios.post(Env.ApiLaravel + '/auth/login', self.params).then((r) =>{
                if(r.status === 200){
                    Storage.set('data-token', r.data.access_token)
                    Storage.set('data-auth', r.data.auth)
                    self.$router.replace({name: 'home'})
                    self.loading.button = false
                }
            }).catch((e) =>{
                self.loading.button = false
                self.params.password = ''
                self.$refs.inputPassword.focus()
                console.error(e)
            })
        },
        doLogout({commit}, {self}){
            Axios.post(Env.ApiLaravel + '/auth/logout').then((r) =>{
                if(r.status === 200){
                    Storage.remove('data-token')
                    Storage.remove('data-auth')
                    StoreToken.commit('logoutUser')
                    self.$router.replace({name: 'login'})
                }
            }).catch((e) =>{
                console.error(e)
            })
        },
    },
})
