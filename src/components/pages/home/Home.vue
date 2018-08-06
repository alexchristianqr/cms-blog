<template>
    <div class="container">
        <div class="alert alert-primary">
            <h4>Hola <b>{{storage.get('data-auth').name}}</b></h4>
            <span>Bienvenido al <span class="badge-light pl-1 pr-1">Sistema de Administración de Paneles</span>, en esta plataforma podras gestionar e interactuar con el sitio blog</span>
        </div>
    </div>
</template>

<script>
    import Storage from 'vue-local-storage'

    export default {
        name: 'Home',
        data: () => ({
            storage: Storage,
        }),
    }
</script>

<style scoped>

</style>