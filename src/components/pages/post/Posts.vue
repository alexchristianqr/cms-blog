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
                        <div class="col-6 text-right my-auto">
                            <button id="d1" type="button" class="btn btn-light dropdown-toggle my-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-bars mr-1"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="d1">
                                <router-link :to="{name:'post-create'}" class="dropdown-item">Create Post</router-link>
                                <a class="dropdown-item" href="#">Export Data</a>
                                <a class="dropdown-item" href="#">Generate Backup</a>
                                <a class="dropdown-item" href="#">Activate Paginate</a>
                                <a class="dropdown-item" href="#">Preferences</a>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="form-inline">
                        <div class="input-group w-35">
                            <input v-model="inputSearch" ref="ref_inputSearch" type="search" placeholder="Search" class="form-control">
                            <div v-if="inputSearch != ''" class="input-group-append">
                                <button title="Clean input search" @click="cleanSearch()" type="button" class="btn btn-secondary">
                                    <i class="fa fa-close"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-success" @click="load"><i class="fa fa-refresh fa-fw"></i></button>
                        <input v-model="params.dateFilterStart" type="date" class="form-control" @input="filters">
                        <input v-model="params.dateFilterEnd" type="date" class="form-control" @input="filters">
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Published</th>
                            <th>Updated</th>
                            <th class="text-center">Status</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-if="loading.table">
                            <tr>
                                <td colspan="6" class="text-dark text-center">
                                    <div style="padding: 3em 2em 0 2em">
                                        <i class="fa fa-circle-o-notch fa-spin fa-2x mb-2"></i>
                                        <p>Obteniendo Informacion!</p>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="!loading.table && dataPosts.data.length > 0">
                            <tr v-for="(v,k) in filteredPosts">
                                <th>{{k+1}}</th>
                                <td width="30%">{{v.name}}</td>
                                <td>{{v.published}}</td>
                                <td>{{v.updated_at}}</td>
                                <td class="text-center">
                                    <i v-if="v.status == 'A'" class="fa fa-circle text-success"></i>
                                    <i v-if="v.status == 'I'" class="fa fa-circle text-danger"></i>
                                </td>
                                <td class="text-right">
                                    <div class="btn-group btn-group-sm" role="group" aria-label="Button group with nested dropdown">
                                        <router-link :to="{name:'post-update',params:{dataPost:v}}" class="btn btn-light border-secondary btn-sm">
                                            <i class="fa fa-edit"></i>
                                        </router-link>
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button id="btnGroupDrop1" type="button"
                                                    class="btn btn-outline-secondary bt-sm dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false"></button>
                                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                                                <a class="dropdown-item" href="#">Status</a>
                                                <a class="dropdown-item" href="#">History</a>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="!loading.table && dataPosts.data.length < 1">
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
                    <template v-if="!loading.table && dataPosts.data.length > 0">
                        <hr>
                        <div class="row">
                            <div class="col-4">
                                <nav>
                                    <ul class="pagination">
                                        <li class="page-item"><span class="page-link">Mostrando</span></li>
                                        <li class="page-item"><span class="page-link">{{dataPosts.to}}</span></li>
                                        <li class="page-item"><span class="page-link">de</span></li>
                                        <li class="page-item"><span class="page-link">{{dataPosts.total}}</span></li>
                                        <li class="page-item"><span class="page-link">Registros</span></li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="col-8">
                                <b-pagination class="justify-content-end" size="md" :total-rows="dataPosts.total" v-model="params.page" :per-page="parseInt(dataPosts.per_page)" @input="filters"></b-pagination>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import PostService from '../../../services/PostService'
    import Storage     from 'vue-local-storage'
    import Moment      from 'moment'
    import bPagination from 'bootstrap-vue/es/components/pagination/pagination';

    export default {
        name: 'Posts',
        components:{bPagination},
        data: () => ({
            loading: {table: true},
            dataPosts: [],
            dataPost: {},
            inputSearch: '',
            params: {
                page: 1,
                paginate: 5,
                dateFilterStart: Moment().format('YYYY-MM-DD'),
                dateFilterEnd: Moment().format('YYYY-MM-DD'),
            },
        }),
        created(){
            this.load()
        },
        computed: {
            filteredPosts(){
                return this.dataPosts.data.filter((item) =>{return item.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) > -1})
            },
        },
        watch: {
            $route(){
                if(this.$route.name === 'posts'){
                    Storage.remove('data-post-temp')
                }
            },
        },
        methods: {
            load(){
                this.getPosts()
                this.params.page = this.dataPosts.current_page
            },
            getPosts(){
                this.loading.table = true
                PostService.dispatch('getPosts', {self: this})
            },
            filters(){
                this.getPosts()
            },
            cleanSearch () {
                this.inputSearch = ''
                this.$refs.ref_inputSearch.focus()
            },
        },
    }
</script>

<style scoped>

</style>