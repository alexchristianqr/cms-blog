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
                        <router-link :to="{name:'posts'}" class="btn btn-link text-muted"><i class="fa fa-angle-left fa-fw"></i>Volver</router-link>
                        <template v-if="isPost">
                            <button class="btn btn-outline-primary">Create</button>
                        </template>
                        <template v-else>
                            <button class="btn btn-outline-primary">Update</button>
                        </template>
                        <button class="btn btn-outline-danger">Cancel</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <errors-laravel v-show="Object.keys(dataErrors).length > 0" :data-errors="dataErrors"  @eventClose="dataErrors = {}"/>
                <div class="form-group">
                    <label>Name or Title</label>
                    <input v-model="dataPost.title" type="text" class="form-control" placeholder="Name or Title">
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label>Kind</label>
                            <input v-model="dataPost.kind" type="text" class="form-control" placeholder="Kind">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label>Author</label>
                            <input v-model="dataPost.user_name" type="text" class="form-control" placeholder="Author">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <editor v-model="dataPost.content" :init="configEditor"></editor>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
  import Storage       from 'vue-local-storage'
  import Editor        from '@tinymce/tinymce-vue'
  import PostService   from '../../../services/PostService'
  import ErrorsLaravel from '../../layouts/ErrorsLaravel'

  export default {
    name: 'CreateUpdatePost',
    components: {ErrorsLaravel, Editor},
    data: () => ({
      dataPost: {},
      params: {},
      configEditor: {
        /* replace textarea having class .tinymce with tinymce editor */
        // selector: 'textarea#editor',
        /* theme of the editor */
        theme: 'modern',
        skin: 'lightgray',
        /* width and height of the editor */
        // width: '100%',
        height:'500px',
        // height: 'auto',
        /* display statusbar */
        statubar: true,
        /* plugin */
        plugins: [
          'visualblocks paste',
        ],
        /* toolbar */
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor',
        /* style */
        style_formats: [
          {
            title: 'Headers', items: [
              {title: 'Header 1', format: 'h1'},
              {title: 'Header 2', format: 'h2'},
              {title: 'Header 3', format: 'h3'},
              {title: 'Header 4', format: 'h4'},
              {title: 'Header 5', format: 'h5'},
              {title: 'Header 6', format: 'h6'},
            ],
          },
          {
            title: 'Inline', items: [
              {title: 'Bold', icon: 'bold', format: 'bold'},
              {title: 'Italic', icon: 'italic', format: 'italic'},
              {title: 'Underline', icon: 'underline', format: 'underline'},
              {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
              {title: 'Superscript', icon: 'superscript', format: 'superscript'},
              {title: 'Subscript', icon: 'subscript', format: 'subscript'},
              {title: 'Code', icon: 'code', format: 'code'},
            ],
          },
          {
            title: 'Blocks', items: [
              {title: 'Paragraph', format: 'p'},
              {title: 'Blockquote', format: 'blockquote'},
              {title: 'Div', format: 'div'},
              {title: 'Pre', format: 'pre'},
            ],
          },
          {
            title: 'Alignment', items: [
              {title: 'Left', icon: 'alignleft', format: 'alignleft'},
              {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
              {title: 'Right', icon: 'alignright', format: 'alignright'},
              {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'},
            ],
          },
        ],
      },
      isPost: true,
      dataErrors:{}
    }),
    created () {
      this.validateIsPostOrPut()
      this.loadAndReload()
    },
    methods: {
      loadAndReload () {
        if (this.isPost) {
          this.dataPost = {}
        } else {
          if (this.$route.params.dataPost != undefined) {
            Storage.set('data-temp-post', this.$route.params.dataPost)
            this.dataPost = this.$route.params.dataPost
          } else {
            this.dataPost = Storage.get('data-temp-post')
          }
        }
      },
      createOrUpdate () {
        this.params = this.dataPost
        if (this.isPost) {//Crear
          PostService.dispatch('createPost', {self: this})
        } else {//Actualizar
          PostService.dispatch('updatePost', {self: this})
        }
      },
      validateIsPostOrPut () {
        return this.isPost = this.$route.name === 'post-create'
      },
    },
  }
</script>

<style scoped>

</style>