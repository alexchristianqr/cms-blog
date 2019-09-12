<template>
    <div id="app">
        <template v-if="$route.name == 'login'">
            <router-view/>
        </template>
        <template v-else>
            <!-- Navigation -->
            <navbar/>
            <!-- Page Content -->
          <div class="col-11 mx-auto">
            <div class="container-fluid mt-3 mb-3">

                <!-- Content Row -->
                <div class="row">
                    <!-- Sidebar Column -->
                    <div class="col-lg-3 mb-4">
                        <sidebar/>
                    </div>
                    <!-- Content Column -->
                    <div class="col-lg-9 mb-4">
                        <div class="row">
                            <router-view/>
                        </div>
                    </div>
                </div>
                <!-- /.row -->
            </div>
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
    @import "../node_modules/bootstrap-vue/dist/bootstrap-vue.min.css";
    @import "../node_modules/font-awesome/css/font-awesome.min.css";
    @import "../node_modules/daterangepicker/daterangepicker.css";
    @import "./assets/css/dev.css";
    @import "./assets/css/app.css";
</style>
