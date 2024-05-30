<template>
    <div class="pdf-header-page">
        <input type="number" :value="value" class="current-page" @input="onInput">
        <div class="page-count">
            <span>{{ value }}</span><span>&nbsp;/&nbsp;</span><span>{{ total }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import debounce from 'lodash/debounce';

@Component
export default class PdfHeaderPage extends Vue {
    @Prop({default: 0}) total!: number;
    @Prop({default: 1}) value!: number;

    onInput!: Function;

    created() {
        this.onInput = debounce(
            (ev: Event) => {
                const value = parseFloat((ev.target as HTMLInputElement).value);
                if (!isNaN(value) && value > 0 && value <= this.total) {
                    this.$emit('change-page', value);
                }
            },
            500,
        );
    }
}
</script>

<style lang="scss" scoped>
.pdf-header-page {
    width: 200px;
    float: left;
    height: 64px;
    display: flex;
    align-items: center;
    color: rgba(#ffffff, 0.6);
    font-size: 16px;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[ type= "number" ] {
        -moz-appearance: textfield;
    }

    .current-page {
        width: 72px;
        height: 32px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        border: solid 1px rgba(255, 255, 255, 0.1);
        font-size: 16px;
        color: #ffffff;
        padding: 0 8px;
    }

    .page-count {
        padding-left: 12px;
    }
}
</style>