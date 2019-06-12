<template>
    <div class="container">
        <div class="col-4 mx-auto">
            <div class="text-center text-secondary">
                <i class="fa fa-github fa-3x"></i>
                <p>v1.0</p>
            </div>
            <div class="card text-secondary">
            <div class="card-header bg-light">
                <h5 class="card-title my-auto">Sign In</h5>
            </div>
            <!--<div v-show="Object.keys(dataNotify).length > 0" class="card-header p-0 mb-0">-->
            <!--<notify v-show="Object.keys(dataNotify).length > 0" :dataNotify="dataNotify" @eventClose="eventClose"/>-->
            <!--</div>-->
            <div class="card-body">
                <form @submit.prevent="doLogin">
                    <div class="form-group">
                        <label>Email</label>
                        <input v-model="params.email" ref="inputUsername" name="username" class="form-control" type="text" placeholder="email" required autofocus>
                        <span v-if="errors.email !== '' " class="help-block"><small><strong>{{errors.email}}</strong></small></span>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="params.password" ref="inputPassword" name="password" class="form-control mb-1" type="password" placeholder="password" required>
                        <span v-if="errors.password !== '' " class="help-block"><small><strong>{{errors.password}}</strong></small></span>
                    </div>
                    <div class="form-group-sm">
                        <template v-if="loading.button">
                            <button type="button" class="btn btn-primary btn-block btn-lg" disabled>
                                <span>loading...</span>
                            </button>
                        </template>
                        <template v-else>
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Login</button>
                        </template>
                    </div>
                </form>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import AuthService from '../../../services/AuthService'

    export default {
        name: 'Login',
        data: () => ({
            params: {
                email: '',
                password: '',
            },
            errors: {
                email: '',
                password: '',
            },
            loading: {
                button: false,
                table: false,
            },
        }),
        methods: {
            doLogin(){
                this.loading.button = true
                AuthService.dispatch('doLogin', {self: this})
            },
        },
    }
</script>

<style scoped>

</style>
