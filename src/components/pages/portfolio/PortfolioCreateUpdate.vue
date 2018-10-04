<template>
    <div class="card border-secondary">
        <form @submit.prevent="createOrUpdate">
            <div class="card-header border-secondary bg-light">
                <div class="row">
                    <div class="col-6 my-auto">
                        <div class="card-title my-auto h5 text-secondary">
                            <template v-if="isPost">
                                <span>Create Project</span>
                            </template>
                            <template v-else>
                                <span>Update Project</span>
                            </template>
                        </div>
                    </div>
                    <div class="col-6 text-right">
                        <router-link :to="{name:'portfolios'}" class="btn btn-light"><i class="fa fa-angle-left fa-fw"></i>Back</router-link>
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
                                    <template v-if="isPost">
                                        <img :src="image" alt="" class=" w-25 h-25">
                                    </template>
                                    <template v-else>
                                        <img :src="params.path_name+params.image" alt="" class=" w-25 h-25">
                                    </template>
                                </div>
                            </template>
                        </div>
                        <!--<div class="card-footer bg-transparent">-->
                            <!--<input @change="onFileChange" type="file" class="form-control border-0">-->
                        <!--</div>-->
                    </div>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <textarea @input="keyupKind" v-model="params.name" rows="2" class="form-control"></textarea>
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
                <!--<div class="form-group">-->
                    <!--<label>Path Image Post</label>-->
                    <!--<vue-select single v-model="selectedPath" :options="dataPaths" label="name" track-by="id" @input="changePath"></vue-select>-->
                <!--</div>-->
                <div class="form-group">
                    <label>Repositories</label>
                    <!--<div class="input-group">-->
                        <!--<div class="input-group-prepend">-->
                            <!--<i class="fa fa-github"></i>-->
                        <!--</div>-->
                            <!--<input type="text" class="form-control">-->
                        <!--&lt;!&ndash;<div class="input-group-append"><i class="fa fa-github"></i></div>&ndash;&gt;-->
                    <!--</div>-->
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fa fa-github"></i></span>
                        </div>
                        <input v-model="params.repository_github" type="text" class="form-control" placeholder="Repository in Github">
                        <template v-if="params.repository_github">
                            <div class="input-group-append">
                                <button class="btn btn-danger" @click.prevent="params.repository_github=''"><i class="fa fa-times"></i></button>
                            </div>
                        </template>
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fa fa-codepen"></i></span>
                        </div>
                        <input v-model="params.repository_codepen" type="text" class="form-control" placeholder="Repository in Codepen">
                        <template  v-if="params.repository_codepen">
                            <div class="input-group-append">
                                <button class="btn btn-danger" @click.prevent="params.repository_codepen=''"><i class="fa fa-times"></i></button>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <editor id="d2" v-model="params.description"></editor>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import Storage          from 'vue-local-storage'
    import Util             from '../../../util'
    import ErrorsLaravel    from '../../layouts/ErrorsLaravel'
    import PreLoading       from '../../layouts/PreLoading'
    import VueSelect        from 'vue-select'
    import Editor           from '../../../plugins/TemplateTinymce'
    import PortfolioService from '../../../services/PortfolioService'

    export default {
        name: 'PortfolioCreateUpdate',
        components: {PreLoading, ErrorsLaravel, Editor, VueSelect},
        data: () => ({
            params: {},
            dataPaths: [],
            configEditor: Util.editor,
            isPost: true,
            dataErrors: {},
            loading: false,
            readonlyDescription: false,
            image: null,
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
                    this.params = {}
                }else{
                    if(this.$route.params.dataPortfolio != undefined){
                        Storage.set('data-portfolio-temp', this.$route.params.dataPortfolio)
                        this.params = this.$route.params.dataPortfolio
                    }else{
                        this.params = Storage.get('data-portfolio-temp')
                    }
                }
            },
            createOrUpdate(){
                this.loading = true
                if(this.isPost){//Crear
                    PortfolioService.dispatch('createPortfolio', {self: this})
                }else{//Actualizar
                    PortfolioService.dispatch('updatePortfolio', {self: this})
                }
            },
            validateIsPostOrPut(){
                this.isPost = this.$route.name === 'portfolio-create'
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
                if(typeof newKind.split('(') == 'object' || typeof newKind.split(')') == 'object'){
                    let newSubKind = '', temp = ''
                    newKind.split('(').forEach((vv,kk)=>{//Devolvemos un array del vue-model con split() y lo recorremos
                        if(vv.split(')').length === 2){
                                temp = ''
                                temp += vv.replace(')','')
                                newSubKind =  newSubKind + '-' + temp
                        }else{
                            if(kk<=0){
                                newSubKind += vv.replace(' ','-')
                            }else{
                                newSubKind += vv.replace('','-')
                            }
                        }
                    })
                    newKind = newSubKind
                }
                this.params.kind = newKind
            },
        }
    }
</script>

<style scoped>

</style>