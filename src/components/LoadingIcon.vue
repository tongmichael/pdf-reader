<template>
    <div class='loading-box'>
        <div class="loading-icon"></div>
    </div>
</template>

<script>
export default {
    name: 'LoadingIcon'
}
</script>

<style scoped>
.loading-box {
    background: #ffffff;
    height: 100%;
}

.loading-icon {
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    background: url(../assets/loading-icon.gif) center no-repeat;
    width: 40px;
    height: 40px;
}
</style>