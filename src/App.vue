<template>
    <pdf-reader :url="url" :image="true"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PdfReader from './components/PdfReader.vue';

@Component({
    components: {
        PdfReader,
    },
})
export default class App extends Vue {
    get url() {
        return `/api/record/pageAndCatalogInfo/getBookInfoByBookId?bookId=${this.bookId}`;
    };

    bookId = '9059068a22764683a3592a8299e43fa4';
}
</script>

<style lang="scss">
html, body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

* {
    box-sizing: border-box;
}
</style>
