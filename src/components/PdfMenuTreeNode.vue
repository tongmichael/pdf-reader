<template>
    <div class="tree-node">
        <div class="node-item">
            <div class="node-icon" v-if="node[children].length" :class="{active}" @click="active=!active">
                <img src="../assets/箭头-icon.png" alt="">
            </div>
            <div class="node-text pdf-menu-nowrap" @click="clickNode">
                {{ node[text] }}
            </div>
        </div>
        <div class="child-node" v-show="active">
            <pdf-menu-tree-node v-for="item in node[children]"
                                :key="item[keyId]"
                                :node="item"
                                :text="text"
                                :key-id="keyId"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'PdfMenuTreeNode',
    components: {
        // PdfMenuTreeNode,
    },
})
export default class PdfMenuTreeNode extends Vue {
    name = 'PdfMenuTreeNode';
    @Prop({default: () => ({})}) node!: any;
    @Prop({default: 'catalogName'}) text!: string;
    @Prop({default: 'catalogId'}) keyId!: string;
    @Prop({default: 'childCatalogList'}) children!: string;
    @Inject('pdfMenu') menu!: any;
    active = true;

    clickNode() {
        this.menu?.()?.clickNode?.(this.node);
    }
}
</script>

<style lang="scss" scoped>
.node-text {
    cursor: pointer;
    line-height: 30px;

    &:hover {
        color: #4690ff;
    }
}

.node-item {
    display: flex;
    align-items: center;

    .node-icon {
        width: 16px;
        height: 16px;
        transform: rotate(180deg);
        cursor: pointer;

        &.active {
            transform: rotate(0);
        }
    }

    .node-text {
        padding-left: 4px;
    }
}

.child-node {
    padding-left: 20px;
}

.pdf-menu-nowrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
