import Vue from 'vue'
import * as Vuex from 'vuex'
import Axios from 'axios'
import Env from './../env'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    getPaths ({commit}, {self}) {
      if (self.$route.name != 'post-update') {
        self.subParams = self.params
      } else {
        self.subParams = {}
      }
      Axios.get(Env.ApiLaravel + '/get-paths', {params: self.subParams}).
        then((r) => {
          if (r.status === 200) {
            self.dataPaths = r.data
            self.selectedPath = self.filterPath(self.params.path_id)//Filtramos el path que tiene el post en base de datos
          }
        }).
        catch((e) => {
          console.error(e)
        })
    },
  },
})
