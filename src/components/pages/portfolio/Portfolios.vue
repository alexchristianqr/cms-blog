<template>
  <div class="container">
    <template v-if="$route.name != 'portfolios'">
      <router-view/>
    </template>
    <template v-else>
      <div class="card border-secondary">
        <div class="card-header border-secondary bg-light">
          <div class="row">
            <div class="col-6 my-auto">
              <div class="card-title my-auto h5 text-secondary">Portfolios</div>
            </div>
            <div class="col-6 text-right my-auto">
              <button id="d1" type="button" class="btn btn-light dropdown-toggle my-auto" data-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-bars mr-1"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="d1">
                <router-link :to="{name:'portfolio-create'}" class="dropdown-item">Create Project</router-link>
              </div>
            </div>
          </div>
          <hr>
          <div class="form-inline">
            <div class="input-group w-25">
              <input v-model="inputSearch" ref="ref_inputSearch" type="search" placeholder="Search" class="form-control">
              <div v-if="inputSearch != ''" class="input-group-append">
                <button title="Clean input search" @click="cleanSearch()" type="button" class="btn btn-secondary">
                  <i class="fa fa-close"></i>
                </button>
              </div>
            </div>
            <div title="Fecha" class="date_range form-control w-30 text-truncate">
              <i class="fa fa-calendar mr-1 text-primary"></i>
              <span></span>
            </div>
            <button class="btn btn-primary" @click="load"><i class="fa fa-refresh fa-fw"></i></button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-bordered mb-0 table-hover">
            <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Updated</th>
              <th class="text-center">Status</th>
              <th></th>
            </tr>
            </thead>
            <load-tbody colspan="5" v-if="loading.table"/>
            <tbody v-if="!loading.table && filteredPortfolios.length > 0" class="small">
              <tr v-for="(v,k) in filteredPortfolios">
                <th class="align-middle">{{k+1}}</th>
                <td :title="v.id + ' / ' + v.name" class="mwp-150 align-middle">
                  <div class="d-inline-block text-truncate align-middle mw-100"><span>{{v.name}}</span></div>
                </td>
                <!--<td width="35%" class="align-middle text-uppercase small">{{v.name}}</td>-->
                <td class="align-middle">{{v.updated_at}}</td>
                <td class="text-center align-middle">
                  <i v-if="v.status == 'A'" class="fa fa-circle text-success"></i>
                  <i v-if="v.status == 'I'" class="fa fa-circle text-danger"></i>
                </td>
                <td class="text-right align-middle">
                  <div class="btn-group btn-group-sm" role="group" aria-label="Button group with nested dropdown">
                    <router-link :to="{name:'portfolio-update',params:{dataPortfolio:v}}"
                                 class="btn btn-light border-secondary btn-sm">
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
            </tbody>
            <failed-tbody colspan="5" v-if="!loading.table && filteredPortfolios.length < 1"/>
          </table>
          </div>
          <template v-if="!loading.table && filteredPortfolios.length > 0">
            <div class="row">
              <div class="col-4 my-auto">
                <span>Mostrando</span><b> {{dataPortfolios.to}}</b><span> de</span><b>
                {{dataPortfolios.total}}</b><span> registros</span>
              </div>
              <div class="col-8">
                <b-pagination class="justify-content-end" size="md" :total-rows="dataPortfolios.total"
                              v-model="params.page" :per-page="parseInt(dataPortfolios.per_page)"
                              @input="filters"></b-pagination>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import PortfolioService from '../../../services/PortfolioService'
  import Moment from 'moment'
  import LoadTbody from '../../layouts/LoadTbody'
  import FailedTbody from '../../layouts/FailedTbody'
  import Helper from '../../../helper'

  export default {
    name: 'Portfolios',
    components: {FailedTbody, LoadTbody},
    data: () => ({
      loading: {table: true},
      dataPortfolios: [],
      dataPortfolio: {},
      inputSearch: '',
      params: {
        page: 1,
        paginate: 5,
        date_range: Moment().subtract(6, 'days').format('YYYY-MM-DD') + '/' + Moment().format('YYYY-MM-DD'),
      },
    }),
    created(){
      this.load()
    },
    computed: {
      filteredPortfolios(){
        return this.dataPortfolios.data.filter(
          (item) => {return item.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) > -1})
      },
    },
    methods: {
      load(){
        this.getPortfolios()
        Helper.initializeDateRangePicker({self: this})
      },
      getPortfolios(){
        this.loading.table = true
        PortfolioService.dispatch('getPortfolios', {self: this})
      },
      filters(){
        this.getPortfolios()
      },
      cleanSearch(){
        this.inputSearch = ''
        this.$refs.ref_inputSearch.focus()
      },
    },
    updated () {
      Helper.initializeDateRangePicker({self: this})
    },
  }
</script>

<style scoped>

</style>
