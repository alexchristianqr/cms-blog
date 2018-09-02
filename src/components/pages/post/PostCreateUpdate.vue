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
                        <router-link :to="{name:'posts'}" class="btn btn-light"><i class="fa fa-angle-left fa-fw"></i>Back</router-link>
                        <button type="submit" class="btn btn-primary">
                            <template v-if="isPost">
                                <i class="fa fa-check fa-fw"></i>Create
                            </template>
                            <template v-else>
                                <i class="fa fa-edit fa-fw"></i>Update
                            </template>
                        </button>
                        <button type="reset" class="btn btn-danger"><i class="fa fa-close fa-fw"></i>Cancel</button>
                    </div>
                </div>
            </div>
            <div class="card-body" :style="loading ? 'opacity:0.5; z-index:123456 !important;' : ''">
                <pre-loading v-show="loading"/>
                <errors-laravel v-show="Object.keys(dataErrors).length > 0" :data-errors="dataErrors" @eventClose="dataErrors = {}"/>
                <div class="form-group">
                    <label>Image</label>
                    <div class="card">
                        <div class="card-body">
                            <template v-if="image != null">
                                <div class="img-thumbnail border-0 text-center">
                                    <img :src="image" alt="" class=" w-25 h-25">
                                </div>
                                <div class="col-5 mx-auto">
                                    <input type="text" class="form-control" placeholder="example.png">
                                </div>
                            </template>
                            <template v-else>
                                <div class="img-thumbnail text-center border-0 m-0 p-0">
                                    <!--<i class="fa fa-image fa-5x"></i>-->
                                    <template v-if="isPost">
                                        <img :src="image" alt="" class=" w-25 h-25">
                                    </template>
                                    <template v-else>
                                        <img :src="params.path_name+params.image" alt="" class=" w-25 h-25">
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div class="card-footer bg-transparent">
                            <input @change="onFileChange" type="file" class="form-control border-0">
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
                    <vue-select multiple v-model="selectedTag" :options="dataTags" label="name" track-by="id" @input="changeTag"></vue-select>
                </div>
                <div class="form-group">
                    <label>Path Image Post</label>
                    <vue-select single v-model="selectedPath" :options="dataPaths" label="name" track-by="id" @input="changePath"></vue-select>
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
    import Storage       from 'vue-local-storage'
    import Util          from '../../../util'
    import Editor        from '../../../plugins/TemplateTinymce'
    import PostService   from '../../../services/PostService'
    import ErrorsLaravel from '../../layouts/ErrorsLaravel'
    import PreLoading    from '../../layouts/PreLoading'
    import VueSelect     from 'vue-select'
    import TagService    from '../../../services/TagService'
    import PathService   from '../../../services/PathService'

    export default {
        name: 'CreateUpdatePost',
        components: {PreLoading, ErrorsLaravel, Editor, VueSelect},
        data: () => ({
            params: {},
            dataTags: [],
            dataPaths: [],
            configEditor: Util.editor,
            isPost: true,
            dataErrors: {},
            loading: false,
            readonlyDescription: false,
            image: null,
            selectedTag: null,
            selectedPath: null,
            tags:[],
        }),
        created(){
            this.load()
        },
        methods: {
            load(){
                this.validateIsPostOrPut()
                if(this.isPost){
                    this.params = {}
                }else{
                    if(this.$route.params.dataPost != undefined){
                        Storage.set('data-post-temp', this.$route.params.dataPost)
                        this.params = this.$route.params.dataPost
                    }else{
                        this.params = Storage.get('data-post-temp')
                    }
                }
                this.getTags()
                this.getPaths()
            },
            createOrUpdate(){
                this.loading = true
                if(this.isPost){//Crear
                    PostService.dispatch('createPost', {self: this})
                }else{//Actualizar
                    PostService.dispatch('updatePost', {self: this})
                }
            },
            validateIsPostOrPut(){
                this.isPost = this.$route.name === 'post-create'
            },
            keyupKind(){
                let newKind = ''
                this.params.name.toLowerCase().trim().split(' ').forEach((v,k)=>{//Devolvemos un array del vue-model con split() y lo recorremos
                    if(k>0){
                        newKind += v.replace('','-')
                    }else{
                        newKind = v
                    }
                })
                this.params.kind = newKind
            },
            onFileChange(e) {
                this.image = null
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return
                this.createImage(files[0]);
            },
            createImage(file) {
                let reader = new FileReader()
                reader.onload = (e) => {
                    this.image = e.target.result;
                };
                reader.readAsDataURL(file);
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
                    this.selectedTag.forEach((v,k)=>{
                        this.tags.push(v.id)
                    })
                    this.params.tag_id = JSON.stringify(this.tags)
                }
            },
            filterTag(id){
                let tags = [],selecteds = []
                if(id != null){
                    tags = JSON.parse(id)
                    if(tags.length > 0){
                        tags.forEach((v, k) =>{
                            this.dataTags.forEach((vv, kk) =>{
                                if(vv.id == v){
                                    selecteds.push(vv)
                                }
                            })
                        })
                    }
                }
                return  selecteds
            },
            filterPath(id){
                return this.dataPaths.filter((obj)=>{
                    return (obj.id == id) ? obj : false
                })[0]
            }
        },
    }
</script>
<style scoped>

</style>