import Vue       from 'vue'
import * as Vuex from 'vuex'
import Axios     from 'axios'
import Env       from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        getPortfolios({commit}, {self}){
            Axios.get(Env.ApiLaravel + '/get-portfolios', {params: self.params}).then((r) =>{
                if(r.status === 200){
                    self.dataPortfolios = r.data
                    self.loading.table = false
                }
            }).catch((e) =>{
                console.error(e)
                self.dataErrors = e.response.data.errors
                self.loading.table = false
            })
        },
        createPost({commit}, {self}){
            Axios.post(Env.ApiLaravel + '/create-post', self.params).then((r) =>{
                if(r.status === 201){
                    self.$router.push({name: 'posts'})
                    self.loading = false
                }
            }).catch((e) =>{
                console.error(e)
                self.dataErrors = e.response.data
                self.loading = false
            })
        },
        updatePost({commit}, {self}){
            Axios.put(Env.ApiLaravel + '/update-post/' + self.params.id, self.params).then((r) =>{
                if(r.status === 200){
                    self.$router.push({name: 'posts'})
                    self.loading = false
                }
            }).catch((e) =>{
                console.error(e)
                self.dataErrors = e.response.data
                self.loading = false
            })
        },
    },
})