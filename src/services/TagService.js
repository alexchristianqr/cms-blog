import Vue       from 'vue'
import * as Vuex from 'vuex'
import Axios     from 'axios'
import Env       from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        getTags({commit}, {self}){
            if(self.$route.name != 'post-update'){
                self.subParams = self.params
            }else{
                self.subParams = {}
            }
            Axios.get(Env.ApiLaravel + '/get-tags', {params: self.subParams}).then((r) =>{
                if(r.status === 200){
                    self.dataTags = r.data
                    self.selectedTag = self.filterTag(self.params.tag_id)//Filtramos los tags que tiene el post en base de datos
                }
            }).catch((e) =>{
                console.error(e)
            })
        }
    }
})
