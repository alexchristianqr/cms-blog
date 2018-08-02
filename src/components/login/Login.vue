<template>
    <div class="container col-4">
        <div class="card mx-auto mt-5">
            <div class="card-header bg-light">
                <span class="card-title my-auto">Sign In</span>
            </div>
            <!--<div v-show="Object.keys(dataNotify).length > 0" class="card-header p-0 mb-0">-->
            <!--<notify v-show="Object.keys(dataNotify).length > 0" :dataNotify="dataNotify" @eventClose="eventClose"/>-->
            <!--</div>-->
            <div class="card-body">
                <form @submit.prevent="doLogin">
                    <div class="form-group">
                        <label>Email</label>
                        <div class="input-group mb-1">
                            <input v-model="params.email" ref="inputUsername" name="username" class="form-control"
                                   type="text" placeholder="email" required autofocus>
                            <div class="input-group-append">
                                <span class="input-group-text bg-white">@sapia.com.pe</span>
                            </div>
                        </div>
                        <span v-if="errors.email !== '' " class="help-block"><small><strong>{{errors.email}}</strong></small></span>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="params.password" ref="inputPassword" name="password" class="form-control mb-1"
                               type="password" placeholder="password" required>
                        <span v-if="errors.password !== '' " class="help-block"><small><strong>{{errors.password}}</strong></small></span>
                    </div>
                    <!--<template v-if="loading.button">-->
                    <!--<button type="submit" class="btn btn-secondary btn-block" disabled>-->
                    <!--<span>entrando...</span>-->
                    <!--</button>-->
                    <!--</template>-->
                    <!--<template v-else>-->
                    <button type="submit" class="btn btn-primary btn-block btn-lg">Entrar</button>
                    <!--</template>-->
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import AuthService from '../../services/AuthService'

    export default {
        name: 'Login',
        data: () => ({
            params: {
                email: 'aquispe.developer@gmail.com',
                password: '12345678',
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
                AuthService.dispatch('doLogin', {self: this})
            },
        },
    }
</script>

<style scoped>

</style>