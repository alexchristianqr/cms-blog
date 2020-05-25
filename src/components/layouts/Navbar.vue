<template>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top nav-bg-default">
        <div class="container-fluid pl-0 pr-0">
            <a class="navbar-brand" href="#">
                <b class="mr-1">Management Panels</b><span class="text-secondary small">(MP)</span>
            </a>

            <div class="text-right">
              <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                      data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                      aria-label="Toggle navigation" style="outline: none !important;">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto">
                  <li class="nav-item dropdown w-100">
                    <a class="nav-link " href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span>{{storage.get('data-auth').name}}</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownBlog">
                      <div class="dropdown-header">
                        <div class="text-center">
                          <i class="fa fa-user-circle fa-5x"></i>
                        </div>
                        <div class="text-center">
                          <div>{{storage.get('data-auth').name}}</div>
                          <span><small>({{storage.get('data-auth').email}})</small></span>
                        </div>
                      </div>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Profile</a>
                      <a class="dropdown-item" href="#">Settings</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#" @click.prevent="doLogout"><i class="fa fa-sign-out mr-1"></i>Logout</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
        </div>
    </nav>
</template>

<script>
    import Storage from 'vue-local-storage'
    import AuthService from '../../services/AuthService'

    export default {
        name: 'Navbar',
        data: () => ({
            storage: Storage,
        }),
        methods: {
            doLogout(){
                AuthService.dispatch('doLogout', {self: this})
            },
        },
    }
</script>

<style scoped>

</style>
