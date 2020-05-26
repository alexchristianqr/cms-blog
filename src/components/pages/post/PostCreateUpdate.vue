<template>
  <div class="card border-secondary">
    <form @submit.prevent="createOrUpdate">
      <div class="card-header border-secondary bg-light">
        <div class="row">
          <div class="col-6 my-auto">
            <div class="card-title my-auto h5 text-secondary">
              <template v-if="isPost">
                <span>Create Post</span>
              </template>
              <template v-else>
                <span>Update Post</span>
              </template>
            </div>
          </div>
          <div class="col-6 text-right">
            <button type="button" @click="$router.replace({name:'posts'})" class="btn btn-secondary"><i class="fa fa-angle-left fa-fw"></i>Back</button>
            <button type="submit" class="btn btn-primary">
              <template v-if="isPost">
                <i class="fa fa-check fa-fw"></i>Create Post
              </template>
              <template v-else>
                <i class="fa fa-edit fa-fw"></i>Update Post
              </template>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body" :style="loading.post ? 'opacity:0.5; z-index:123456 !important;' : ''">
        <pre-loading v-show="loading.post"/>
        <errors-laravel v-show="Object.keys(dataErrors).length > 0" :data-errors="dataErrors" @eventClose="dataErrors = {}"/>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label>Date published</label>
              <input type="date" :value="myDate && myDate.toISOString().split('T')[0]" @input="myDate = $event.target.valueAsDate" class="form-control"/>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label>Status Post</label>
              <select class="form-control" v-model="params.status" :disabled="isPost">
                <option value="A">ACTIVO</option>
                <option value="I">INACTIVO</option>
                <option value="P">PENDIENTE</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Imagen Post</label>
          <div class="thumbnail text-center">
            <template v-if="loading.image !== null">
              <!--upload-->
              <img ref="html5_img" :src="loading.image" class="img-thumbnail" width="40%"/>
            </template>
            <template v-else>
              <!--create-->
              <template v-if="isPost">
                <!--<img ref="html5_img" src="http://dev-acqrdeveloper.com/images/post/post.default.jpg" class="img-thumbnail" width="40%"/>-->
                <div class="img-thumbnail">
                  <i class="fa fa-newspaper-o fa-5x"></i>
                </div>
              </template>
              <!--edit-->
              <template v-else>
                <img ref="html5_img" :src="asset(params.path + params.image)" alt="image" class="_F7Vk" style="height: 100%; width: 100%; visibility: visible;"/>
              </template>
            </template>
          </div>
          <div class="text-center mt-2">
            <div class="custom-file">
              <input id="html5_file" ref="file" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" @change="onFileChange" class="custom-file-input"/>
              <label class="custom-file-label" for="html5_file">{{input.file}}</label>
            </div>
          </div>

        </div>
        <div class="form-group">
          <label>Name</label>
          <textarea @input="keyupKind" v-model="params.name" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="params.description" cols="30" rows="auto" class="form-control"></textarea>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label>Kind</label>
              <input v-model="params.kind" type="text" class="form-control" readonly>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label>Author</label>
              <input v-model="params.user_name" type="text" class="form-control" placeholder="Author">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Tag Group Post</label>
          <vue-select multiple v-model="selectedTag" :options="dataTags" label="name" track-by="id"
                      @input="changeTag"></vue-select>
        </div>
        <div class="form-group">
          <label>Path Image Post</label>
          <vue-select single v-model="selectedPath" :options="dataPaths" label="name" track-by="id"
                      @input="changePath"></vue-select>
        </div>
        <div class="form-group">
          <label>Content</label>
          <editor id="d1" v-model="params.content"></editor>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import Storage from 'vue-local-storage'
  import Util from '../../../util'
  import Editor from '../../../plugins/TemplateTinymce'
  import PostService from '../../../services/PostService'
  import ErrorsLaravel from '../../layouts/ErrorsLaravel'
  import PreLoading from '../../layouts/PreLoading'
  import VueSelect from 'vue-select'
  import TagService from '../../../services/TagService'
  import PathService from '../../../services/PathService'
  import Moment from 'moment'

  export default {
    name: 'CreateUpdatePost',
    components: {PreLoading, ErrorsLaravel, Editor, VueSelect},
    data: () => ({
      myDate: new Date(),
      dataTags: [],
      dataPaths: [],
      configEditor: Util.editor,
      isPost: true,
      dataErrors: {},
      loading: {
        post: false,
        image: null,
      },
      input: {
        file: 'Seleccionar archivo imagen',
      },
      params: {
        status: 'P',
        file_image: null,
      },
      readonlyDescription: false,
      image: null,
      selectedTag: null,
      selectedPath: null,
      tags: [],
    }),
    created(){
      this.load()
    },
    methods: {
      load(){
        this.validateIsPostOrPut()
        if(this.isPost){
          // this.params = {}
        }
        else{
          if(this.$route.params.dataPost != undefined){
            Storage.set('data-post-temp', this.$route.params.dataPost)
            this.params = this.$route.params.dataPost
          }
          else{
            this.params = Storage.get('data-post-temp')
          }
          this.myDate = Moment(this.params.published)
        }
        this.getTags()
        this.getPaths()
      },
      createOrUpdate(){
        this.loading.post = true
        if(this.isPost){//Crear
          PostService.dispatch('createPost', {self: this})
        }else{//Actualizar
          this.params.published = Moment(this.myDate).format("Y-MM-DD HH:mm:ss")
          PostService.dispatch('updatePost', {self: this})
        }
      },
      validateIsPostOrPut(){
        this.isPost = this.$route.name === 'post-create'
      },
      keyupKind(){
        let newKind = ''
        this.params.name.toLowerCase().trim().split(' ').forEach((v, k) => {//Devolvemos un array del vue-model con split() y lo recorremos
          if(k > 0){
            newKind += v.replace('', '-')
          }else{
            newKind = v
          }
        })
        this.params.kind = newKind
      },
      onFileChange(e){
        this.loading.image = null
        this.params.file_image = null
        let files = e.target.files || e.dataTransfer.files
        if(!files.length){
          this.input.file = 'Seleccionar archivo imagen'
        }else{
          this.params.file_image = files[0]
          this.input.file = files[0].name
          this.createImage(files[0])
        }
      },
      createImage(file){
        let reader = new FileReader()
        reader.onload = (e) => {
          this.loading.image = e.target.result
        }
        reader.readAsDataURL(file)
      },
      getTags(){
        TagService.dispatch('getTags', {self: this})
      },
      getPaths(){
        PathService.dispatch('getPaths', {self: this})
      },
      changePath(){
        this.params.path_id = this.selectedPath.id
      },
      changeTag(){
        if(this.selectedTag.length > 0){
          this.tags = []
          this.selectedTag.forEach((v, k) => {
            this.tags.push(v.id)
          })
          this.params.tag_id = JSON.stringify(this.tags)
        }
      },
      filterTag(id){
        let tags = [], selecteds = []
        if(id != null){
          tags = JSON.parse(id)
          if(tags.length > 0){
            tags.forEach((v, k) => {
              this.dataTags.forEach((vv, kk) => {
                if(vv.id == v){
                  selecteds.push(vv)
                }
              })
            })
          }
        }
        return selecteds
      },
      filterPath(id){
        return this.dataPaths.filter((obj) => {
          return (obj.id == id) ? obj : false
        })[0]
      },
    },
  }
</script>
<style scoped>

</style>
