<template>
  <div class="jsoneditor-wrapper">
    <div ref="jsoneditor" id="jsoneditor"></div>
    <div class="submission" v-show="this.showSubmit">
      <el-input v-model="key" placeholder="KEY"></el-input>
      <div class="hidden" v-show="this.showSubKey">
        <el-input v-model="subkey" placeholder="SUBKEY"></el-input>
      </div>
      <el-button class="submit-info" type="primary" @click="submit">{{ this.submitName }}</el-button>
      <div class="set-hidden" v-show="this.showSet">
        <vue-xlsx-table @on-select-file="handleSelectedFile">Select a xlsx file</vue-xlsx-table>
      </div>
    </div>
    <!-- <div class="submission-mobile" v-show="this.showSubmit">
      <mt-field label="Key" placeholder="KEY" v-model="key"></mt-field>
      <div class="hidden" v-show="this.showSubKey">
        <mt-field label="Sub-Key" placeholder="SUBKEY" v-model="subkey"></mt-field>
      </div>
      <mt-button class="submit-info" type="primary" @click="submit">{{ this.submitName }}</mt-button>
      <div class="set-hidden" v-show="this.showSet">
        <vue-xlsx-table @on-select-file="handleSelectedFile">Select a xlsx file</vue-xlsx-table>
      </div>
    </div> -->
  </div>
</template>

<script>

import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.js'
import 'jsoneditor/dist/jsoneditor.min.css'
import _ from 'lodash'
import axios from 'axios'

export default {
  name: 'json-editor',
  data () {
    return {
      editor: null,
      key: '',
      subkey: '',
      serverip: ''
    }
  },
  props: {
    json: {
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onChange: {
      type: Function
    },
    submitName: {
      type: String,
      required: true
    },
    showSubKey: {
      type: Boolean
    },
    showSubmit: {
      type: Boolean
    },
    showSet: {
      type: Boolean
    },
    serverip: {
      type: String,
      required: true
    }
  },
  watch: {
    json: {
      handler (newJson) {
        if (this.editor) {
          this.editor.set(newJson)
        }
      },
      deep: true
    }
  },
  methods: {
    _onChange (e) {
      if (this.onChange && this.editor) {
        this.onChange(this.editor.get())
      }
    },
    handleSelectedFile (convertedData) {
      // 取工作表的名字
      // console.log(this.$children[3].workbook.SheetNames)
      this.$alert(JSON.stringify(convertedData.body), '数据', {
        confirmButtonText: '确定',
        callback: action => {
          this.$confirm('是否将数据导入 JSONEditor 和 ace?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('setJSONEditor', convertedData.body)
            this.$message({
              type: 'success',
              message: '导入成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导入'
            })
          })
        }
      })
    },
    // 导航栏选中不同的方法时改变按钮点击调用的方法
    submit (e) {
      switch (this.submitName) {
        case 'GET':
          // console.log('GET')
          // 判断数据类型是否正确
          if (!this.key) {
            this.$alert('Key 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          // 拼接 post 请求所需要的数据
          let getData = 'A=GET,' + this.key
          getData += ',' + JSON.stringify(this.editor.get())
          // 向服务器发出 post 请求
          axios.post(this.serverip, getData).then(res => {
            // console.log(res)
            // emit 一个事件，向父组件传服务器的返回数据
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'SET':
          // console.log('SET')
          // var data = this.editor.get().data
          if (!this.key) {
            this.$alert('Key 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          // if (data instanceof Array) {
          //   for (var i = 0; i < data.length; i++) {
          //     if (!(data[i] instanceof Object)) {
          //       this.$alert('数据格式错误!', '警告', {
          //         confirmButtonText: '确定',
          //         type: 'warning'
          //       })
          //       return
          //     }
          //   }
          // } else if (data instanceof Object) {
          //   for (var key in data) {
          //     if (!(data[key] instanceof Object)) {
          //       this.$alert('数据格式错误!', '警告', {
          //         confirmButtonText: '确定',
          //         type: 'warning'
          //       })
          //       return
          //     }
          //   }
          // } else {
          //   this.$alert('数据格式错误!', '警告', {
          //     confirmButtonText: '确定',
          //     type: 'warning'
          //   })
          //   return
          // }
          let setData = 'A=SET,' + this.key
          setData += ',' + JSON.stringify(this.editor.get())
          // console.log(setData)
          axios.post(this.serverip, setData).then(res => {
            // console.log(res)
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'INSERT':
          // console.log('INSERT')
          if (!this.key) {
            this.$alert('Key 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          let insertData = 'A=INSERT,' + this.key
          insertData += ',' + JSON.stringify(this.editor.get())
          // console.log(insertData)
          axios.post(this.serverip, insertData).then(res => {
            // console.log(res)
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'UPDATE':
          // console.log('UPDATE')
          if (!this.key || !this.subkey) {
            this.$alert('Key 和 Subkey 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          let updateKey = 'A=UPDATE,' + this.key + ',' + this.subkey
          updateKey += ',' + JSON.stringify(this.editor.get())
          // console.log(insertData)
          axios.post(this.serverip, updateKey).then(res => {
            // console.log(res)
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'DELETE':
          // console.log('DELETE')
          if (!this.key || !this.subkey) {
            this.$alert('Key 和 Subkey 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          let del = 'A=DEL,' + this.key + ',' + this.subkey
          // console.log(del)
          axios.post(this.serverip, del).then(res => {
            // console.log(res)
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'FIND':
          // console.log('FIND')
          if (!this.key) {
            this.$alert('Key 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          let findData = 'A=FIND,' + this.key
          findData += ',' + JSON.stringify(this.editor.get())
          // console.log(findData)
          axios.post(this.serverip, findData).then(res => {
            // console.log(res)
            this.$emit('server', res.data)
          }).catch(error => {
            alert(error)
          })
          break
        case 'CONFIG':
          // console.log('CONFIG')
          if (!this.key) {
            this.$alert('Key 不能为空!', '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return
          }
          // console.log('previous ip: ' + this.serverip)
          // 从 localStorage 中调取 IP
          if (localStorage) {
            localStorage.serverip = this.key
            this.serverip = localStorage.serverip
          } else {
            this.serverip = this.key
          }
          this.$emit('serverip', this.serverip)
          // console.log('current ip: ' + this.serverip)
          break
      }
    }
  },
  mounted () {
    const container = this.$refs.jsoneditor
    const options = _.extend({
      onChange: this._onChange
    }, this.options)
    this.editor = new JSONEditor(container, options)
    this.editor.set(this.json)
    // 加载时将 IP 存储在浏览器 localStorage 中
    // 若浏览器不支持 localStorage 则直接赋值给 Vue 变量
    if (localStorage) {
      localStorage.serverip = this.props.serverip
      this.serverip = localStorage.serverip
    } else {
      this.serverip = this.props.serverip
    }
    this.$emit('serverip', this.serverip)
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  }
}
</script>

<style>
  /*@media screen and (min-device-width: 760px) {*/
    .jsoneditor-wrapper {
      height: 100%;
      flex: 16;
    }
    #jsoneditor {
      width: 100%;
      height: 70%;
      margin: 8px 8px 8px 8px;
    }
    .submission-mobile {
      display: none;
    }
    .submission {
      margin-left: 8px;
      margin-right: -8px;
      margin-top: 16px;
      width: 100%;
      margin-bottom: 8px;
    }
    .submission .el-button {
      float: right;
    }
    .submission .el-input {
      margin-bottom: 8px;
    }
    .set-hidden {
      float: right;
      margin-top: 4px;
      margin-right: 8px;
    }
  /*}*/
  /*@media screen and (max-device-width: 760px) {
    .jsoneditor-wrapper {
      height: 65%;
      padding-right: 16px;
    }
    #jsoneditor {
      width: 100%;
      height: 100%;
      margin: 8px 8px 8px 8px;
    }
    .submission {
      display: none;
    }
    .submission-mobile {
      margin-left: 8px;
      margin-right: -8px;
      margin-top: 16px;
      width: 100%;
      margin-bottom: 8px;
    }
    .submission-mobile .mint-button {
      float: right;
    }
    .submission-mobile .mint-field {
      margin-bottom: 8px;
    }
    .mint-button {
      width: 100%;
    }
  }*/
</style>
