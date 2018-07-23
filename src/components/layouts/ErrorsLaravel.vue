<template>
    <div class="alert alert-danger fade show" role="alert">
        <button type="button" class="close" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
        </button>
        <div v-for="error in dataErrors">
            <span><i class="fa fa-times fa-fw"></i>{{error[0]}}</span>
        </div>
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