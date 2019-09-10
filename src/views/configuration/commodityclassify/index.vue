<template>
  <div class="app-container">
    <eHeader :query="query" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" max-width="250">
      <el-table-column prop="icons" label="图标" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.icons" width="80" height="80">
        </template>
      </el-table-column>
      <el-table-column prop="classifyName" label="分类名" width="120"/>
      <el-table-column prop="title" label="标题" width="150"/>
      <el-table-column prop="parentId" label="上级分类" width="120"/>
      <el-table-column prop="depth" label="层数" align="center" width="120"/>
      <el-table-column prop="priority" label="优先级" align="center" width="120"/>
      <el-table-column prop="status" label="是否启用" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" >启用</el-tag>
          <el-tag v-if="scope.row.status === 0" >停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="120"/>
      <el-table-column prop="updateTime" label="更新时间" align="center" width="120"/>
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
import { del } from '@/api/classify/classify'
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
      this.url = 'http://127.0.0.1:8081/store/classify/page'
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
