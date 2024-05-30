<template>
    <div class="pdf-view-page" ref="view" :style="pdfStyle" @contextmenu="onMenuClick">
        <loading-icon v-if="!rendered || !loaded"/>
        <template v-if="image">
            <div class="pdf-inner" style="background-color: #fff;min-height: 100%;">
                <img class="pdf-image"
                     v-if="rendered"
                     :src="source.imgUrl" alt="pdf" @load="pageLoaded">
            </div>
        </template>
        <template v-else>
            <pdf class="pdf-inner" v-if="rendered"
                 :src="source.pdfUrl"
                 @page-loaded="pageLoaded"/>
        </template>
        <div class="sy-bg"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import pdf from '@suc/vue-pdf-copy';
import { PdfPageInfo } from '../utils/http';
import LoadingIcon from './LoadingIcon.vue';

@Component({
    components: {
        LoadingIcon,
        pdf,
    },
})
export default class PdfViewPage extends Vue {

    rendered = false;
    loaded = false;
    @Prop({
        default: () => ({
            width: 0,
            height: 0,
            pdfUrl: '',
        }),
    })
    source!: PdfPageInfo & { top: number | null, viewHeight: number | null };
    @Prop({default: false}) image!: boolean;
    // pdfStyle = {};

    $refs!: {
        view: HTMLElement
    };

    loadPdf() {
        this.rendered = true;
    }

    pageLoaded() {
        console.log(this.source.pageId + ' pageLoaded', this.loaded);
        this.loaded = true;
    }

    get pdfStyle() {
        if (this.source.viewHeight) {
            return {
                'height': this.source.viewHeight + 'px',
            };
        } else {
            let height;
            if (this.$refs.view && this.source.width && this.source.height) {
                const clientWidth = this.$refs.view.clientWidth;
                height = clientWidth * 0.8 / this.source.width * this.source.height;
            }
            return height
                ? {
                    'height': Math.ceil(height + 40) + 'px',
                }
                : {};
        }
    }

    onMenuClick(ev: Event) {
        ev.stopPropagation();
        ev.preventDefault();
    }
}
</script>

<style lang="scss" scoped>
.pdf-view-page {
    padding: 20px 0;
    position: relative;

    .pdf-inner {
        margin: 0 auto;
        width: 80%;
    }

    .pdf-image {
        width: 100%;
        //margin: 0 auto;
        height: auto;
        display: block;
    }
}

.loading-box {
    width: 80%;
    margin: 0 auto;
}

.sy-bg {
    background-image: url(http://oss.ybsjdyn.com/file/ceshi/book/reader/sy.png);
    position: absolute;
    //pointer-events: none;
    z-index: 1;
    width: 80%;
    height: calc(100% - 40px);
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
