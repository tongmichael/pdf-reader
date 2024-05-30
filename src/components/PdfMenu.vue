<template>
    <div class="pdf-menu">
        <tree-node v-for="node in tree"
                   :key="node[keyId]"
                   :node="node"
                   :text="text"
                   :children="children"
                   :key-id="keyId"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Provide, Vue } from 'vue-property-decorator';
import { PdfCatalog } from '../utils/http';
import TreeNode from './PdfMenuTreeNode.vue';

@Component({
    components: {
        TreeNode,
    },
})
export default class PdfMenu extends Vue {
    @Prop() tree!: PdfCatalog[];
    @Prop({default: 'catalogName'}) text!: string;
    @Prop({default: 'catalogId'}) keyId!: string;
    @Prop({default: 'childCatalogList'}) children!: string;

    @Provide('pdfMenu') menu() {
        return this;
    }

    clickNode(catalog: PdfCatalog) {
        this.$emit('change', catalog);
    }

}
</script>

<style lang="scss" scoped>
::v-deep .tree-node.selected > .tree-content {
    background: transparent;
}

.pdf-menu {
    padding: 24px;
    color: rgba(#ffffff, 0.8);
    overflow: auto;
    height: 100%;
}
</style>