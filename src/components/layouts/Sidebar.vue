<template>
    <div class="list-group">
        <router-link :to="{name:'home'}" class="list-group-item list-group-item-action border-secondary"><i class="fa fa-home mr-1"></i>Home</router-link>
        <router-link :to="{name:'posts'}" class="list-group-item list-group-item-action border-secondary"><i class="fa fa-newspaper-o mr-1"></i>Posts</router-link>
        <router-link :to="{name:'users'}" class="list-group-item list-group-item-action border-secondary"><i class="fa fa-users mr-1"></i>Users</router-link>
        <router-link :to="{name:'portfolios'}" class="list-group-item list-group-item-action border-secondary"><i class="fa fa-files-o mr-1"></i>Portfolios</router-link>
        <router-link :to="{name:'categories'}" class="list-group-item list-group-item-action border-secondary"><i class="fa fa-tags mr-1"></i>Categories</router-link>
    </div>
</template>

<script>
  export default {
    name: 'Sidebar',
  }
</script>

<style scoped>

</style>
