<template>
    <div class="container">
        <template v-if="$route.name != 'posts'">
            <router-view/>
        </template>
        <template v-else>
            <div class="card border-secondary">
                <div class="card-header border-secondary bg-light">
                    <div class="row">
                        <div class="col-6 my-auto">
                            <div class="card-title my-auto h5 text-secondary">Posts</div>
                        </div>
                        <div class="col-6 text-right">
                            <router-link :to="{name:'post-create'}" class="btn btn-outline-primary">
                                <i class="fa fa-plus fa-fw"></i>Create Post
                            </router-link>
                        </div>
                    </div>
                    <hr>
                    <div class="form-inline">
                        <input v-model="inputSearch" type="search" class="form-control" placeholder="Search in Posts">
                        <button class="btn btn-success" @click="load"><i class="fa fa-refresh fa-fw"></i></button>
                        <input v-model="params.dateFilterStart" type="date" class="form-control" @input="filtereds">
                        <input v-model="params.dateFilterEnd" type="date" class="form-control" @input="filtereds">
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Published</th>
                            <th>Created</th>
                            <th>Author</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-if="loadingTable">
                            <tr>
                                <td colspan="6" class="text-dark text-center">
                                    <div style="padding: 3em 2em 0 2em">
                                        <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                        <p>Obteniendo Informacion!</p>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="!loadingTable && dataPosts.data.length > 0">
                            <tr v-for="(post,k) in filteredPosts">
                                <th>{{k+1}}</th>
                                <td>{{post.name}}</td>
                                <td>{{post.published}}</td>
                                <td>{{post.created_at}}</td>
                                <td>{{post.user_name}}</td>
                                <td class="text-right">
                                    <div class="btn-group btn-group-sm" role="group"
                                         aria-label="Button group with nested dropdown">
                                        <router-link :to="{name:'post-update',params:{dataPost:post}}"
                                                     class="btn btn-light border-secondary btn-sm">
                                            <i class="fa fa-edit text-warning"></i>
                                        </router-link>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button id="btnGroupDrop1" type="button"
                                                    class="btn btn-outline-secondary bt-sm dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false"></button>
                                            <div class="dropdown-menu dropdown-menu-right"
                                                 aria-labelledby="btnGroupDrop1">
                                                <a class="dropdown-item text-danger" href="#"><i
                                                        class="fa fa-trash-o fa-fw"></i>Delete</a>
                                                <a class="dropdown-item text-success" href="#"><i
                                                        class="fa fa-refresh fa-fw"></i>Change Status</a>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="!loadingTable && dataPosts.data.length < 1">
                            <tr>
                                <td colspan="6" class="text-dark text-center">
                                    <div style="padding: 3em 2em 0 2em">
                                        <i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
                                        <p>Usted no cuenta con información disponible!</p>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import PostService from '../../../services/PostService'
    import Storage     from 'vue-local-storage'
    import Moment      from 'moment'

    export default {
        name: 'Posts',
        data: () => ({
            loadingTable: true,
            dataPosts: {},
            inputSearch: '',
            params: {
                paginate: 50,
                dateFilterStart: Moment().format('YYYY-MM-DD'),
                dateFilterEnd: Moment().format('YYYY-MM-DD'),
            },
        }),
        created(){
            this.load()
        },
        computed: {
            filteredPosts(){
                return this.dataPosts.data.filter(
                    (item) =>{return item.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) > -1})
            },
        },
        watch: {
            $route(){
                if(this.$route.name === 'posts'){
                    Storage.remove('data-temp-post')
                }
            },
        },
        methods: {
            load(){
                this.getPosts()
            },
            getPosts(){
                this.loadingTable = true
                PostService.dispatch('getPosts', {self: this})
            },
            filtereds(){
                this.getPosts()
            },
        },
    }
</script>

<style scoped>

</style>