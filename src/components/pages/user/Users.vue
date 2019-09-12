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
            <!--<div class="input-group w-20">-->
            <!--<input title="Buscar" type="text" v-model="inputSearch" ref="search" class="form-control" placeholder="Buscar">-->
            <!--<template v-if="inputSearch !== ''">-->
            <!--<div class="input-group-append">-->
            <!--<button class="btn btn-secondary" @click="cleanSearch"><i class="icon-close"></i></button>-->
            <!--</div>-->
            <!--</template>-->
            <!--</div>-->

            <div class="input-group w-35">
              <input v-model="inputSearch" ref="ref_inputSearch" type="text" placeholder="Search" class="form-control">
              <div v-if="inputSearch != ''" class="input-group-append">
                <button title="Limpiar Busqueda" @click="cleanSearch()" type="button" class="btn btn-primary">
                  <i class="fa fa-close"></i>
                </button>
              </div>
            </div>
            <vue-treeselect placeholder="Cliente" :options="optionsDataClients" :limit="1" :limitText="count => `y ${count} más`" v-model="params.client_id" class="text-uppercase" @input="doRequestServer">
              <span slot="option-label" slot-scope="{ node }" class="float-left">{{ node.label }}</span>
            </vue-treeselect>
            <button class="btn btn-secondary" @click="load"><i class="fa fa-refresh fa-fw"></i></button>
            <input v-model="params.dateFilterStart" type="date" class="form-control" @input="filtereds">
            <input v-model="params.dateFilterEnd" type="date" class="form-control" @input="filtereds">
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name Complete</th>
              <th>Email</th>
              <th>Updated</th>
              <th class="text-center">Status</th>
            </tr>
            </thead>
            <tbody class="small">
            <template v-if="loading.table">
              <tr>
                <td colspan="6" class="text-center">
                  <div class="p-2">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x text-secondary"></i>
                    <p>Obteniendo Informacion!</p>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else-if="!loading.table && filteredUsers.length > 0">
              <tr v-for="(v,k) in filteredUsers">
                <th>{{k+1}}</th>
                <td width="30%" class="text-uppercase">{{v.name+' '+v.lastname}}</td>
                <td>{{v.email}}</td>
                <td>{{v.updated_at}}</td>
                <td class="text-center">
                  <i v-if="v.status == 'A'" class="fa fa-circle text-success"></i>
                  <i v-if="v.status == 'I'" class="fa fa-circle text-danger"></i>
                </td>
              </tr>
            </template>
            <template v-else-if="!loading.table && filteredUsers.length < 1">
              <tr>
                <td colspan="6" class="text-center">
                  <div class="p-2">
                    <i class="fa fa-exclamation-triangle fa-2x text-danger"></i>
                    <p>Usted no cuenta con información disponible!</p>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
          </div>
          <template v-if="!loading.table && filteredUsers.length > 0">
            <div class="row">
              <div class="col-4 my-auto">
                <span>Mostrando</span><b> {{dataUsers.to}}</b><span> de</span><b> {{dataUsers.total}}</b><span> registros</span>
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

  export default {
    name: 'Users',
    data: () => ({
      inputSearch: '',
      dataUsers: {data: []},
      loading: {
        table: false,
      },
      params: {
        page: 1,
        paginate: 10,
      },
    }),
    created () {
      this.load()
    },
    computed: {
      filteredUsers () {
        const validateName = (item) => {
          return item.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) > -1
        }
        return this.dataUsers.data.filter((item) => {
          return validateName(item)
        })
      },
    },
    methods: {
      load () {
        this.getUsers()
      },
      doRequestServer () {
        this.getUsers()
      },
      getUsers () {
        this.loading.table = true
        UserService.dispatch('getUsers', {self: this})
      },
      filters () {
        this.getUsers()
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
