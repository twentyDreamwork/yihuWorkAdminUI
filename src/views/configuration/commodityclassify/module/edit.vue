<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="to"/>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" :dicts="dicts"/>
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      _this.form = {
        id: this.data.id,
        mainTitle: this.data.mainTitle,
        subTitle: this.data.subTitle,
        taobaoUrl: this.data.taobaoUrl,
        inventory: this.data.inventory,
        oldPrice: this.data.oldPrice,
        price: this.data.price,
        recommend: this.data.recommend,
        hot: this.data.hot,
        timerstart: this.data.timerstart,
        overtime: this.data.overtime,
        goodsImg: this.data.goodsImg
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
