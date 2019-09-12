<template>
  <tbody>
  <tr :class="bg">
    <td :colspan="colspan" class="text-center pt-2 pb-1 border-top-0">
      <div class="m-2">
        <i class="fa fa-circle-o-notch fa-spin fa-2x text-muted"></i>
        <div>Obteniendo información</div>
      </div>
    </td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    name:'LoadTbody',
    props:{
      colspan:{
        type:String,
      },
      bg:{
        type:String,
        default:'bg-white',
      },
    },
  }
</script>

<style scoped>

</style>
