<template>
    <div class="pdf-thumbnail-item">
        <img :src="source.imgUrl" alt="">
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PdfPageInfo } from '../utils/http';

@Component
export default class PdfThumbnailItem extends Vue {
    @Prop() source!: PdfPageInfo;
}
</script>

<style lang="scss" scoped>
.pdf-thumbnail-item {
    text-align: center;
    padding: 10px 0;

    img {
        width: 80%;
        margin: 0 auto;
    }
}
</style>