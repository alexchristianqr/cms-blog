<template>
    <div>
        Page users create
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-6 my-auto">
                        <div class="card-title my-auto h5 text-muted">Create Post</div>
                    </div>
                    <div class="col-6 text-right">
                        <router-link :to="{name:'post-create'}" class="btn btn-primary">Page Post Create</router-link>
                        <router-link :to="{name:'post-update'}" class="btn btn-success">Page Post Update</router-link>
                    </div>
                </div>
            </div>
            <div class="card-body">

            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'UserCreateUpdate',
  }
</script>

<style scoped>

</style>