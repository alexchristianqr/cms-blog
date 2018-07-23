<template>
    <div class="list-group">
        <router-link :to="{name:'home'}" class="list-group-item list-group-item-action border-secondary">Home</router-link>
        <router-link :to="{name:'posts'}" class="list-group-item list-group-item-action border-secondary">Posts</router-link>
        <router-link :to="{name:'users'}" class="list-group-item list-group-item-action border-secondary">Users</router-link>
        <router-link :to="{name:'categories'}" class="list-group-item list-group-item-action border-secondary">Categories</router-link>
    </div>
</template>

<script>
  export default {
    name: 'Sidebar',
  }
</script>

<style scoped>

</style>