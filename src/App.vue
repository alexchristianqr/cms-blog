<template>
    <div id="app">
        <template v-if="$route.name == 'login'">
            <router-view/>
        </template>
        <template v-else>
            <!-- Navigation -->
            <navbar/>
            <!-- Page Content -->
            <div class="container mt-3 mb-3">

                <!-- Content Row -->
                <div class="row">
                    <!-- Sidebar Column -->
                    <div class="col-lg-3 mb-4">
                        <sidebar/>
                    </div>
                    <!-- Content Column -->
                    <div class="col-lg-9 mb-4">
                        <ol class="breadcrumb border-secondary bg-light" style="border: 1px solid;">
                            <li class="breadcrumb-item">
                                <router-link to="home">Home</router-link>
                            </li>
                            <li class="breadcrumb-item active">About</li>
                        </ol>
                        <div class="row">
                            <router-view/>
                        </div>
                    </div>
                </div>
                <!-- /.row -->

            </div>
            <!-- /.container -->
        </template>
    </div>
</template>

<script>
	import Sidebar from './components/layouts/Sidebar'
	import Navbar  from './components/layouts/Navbar'

	export default {
		name: 'App',
		components: {Sidebar, Navbar},
        created(){
            if(this.$route.name == 'login'){
                document.body.classList.add('bg-light')
            }
        },
	}
</script>

<style>
    @import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
    @import "./assets/css/sb-admin.css";
    @import "../node_modules/font-awesome/css/font-awesome.min.css";

    .form-inline > input,
    .form-inline > select,
    .form-inline > label,
    .form-inline > a,
    .form-inline > div,
    .form-inline > button {
        margin: 0 5px 5px 0;
    }

    .mce-tinymce {
        box-shadow: none !important;
        -webkit-box-shadow:none !important;
    }
</style>