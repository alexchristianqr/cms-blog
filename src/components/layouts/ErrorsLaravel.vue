<template>
    <div class="alert alert-danger fade show" role="alert">
        <button type="button" class="close" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
        </button>
        <template v-if="dataErrors.errors !== undefined">
            <div v-for="error in dataErrors.errors">
                <span><i class="fa fa-times fa-fw"></i>{{error[0]}}</span>
            </div>
        </template>
        <template v-else>
            <span>{{dataErrors}}</span>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'ErrorsLaravel',
    props:{
      dataErrors :{}
    },
    methods:{
      close(){
        this.$emit('eventClose', this)
      }
    }
  }
</script>

<style scoped>

</style>