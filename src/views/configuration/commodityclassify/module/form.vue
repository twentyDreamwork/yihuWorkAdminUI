<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '添加分类' : '编辑分类'" width="900px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="分类名" prop="classifyName">
        <el-input v-model="form.classifyName" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input-number v-model.number="form.priority" :min="0" :max="9999" controls-position="right" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="描述" prop="parentId">
        <el-input v-model="form.description" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentId">
        <treeselect v-model="form.parentId" :options="classify" style="width: 460px;" placeholder="选择上级分类" />
        <!-- <el-input v-model="form.parentId" style="width: 270px;"/> -->
      </el-form-item>
      <el-form-item label="是否启用" prop="status" style="width: 370px;">
        <el-radio-group v-model="form.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停止</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item> -->
      <!-- <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
        </el-col>
      </el-form-item> -->
      <!-- <el-form-item label="活动时间" style="width: 800px;">
        <el-date-picker
          :picker-options="pickerOptions2"
          v-model="value4"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right" />
      </el-form-item> -->
      <!-- <el-form-item label="结束时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="选择时间" style="width: 100%;" />
        </el-col>
      </el-form-item> -->
      <el-form-item prop="icons" label="图标">
        <el-input v-model="form.icons" type="hidden" />
      </el-form-item>
      <el-form-item >
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          action="http://127.0.0.1:8081/upload/fileUpload"
          list-type="picture-card">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getDepts, getClassifyTree } from '@/api/classify/classify'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      multiple: false,
      limit: 1,
      loading: false, dialog: false, depts: [], deptId: null, classify: [],
      form: {
        id: '',
        classifyName: '',
        createTime: '',
        creater: '',
        priority: 0,
        depth: '',
        description: '',
        keywords: '',
        parentId: '',
        status: '0',
        title: '',
        updateTime: '',
        updater: '',
        icons: ''
      },
      rules: {
        // name: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        // sort: [
        //   { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        // ]
      },
      // 时间
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value4: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.deptId = null
      this.form = {
        id: '',
        name: '',
        sort: 999,
        enabled: 'true',
        createTime: '',
        dept: { id: '' }
      }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.icons = res.result
    },
    getClassify() {
      getClassifyTree().then(res => {
        this.classify = []
        const classify = { id: 0, label: '顶级分类', children: [] }
        classify.children = res
        this.classify.push(classify)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
