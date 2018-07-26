<template>
    <div style=" display: contents;top: 50%;bottom: 50%;left: 0;right: 0;z-index: 123456">
        <div class="position-absolute text-center" style="z-index:123456; transform: translateY(-50%); left: 0; right: 0; bottom: 0; top: 65%;">
            <div>
                <i class="fa fa-circle-o-notch fa-spin fa-4x my-auto fade text-primary" style="z-index: 1234567; opacity: 1; position: relative;"></i>
                <p class="text-primary">Loading please wait...</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Util from '../../util'

    export default {
        name: 'PreLoading',
        data:()=>({
            util: Util,
        }),
    }
</script>

<style scoped>

</style>