import Vue       from 'vue'
import * as Vuex from 'vuex'
import Axios     from 'axios'
import Env       from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        getUsers({commit}, {self}){
            Axios.get(Env.ApiLaravel + '/get-users', {params: self.params}).then((r) =>{
                if(r.status === 200){
                    self.dataUsers = r.data
                    self.loading.table = false
                }
            }).catch((e) =>{
                console.error(e)
                self.loading.table = false
            })
        }
    }
})
