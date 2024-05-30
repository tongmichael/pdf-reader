<template>
    <div class="pdf-reader" ref="reader">
        <div class="pdf-header">
            <div class="pdf-header-left">
                <div class="header-img-button" :class="{active:type==='menu'}"
                     @click="type='menu'">
                    <img src="../assets/工具栏-导航.png" alt="">
                </div>
                <div class="header-img-button" :class="{active:type==='bookmark'}"
                     @click="type='bookmark'">
                    <img src="../assets/工具栏-书签.png" alt="">
                </div>
            </div>
            <div class="pdf-header-right">
                <pdf-header-page v-model="currentPage" :total="totalPage"
                                 @change-page="scrollToPage"/>
                <div class="pdf-header-title">
                    {{ bookName }}
                </div>
                <div class="pdf-header-buttons"></div>
            </div>
        </div>
        <div class="pdf-content">
            <div class="pdf-left-menu" v-if="type==='menu'">
                <div class="pdf-header-menu">
                    <div :class="{active:menuType==='menu'}" @click="menuType='menu'">目录</div>
                    <span></span>
                    <div :class="{active:menuType==='thumbnail'}" @click="menuType='thumbnail'">缩略图</div>
                </div>
                <div class="pdf-left-content" v-if="menuType==='menu'">
                    <pdf-menu :tree="pdfCatalogList" @change="onMenuChange"/>
                </div>
                <div class="pdf-left-content" v-if="menuType==='thumbnail'">
                    <pdf-thumbnail :data="pdfList" @change="onThumbnailChange"/>
                </div>
            </div>
            <div class="pdf-left-menu" v-else>
                <slot name="bookmark-left-menu"></slot>
            </div>
            <div class="pdf-right-view" ref="view">
                <div class="pdf-view-content"
                     ref="content"
                     @scroll.passive="onScroll">
                    <pdf-view-page
                        :image="image"
                        :ref="item.pageId"
                        v-for="item in pdfList"
                        :key="item.pageId"
                        :id="item.pageId"
                        :source="item"/>
                    <div class="pdf-total-loading" v-if="loading">
                        <loading-icon/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { http, PdfBook, PdfCatalog, PdfPageInfo } from '../utils/http';
import PdfMenu from './PdfMenu.vue';
import PdfViewPage from './PdfViewPage.vue';
import PdfThumbnail from './PdfThumbnail.vue';
//@ts-ignore
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import LoadingIcon from './LoadingIcon.vue';
import PdfHeaderPage from './PdfHeaderPage.vue';
import ResizeObserver from 'resize-observer-polyfill';
import minBy from 'lodash/minBy';
import sortBy from 'lodash/sortBy';

@Component({
    components: {
        PdfHeaderPage,
        PdfViewPage,
        PdfMenu,
        PdfThumbnail,
        DynamicScroller,
        DynamicScrollerItem,
        LoadingIcon,
    },
})
export default class PdfReader extends Vue {
    @Prop() url!: string;
    @Prop({default: false}) image!: boolean;

    pdfList: Array<PdfPageInfo & { top: number | null, viewHeight: number | null }> = [];
    showPdfList: PdfPageInfo[] = [];
    pdfCatalogList: PdfCatalog[] = [];
    type: 'menu' | 'bookmark' = 'menu';
    menuType: 'menu' | 'thumbnail' = 'menu';
    bookName = '';
    buffer = 500;
    loading = true;
    totalPage = 0;
    currentPage = 0;
    viewWidth = 0;

    async initPdfInfo() {
        const {data} = await http.get<PdfBook>(this.url);
        this.pdfList = data.pageInfoList.map(pdf => ({...pdf, top: null, viewHeight: null}));
        this.bookName = data.bookName;
        this.pdfCatalogList = data.childCatalogList;
        this.totalPage = data.totalPage;
        if (this.totalPage) {
            this.currentPage = 1;
        }
        this.$nextTick(() => {
            this.initPdfView();
            this.loading = false;
        });
    }

    initPdfView() {
        let num = 0, width = 0, height = 0;
        if (this.$refs.view) {
            const view = (this as any).$refs.view.querySelector('.pdf-view-page:first-child');
            this.viewWidth = width = view.clientWidth;
            height = (this.$refs.view as HTMLElement).clientHeight;
        } else {
            console.error('no pdf reader view');
        }
        if (width && height) {
            for (let i = 0; i < this.pdfList.length; i++) {
                const pdf = this.pdfList[i];
                const last = this.pdfList[i - 1];
                const pdfViewHeight = Math.ceil(width * 0.8 / pdf.width * pdf.height) + 40;
                pdf.viewHeight = pdfViewHeight;
                pdf.top = i
                    ? (last.top || 0) + pdfViewHeight
                    : 0;
                if (pdfViewHeight > this.buffer) {
                    this.buffer = pdfViewHeight;
                }
                if (num < 3 || pdf.top < 2 * height) {
                    this.loadPdf(pdf.pageId);
                    num = num + 1;
                }
            }
        }
    }

    loadPdf(pageId: string) {
        this.$nextTick(() => {
            setTimeout(() => {
                (this as any).$refs[pageId][0].loadPdf();
            });
        });
    }

    onMenuChange(catalog: PdfCatalog) {
        this.currentPage = catalog.pageNum;
        const index = this.pdfList.findIndex(it => it.pageNum === catalog.pageNum);
        const pdf = this.pdfList[index];
        const top = index === this.pdfList.length - 1
            ? pdf.top!
            : pdf.top! + Math.ceil(this.viewWidth * 0.8 / pdf.width * (pdf.height - catalog.position));
        // console.log('onMenuChange', index, catalog, pdf, top);
        if (top) {
            this.scrollerToPx(top);
        }
    }

    onThumbnailChange(event: { data: PdfPageInfo, index: number }) {
        if (this.pdfList[event.index].pageId === event.data.pageId) {
            this.currentPage = event.data.pageNum;
            this.scrollToIndex(event.index);
        }
    }

    scrollToPage(page: number) {
        this.scrollToIndex(page - 1);
    }

    scrollToIndex(index: number) {
        this.scrollerToPx(this.pdfList[index].top!);
    }

    scrollerToPx(top: number) {
        const content = this.$refs.content as HTMLElement;
        content.scrollTop = top + 1;
    }

    onScroll!: Function;

    @Watch('url', {immediate: true})
    onChange() {
        if (this.url) this.initPdfInfo();
    }

    scrollLoadPdf(target: Element) {
        const tops = sortBy(
            this.pdfList.map(pdf => ({
                pageNum: pdf.pageNum,
                pageId: pdf.pageId,
                top: pdf.top !== null
                    ? Math.abs(pdf.top - target.scrollTop)
                    : Infinity,
            })),
            item => item.top,
        );
        for (let i = 0; i < 3; i++) {
            if (tops[i]) {
                this.loadPdf(tops[i].pageId);
            }
        }
        const minPdf = tops[0];
        minPdf?.pageNum && (this.currentPage = minPdf?.pageNum);
    }

    created() {
        this.onScroll = debounce((event: { target: Element }) => {
            this.scrollLoadPdf(event.target);
        }, 200);
    }

    mounted() {
        const onResize = debounce((entry: ResizeObserverEntry) => {
            // const {left, top, width, height} = entry.contentRect;
            // console.log('Element:', entry.target);
            // console.log(`Element's size: ${width}px x ${height}px`);
            // console.log(`Element's paddings: ${top}px ; ${left}px`);
            setTimeout(() => {
                this.initPdfView();
                // this.scrollLoadPdf(this.$refs.content as HTMLDivElement);
                this.scrollToPage(this.currentPage);
            });
        }, 500);
        const ro = new ResizeObserver((entries, observer) => {
            if (entries?.[0].target === this.$refs.reader) {
                onResize(entries[0]);
            }
        });
        ro.observe(this.$refs.reader as HTMLDivElement);
    }
}
</script>

<style lang="scss" scoped>
.pdf-reader {
    height: 100%;
}

.pdf-header {
    height: 64px;
    background-color: #202127;
    display: flex;
}

.pdf-header-title {
    color: #ffffff;
    line-height: 64px;
    align-items: center;
}

.pdf-header-left {
    width: 14%;
    display: flex;
    align-items: center;
}

.pdf-header-right {
    width: calc(86% - 1px);
}

.header-img-button {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    opacity: 0.5;
    margin-left: 20px;
    cursor: pointer;
    border: solid 1px transparent;

    &.active {
        opacity: 1;
        background: #171717;
        border: solid 1px #111111;
    }
}

.pdf-header-buttons {
    float: right;
}

.pdf-header-title {
    width: 100%;
    text-align: center;
    padding: 0 340px;
}

.pdf-content {
    display: flex;
    height: calc(100% - 65px);
}

.pdf-total-loading {
    width: 80%;
    margin: 0 auto;
    height: 100%;
    position: relative;

    ::v-deep .loading-box {
        background: transparent;
    }
}

.pdf-left-menu {
    width: 14%;
    height: 100%;
    background-color: #272930;
}

.pdf-header-menu {
    height: 40px;
    border-bottom: solid 1px rgba(#ffffff, 0.15);
    display: flex;
    line-height: 40px;
    align-items: center;
    justify-content: center;
    position: relative;

    > div {
        color: rgba(#fff, 0.45);
        text-align: center;
        width: 49.999%;
        cursor: pointer;

        &.active {
            color: rgba(#fff, 0.8);
        }
    }

    > span {
        display: inline-block;
        width: 1px;
        height: 24px;
        background: #ffffff;
        opacity: 0.21;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.pdf-left-content {
    height: calc(100% - 40px);
    color: #fff;
}

.pdf-right-view {
    width: 86%;
    height: 100%;
    background-color: rgba(#000000, 0.4);
}

.pdf-view-content {
    height: 100%;
    overflow: auto;
}
</style>
