import Vue from 'vue'
import $ from 'jquery'

Vue.mixin({
  created(){
    $('[data-toggle="tooltip"]').tooltip()
  },
  methods: {
    /**
     * Path absolute to app API's REST
     * @param image
     * @returns {string}
     */
    asset(image){
      return `http://dev-acqrdeveloper.com/${image}`
    }
  }
})
