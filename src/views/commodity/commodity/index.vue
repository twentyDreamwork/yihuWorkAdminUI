<template>
  <div class="app-container">
    <eHeader :query="query" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" max-width="250">
      <el-table-column prop="goodsImg" label="商品图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" width="80" height="80">
        </template>
      </el-table-column>
      <el-table-column prop="mainTitle" label="商品标题" width="120"/>
      <el-table-column prop="subTitle" label="商品副标题" width="150"/>
      <el-table-column :show-overflow-tooltip="true" prop="taobaoUrl" label="淘宝路径" width="150"/>
      <el-table-column prop="inventory" label="库存" align="center" width="80"/>
      <el-table-column prop="buy" label="购买人数" align="center" width="80"/>
      <el-table-column prop="recommend" label="是否推荐" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recommend === 1" >推荐</el-tag>
          <el-tag v-if="scope.row.recommend === 0" >未推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="oldPrice" label="原价" align="center" width="80"/>
      <el-table-column prop="price" label="价格" align="center" width="80"/>
      <el-table-column prop="hot" label="热门火爆" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hot === 1" >热门</el-tag>
          <el-tag v-if="scope.row.hot === 0" >正常</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="time" label="限时(小时)" align="center" width="80"/> -->
      <el-table-column :show-overflow-tooltip="true" prop="timerstart" label="活动时间" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.timerstart) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="overtime" label="结束时间" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.overtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-permission="['ADMIN','USERJOB_ALL','USERJOB_EDIT']" :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
          <el-popover
            v-permission="['ADMIN','USERJOB_ALL','USERJOB_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/commodity/commodity'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false, sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('job_status')
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'http://192.168.3.5:8081/store/getgoodslist'
      const sort = 'sort,asc'
      this.params = { pageno: this.page, size: this.size, sort: sort }
      const query = this.query
      const value = query.value
      const enabled = query.enabled
      if (value) { this.params['name'] = value }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
