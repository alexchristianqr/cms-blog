<template>
    <tbody>
    <tr :class="bg">
        <td :colspan="colspan" class="text-center pt-2 pb-1">
          <div class="m-2">
              <i class="fa fa-exclamation-triangle fa-2x text-danger w-100"></i>
              <div>No hay información disponible</div>
          </div>
        </td>
    </tr>
    </tbody>
</template>

<script>
	export default {
		name: 'FailedTbody',
		props: {
			colspan:{
				type:String,
            },
            bg:{
				type:String,
                default:'bg-white'
            }
        },
	}
</script>

<style scoped>

</style>
