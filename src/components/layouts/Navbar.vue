<template>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">
                <b class="mr-1">Management Panels</b><span class="text-secondary small">(MP)</span>
            </a>
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                    data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                    aria-label="Toggle navigation" style="outline: none !important;">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true"
                           aria-expanded="false">
                            <span>Alex Chistian <small>(aquispe.developer@gmail.com)</small></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownBlog">
                            <div class="dropdown-header">
                                <div class="text-center">
                                    <i class="fa fa-user-circle fa-5x"></i>
                                </div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Profile</a>
                            <a class="dropdown-item" href="#">Settings</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" @click.prevent="doLogout">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import AuthService from '../../services/AuthService'

    export default {
        name: 'Navbar',
        methods: {
            doLogout(){
                AuthService.dispatch('doLogout', {self: this})
            },
        },
    }
</script>

<style scoped>

</style>