import Vue from 'vue'
import * as Vuex from 'vuex'
import Axios from 'axios'
import Env from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    getPosts ({commit}, {self}) {
      Axios.get(Env.ApiLaravel + '/get-posts', {params: self.params}).
        then((r) => {
          if (r.status === 200) {
            self.dataPosts = r.data
            self.params.page = r.data.current_page
            self.loading.table = false
          }
        }).
        catch((e) => {
          console.error(e)
          self.dataErrors = e.response.data.errors
          self.loading.table = false
        })
    },
    createPost ({commit}, {self}) {
      Axios.post(Env.ApiLaravel + '/create-post', self.params).then((r) => {
        if (r.status === 201) {
          self.$router.push({name: 'posts'})
          self.loading = false
        }
      }).catch((e) => {
        console.error(e)
        self.dataErrors = e.response.data
        self.loading = false
      })
    },
    updatePost ({commit}, {self}) {
      let formData = new FormData()
      if(self.params.file_image != undefined) formData.append("file_image", self.params.file_image)
      formData.append("content", self.params.content)
      formData.append("description", self.params.description)
      formData.append("kind", self.params.kind)
      formData.append("name", self.params.name)
      formData.append("path", self.params.path)
      formData.append("published", self.params.published)
      formData.append("status", self.params.status)
      formData.append("tag_id", self.params.tag_id)
      formData.append("user_id", self.params.user_id)
      
      const URL = `${Env.ApiLaravel}/update-post/${self.params.id}`
      Axios.post(URL, formData).then((r) => {
          if (r.status === 200) {
            self.$router.replace({name: 'posts'})
            self.loading = false
          }
        }).catch((e) => {
          console.error(e)
          self.dataErrors = e.response.data
          self.loading = false
        })
    },
  },
})
