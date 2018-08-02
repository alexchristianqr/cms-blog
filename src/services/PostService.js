import Vue         from 'vue'
import * as Vuex   from 'vuex'
import Axios       from 'axios'
import Env         from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        getPosts({commit}, {self}){
            Axios.get(Env.ApiLaravel + '/get-posts', {params: self.params}).then((r) =>{
                if(r.status === 200){
                    self.loadingTable = false
                    self.dataPosts = r.data
                }
            }).catch((e) =>{
                self.loadingTable = false
                self.dataErrors = e.response.data.errors
                console.error(e)
            })
        },
        createPost({commit}, {self}){
            Axios.post(Env.ApiLaravel + '/create-post', self.params).then((r) =>{
                if(r.status === 201){
                    self.preLoading = false
                    self.$router.push({name: 'posts'})
                }
            }).catch((e) =>{
                self.preLoading = false
                self.dataErrors = e.response.data
                console.error(e)
            })
        },
        updatePost({commit}, {self}){
            Axios.put(Env.ApiLaravel + '/update-post/' + self.params.id, self.params).then((r) =>{
                if(r.status === 200){
                    self.preLoading = false
                    self.$router.push({name: 'posts'})
                }
            }).catch((e) =>{
                self.preLoading = false
                self.dataErrors = e.response.data
                console.error(e)
            })
        },
    },
})