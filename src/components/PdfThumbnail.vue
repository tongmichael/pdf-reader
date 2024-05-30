<template>
    <dynamic-scroller
        :items="data"
        :min-item-size="200"
        key-field="pageId"
        class="pdf-thumbnail">
        <template v-slot="{ item, index, active }">
            <dynamic-scroller-item
                :item="item"
                :active="active"
                :size-dependencies="[item.height]"
                :data-index="index">
                <pdf-thumbnail-item @click.native="clickItem(item,index)" :source="item"/>
            </dynamic-scroller-item>
        </template>
    </dynamic-scroller>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PdfPageInfo } from '../utils/http';
import PdfThumbnailItem from './PdfThumbnailItem.vue';
//@ts-ignore
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

@Component({
    components: {
        PdfThumbnailItem,
        DynamicScroller,
        DynamicScrollerItem,
    },
})
export default class PdfThumbnail extends Vue {
    @Prop() data!: PdfPageInfo[];

    clickItem(data: PdfPageInfo, index: number) {
        this.$emit('change', {data, index});
    }
}
</script>

<style lang="scss" scoped>
.pdf-thumbnail {
    height: 100%;
    overflow: auto;
}
</style>