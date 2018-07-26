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
                        <router-link :to="{name:'posts'}" class="btn btn-link text-muted"><i
                                class="fa fa-angle-left fa-fw"></i>Volver
                        </router-link>
                        <template v-if="isPost">
                            <button type="submit" class="btn btn-outline-primary">Create</button>
                        </template>
                        <template v-else>
                            <button type="submit" class="btn btn-outline-primary">Update</button>
                        </template>
                        <button class="btn btn-outline-danger">Cancel</button>
                    </div>
                </div>
            </div>
            <div class="card-body" :style="preLoading ? 'opacity:0.25' : ''">
                <pre-loading v-show="preLoading"/>
                <errors-laravel v-show="dataErrors != undefined" :data-errors="dataErrors" @eventClose="dataErrors = null"/>
                <div class="form-group">
                    <label>Name or Title</label>
                    <input v-model="dataPost.name" type="text" class="form-control" placeholder="Name or Title">
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
	import Util          from '../../../util'
	import Editor        from '@tinymce/tinymce-vue'
	import PostService   from '../../../services/PostService'
	import ErrorsLaravel from '../../layouts/ErrorsLaravel'
	import PreLoading    from '../../layouts/PreLoading'

	export default {
		name: 'CreateUpdatePost',
		components: {PreLoading, ErrorsLaravel, Editor},
		data: () => ({
			df: '',
			hola: 'kka',
			dataPost: {},
			params: {},
			configEditor: Util.editor,
			isPost: true,
			dataErrors: null,
			preLoading: false,
		}),
		created () {
			this.validateIsPostOrPut()
			this.load()
		},
		methods: {
			load () {
				if(this.isPost) {
					this.dataPost = {}
				} else {
					if(this.$route.params.dataPost != undefined) {
						Storage.set('data-temp-post', this.$route.params.dataPost)
						this.dataPost = this.$route.params.dataPost
					} else {
						this.dataPost = Storage.get('data-temp-post')
					}
				}
			},
			createOrUpdate () {
				this.params = this.dataPost
				this.preLoading = true
				this.preLoading = true
				if(this.isPost) {//Crear
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
    #mceu_33 {
        display: none !important;
    }
</style>