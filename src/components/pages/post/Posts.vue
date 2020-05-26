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
              <router-link :to="{name:'post-create'}" class="btn btn-primary"><i class="fa fa-plus mr-1"></i><span>New Post</span></router-link>
            </div>
          </div>
          <hr>
          <div class="form-inline">
            <div class="input-group w-25">
              <input v-model="inputSearch" ref="ref_inputSearch" type="search" placeholder="Search" class="form-control" data-toggle="tooltip" data-placement="top" title="Buscar">
              <div v-if="inputSearch != ''" class="input-group-append">
                <button title="Limpiar" @click="cleanSearch()" type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top">
                  <i class="fa fa-close"></i>
                </button>
              </div>
            </div>
            <select data-toggle="tooltip" data-placement="top" title="Estado" class="form-control" v-model="params.status" @change="doRequestServer">
              <option value="">TODOS</option>
              <option value="A">ACTIVO</option>
              <option value="I">INACTIVO</option>
              <option value="P">PENDIENTE</option>
            </select>
            <button class="btn btn-primary" @click="doRequestServer" data-toggle="tooltip" data-placement="top" title="Actualizar"><i class="fa fa-refresh fa-fw"></i></button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-bordered mb-0 table-hover">
            <thead class="table-secondary">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Published</th>
              <th>Updated</th>
              <th>Status</th>
              <th></th>
            </tr>
            </thead>
            <load-tbody colspan="6" v-if="loading.table"/>
            <tbody v-if="!loading.table && filteredPosts.length > 0" class="small">
              <tr v-for="(v,k) in filteredPosts">
                <th class="align-middle">{{k+1}}</th>
                <td :title="v.id + ' / ' + v.name" class="mwp-150 align-middle">
                  <div class="d-inline-block text-truncate align-middle mw-100"><span>{{v.name}}</span></div>
                </td>
                <td class="align-middle">{{v.published}}</td>
                <td class="align-middle">{{v.updated_at}}</td>
                <td class="align-middle">
                  <!--<i v-if="v.status == 'A'" class="fa fa-circle text-success"></i>-->
                  <!--<i v-if="v.status == 'I'" class="fa fa-circle text-danger"></i>-->
                  <!--<i v-if="v.status == 'P'" class="fa fa-circle text-warning"></i>-->
                  <span v-if="v.status == 'A'" class="badge badge-success font-weight-light">ACTIVE</span>
                  <span v-if="v.status == 'I'" class="badge badge-danger font-weight-light">INACTIVE</span>
                  <span v-if="v.status == 'P'" class="badge badge-warning font-weight-light">PENDING</span>
                </td>
                <td class="text-right align-middle">
                  <div class="btn-group btn-group-sm" role="group" aria-label="Button group with nested dropdown">
                    <router-link :to="{name:'post-update',params:{dataPost:v}}" class="btn btn-light border-secondary btn-sm">
                      <i class="fa fa-edit"></i>
                    </router-link>
                    <div class="btn-group btn-group-sm" role="group">
                      <button id="btnGroupDrop1" type="button" class="btn btn-outline-secondary bt-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                        <a class="dropdown-item" href="#">Status</a>
                        <a class="dropdown-item" href="#">History</a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <failed-tbody colspan="6" v-if="!loading.table && filteredPosts.length < 1"/>
          </table>
          </div>
          <template v-if="!loading.table && dataPosts.data.length > 0">
            <div class="row">
              <div class="col-4 my-auto">
                <span>Mostrando</span><b> {{dataPosts.to}}</b><span> de</span><b> {{dataPosts.total}}</b><span> registros</span>
              </div>
              <div class="col-8">
                <b-pagination class="my-auto justify-content-end" :total-rows="dataPosts.total" :per-page="parseInt(dataPosts.per_page)" v-model="params.page" @input="filters"/>
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
  import Moment from 'moment'
  import Helper from '../../../helper'
  import LoadTbody from '../../layouts/LoadTbody'
  import FailedTbody from '../../layouts/FailedTbody'

  export default {
    name: 'Posts',
    components: {FailedTbody, LoadTbody},
    data: () => ({
      loading: {table: true},
      dataPosts: [],
      dataPost: {},
      inputSearch: '',
      params: {
        status: 'A',
        page: 1,
        paginate: 5,
        date_range: Moment().subtract(6, 'days').format('YYYY-MM-DD') + '/' + Moment().format('YYYY-MM-DD'),
      },
    }),
    created(){
      this.load()
    },
    computed: {
      filteredPosts(){
        return this.dataPosts.data.filter((item) => {return item.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) > -1})
      },
    },
    methods: {
      load(){
        this.getPosts()
        Helper.initializeDateRangePicker({self: this})
      },
      doRequestServer(){
        this.getPosts()
      },
      getPosts(){
        this.loading.table = true
        PostService.dispatch('getPosts', {self: this})
      },
      filters(){
        this.getPosts()
      },
      cleanSearch(){
        this.inputSearch = ''
        this.$refs.ref_inputSearch.focus()
      },
    },
    watch:{
      '$route'(){
        this.load()
      }
    },
    updated () {
      Helper.initializeDateRangePicker({self: this})
    },
  }
</script>

<style scoped>

</style>
