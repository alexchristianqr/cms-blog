<template>
    <div class="container">
        <template v-if="$route.name != 'users'">
            <router-view/>
        </template>
        <template v-else>
            <div class="card border-secondary">
                <div class="card-header border-secondary bg-light">
                    <div class="row">
                        <div class="col-6 my-auto">
                            <div class="card-title my-auto h5 text-secondary">Users</div>
                        </div>
                        <div class="col-6 text-right my-auto">
                            <button id="d1" type="button" class="btn btn-light dropdown-toggle my-auto"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-bars mr-1"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="d1">
                                <router-link :to="{name:'user-create'}" class="dropdown-item">Create User</router-link>
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
                                <button title="Limpiar Busqueda" @click="cleanSearch()" type="button" class="btn btn-secondary">
                                    <i class="fa fa-close"></i>
                                </button>
                            </div>
                        </div>
                        <!--<input v-model="inputSearch" type="search" class="form-control" placeholder="Search in Posts">-->
                        <button class="btn btn-success" @click="load"><i class="fa fa-refresh fa-fw"></i></button>
                        <!--<input v-model="params.dateFilterStart" type="date" class="form-control" @input="filtereds">-->
                        <!--<input v-model="params.dateFilterEnd" type="date" class="form-control" @input="filtereds">-->
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Name Complete</th>
                            <th>Email</th>
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
                        <template v-else-if="!loading.table && dataUsers.data.length > 0">
                            <template v-if="typeof filteredUsers == 'object'">
                                <tr v-for="(v,k) in filteredUsers">
                                    <th>{{k+1}}</th>
                                    <td width="30%">{{v.name+' '+v.lastname}}</td>
                                    <td>{{v.email}}</td>
                                    <td>{{v.updated_at}}</td>
                                    <td class="text-center">
                                        <i v-if="v.status == 'A'" class="fa fa-circle text-success"></i>
                                        <i v-if="v.status == 'I'" class="fa fa-circle text-danger"></i>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="6" class="text-dark text-center">
                                        <div style="padding: 3em 2em 0 2em">
                                            <i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
                                            <p>No hay información con este filtro <span class="badge-light pr1 pl-1">{{inputSearch}}</span></p>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </template>
                        <template v-else-if="!loading.table && dataUsers.data.length < 1">
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
                    <template v-if="!loading.table && dataUsers.data.length > 0">
                        <hr>
                        <div class="row">
                            <div class="col-4">
                                <nav>
                                    <ul class="pagination">
                                        <li class="page-item"><span class="page-link">Mostrando</span></li>
                                        <li class="page-item"><span class="page-link">{{dataUsers.to}}</span></li>
                                        <li class="page-item"><span class="page-link">de</span></li>
                                        <li class="page-item"><span class="page-link">{{dataUsers.total}}</span></li>
                                        <li class="page-item"><span class="page-link">Registros</span></li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="col-8">
                                <b-pagination class="justify-content-end" size="md" :total-rows="dataUsers.total" v-model="params.page" :per-page="parseInt(dataUsers.per_page)" @input="doRequestServer"></b-pagination>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import UserService from '../../../services/UserService'
    import bPagination from 'bootstrap-vue/es/components/pagination/pagination';

    export default {
      name:'Users',
      components:{bPagination},
      data:()=>({
        inputSearch:'',
        dataUsers:{data:[]},
        loading:{
          table:false,
        },
        params:{
          page:1,
          paginate:5,
        },
      }),
      created(){
        this.load()
      },
      computed:{
        filteredUsers(){
          const validateName = (item)=>{
            return item.name.toLowerCase().indexOf(this.input.search.toLowerCase()) > -1
          }
          const validateLastName = (item)=>{
            return item.lastname.toLowerCase().indexOf(this.input.search.toLowerCase()) > -1
          }
          return this.dataUsers.data.filter((item)=>{
            return validateName(item) || validateLastName(item)
          })
        },
      },
      methods:{
        load(){
          this.getUsers()
        },
        doRequestServer(){
          this.getUsers()
        },
        getUsers(){
          this.loading.table = true
          UserService.dispatch('getUsers', {self:this})
        },
        filters(){
          this.getUsers()
        },
        cleanSearch(){
          this.inputSearch = ''
          this.$refs.ref_inputSearch.focus()
        },
      },
    }
</script>

<style scoped>

</style>
