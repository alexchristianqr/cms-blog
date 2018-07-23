import Vue   from 'vue'
import Vuex  from 'vuex'
// import * as Vuex from 'vuex'
import Axios from 'axios'
import Env   from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    getPosts ({commit}, {self}) {
      Axios.get(Env.ApiLaravel + '/get-posts',{params:self.params}).then((r) => {
        if (r.status === 200) {
          self.loadingTable = false
          self.dataPosts = r.data
        }
      }).catch((e) => {
        self.loadingTable = false
        console.error(e)
      })
    },
    createPost ({commit}, {self}) {
      Axios.post(Env.ApiLaravel + '/create-post',self.params).then((r) => {
        if (r.status === 201) {
          console.log(r.statusText)
        }
      }).catch((e) => {
        self.dataErrors = e.response.data.errors
        console.log(self.dataErrors)
        console.error(e)
      })
    },
    updatePost ({commit}, {self}) {
      Axios.put(Env.ApiLaravel + '/update-post',self.params).then((r) => {
        if (r.status === 200) {
          console.log(r.statusText)
        }
      }).catch((e) => {
        console.error(e)
      })
    },
  },
})