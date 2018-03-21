<template>
  <div id="app">
    <!-- <div class="pc"> -->
      <el-menu theme="dark" :default-active="activeIndex"
        class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0" @click="setSubmission('SUBMIT')">MemData Editor</el-menu-item>
        <el-menu-item index="1" @click="setSubmission('CONFIG')">CONFIG</el-menu-item>
        <el-menu-item index="2" @click="setSubmission('SET')">SET</el-menu-item>
        <el-menu-item index="3" @click="setSubmission('GET')">GET</el-menu-item>
        <el-menu-item index="4" @click="setSubmission('INSERT')">INSERT</el-menu-item>
        <el-menu-item index="5" @click="setSubmission('UPDATE')">UPDATE</el-menu-item>
        <el-menu-item index="6" @click="setSubmission('FIND')">FIND</el-menu-item>
        <el-menu-item index="7" @click="setSubmission('DELETE')">DELETE</el-menu-item>
      </el-menu>
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="docHeader" name="1">
          <span v-html="docDetails">{{ docDetails }}</span><span v-show="showServerIP">{{ serverip }}</span>
        </el-collapse-item>
      </el-collapse>
      <div class="editor-container">
        <json-editor ref="editor" :onChange="onChange" v-on:server="receiveFromServer"
          :submitName="submitName" :showSubKey="showSubKey" :showSubmit="showSubmit" :json="jsonEditorVal"
          :showSet="showSet" v-on:setJSONEditor="setJSONEditor" v-on:serverip="receiveIP" serverip=""/>
        <div class="show-json">
          <el-button type="primary" @click="showJSON"> >> </el-button>
        </div>
        <editor v-model="ace" @init="editorInit" lang="json"
          theme="chrome" width="45%" height="70%">
        </editor>
      </div>
    <!-- </div> -->
    <!-- <div class="mobile">
      <mt-header fixed title="Memdata Editor"></mt-header>
      <mt-tabbar v-model="active" fixed>
        <mt-tab-item id="1">
          <img slot="icon" src="./assets/logo.png">
          编辑器
        </mt-tab-item>
        <mt-tab-item id="2">
          <img slot="icon" src="./assets/logo.png">
          返回值
        </mt-tab-item>
        <mt-tab-item id="3">
          <img slot="icon" src="./assets/logo.png">
          方法
        </mt-tab-item>
      </mt-tabbar>
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="1">
          <json-editor ref="editor" :onChange="onChange" v-on:server="receiveFromServer"
            :submitName="submitName" :showSubKey="showSubKey" :showSubmit="showSubmit" :json="jsonEditorVal"
            :showSet="showSet" v-on:setJSONEditor="setJSONEditor"/>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <editor v-model="ace" @init="editorInit" lang="json"
            theme="chrome">
          </editor>
          <div>{{ ace }}</div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <mt-picker :slots="slots" @change="getSlotValue"></mt-picker>
          <div class="doc">
            <h2>{{ docHeader }}</h2>
            <div v-html="docDetails">{{ docDetails }}</div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div> -->
  </div>
</template>

<script>
import JsonEditor from './components/JsonEditor'

export default {
  name: 'app',
  data () {
    return {
      jsonEditorVal: {},      // 绑定 JSONEditor 的值
      ace: '',                // 绑定 ace 编辑器的值
      activeIndex: '0',       // (Element UI) PC 端导航栏
      submitName: 'Submit',   // 绑定 submit 按钮
      showSubKey: false,      // 控制 subkey 输入框是否显示
      showSubmit: false,       // 控制 submit 区域是否显示
      activeNames: ['1'],     // (Element UI) 控制 collapse 的展开项
      docHeader: '',          // 说明文档的标题
      docDetails: '',         // 说明文档的内容
      jsonMidVal: {},         // 中间变量，存储 JSONEditor 的值
      // active: '1',            // (Mint UI) 显示的页面 Tab
      // slots: [                // (Mint UI) Picker 控件数据绑定
      //   {
      //     flex: 1,
      //     values: ['CONFIG', 'SET', 'GET', 'INSERT', 'UPDATE', 'FIND', 'DELETE'],
      //     className: 'slot1',
      //     textAlign: 'center'
      //   }
      // ],
      showSet: false,
      showServerIP: false,
      serverip: ''
    }
  },
  methods: {
    // 监听 JsonEditor.vue 中值的更改
    onChange (newVal) {
      this.jsonMidVal = newVal
    },
    editorInit: function () {
      require('../node_modules/brace/mode/html')
      require('../node_modules/brace/mode/json')
      require('../node_modules/brace/mode/javascript')
      require('../node_modules/brace/mode/less')
      require('../node_modules/brace/theme/chrome')
    },
    // JSONEditor 的值显示到 ace 编辑器中的方法
    showJSON () {
      this.ace = JSON.stringify(this.jsonMidVal, null, '\t')
    },
    // 监听 JsonEditor.vue 发出的 'server' 事件
    receiveFromServer (json) {
      this.ace = JSON.stringify(json, null, '\t')
    },
    // 监听更改 ip 的事件
    receiveIP (ip) {
      this.serverip = ip
    },
    // 监听 JsonEditor.vue 发出的 'setJSONEditor' 事件
    setJSONEditor (data) {
      var fields = []
      var values = []
      for (let key in data[0]) {
        fields.push(key)
      }
      values.push(fields)
      for (var i = 0; i < data.length; i++) {
        var value = []
        for (let key in data[i]) {
          value.push(data[i][key])
        }
        values.push(value)
      }
      this.jsonEditorVal = {
        format: 'json',
        version: 'v0001',
        data: values
      }
      this.ace = JSON.stringify(this.jsonEditorVal, null, '\t')
    },
    // 切换不同的 submit 方式
    setSubmission (method) {
      this.submitName = method
      // 当选中导航栏每个方法的时候修改页面的展示
      switch (method) {
        // 回到主页时
        case 'SUBMIT':
          this.docHeader = 'Memdata Editor'
          this.docDetails = '<h2>This is a tool to edit Memdata.</h2>'
          this.jsonEditorVal = {}
          this.showSubKey = false
          this.showSubmit = false
          this.showSet = false
          this.showServerIP = false
          break
        case 'GET':
          this.docHeader = method
          this.docDetails = `<h3>GET METHOD</h3>
                             <h4>通过key值取得数据，GET,key,{"fileds":{}}</h4>
                             【DEMO】GET,test_demo,{"fileds":{}}
                             <br> 若key里的数据类型为dict时，{"fields":[]},"fields"的值为key['data']里的各个subkey值
                             <br> 若key里的数据类型为list时，{"fields":[]},"fields"的值为list的索引值
                             <br> 若{"fields":[]}未填写，默认全返回key里的所有值
                            `
          this.jsonEditorVal = {
            fields: []
          }
          this.showSubKey = false
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = false
          break
        case 'SET':
          this.docHeader = method
          this.docDetails = `<h3>SET METHOD</h3>
                            通过key写入value数据，SET,key,value
                            <br>【DEMO】 SET,test_demo,{"version":"v00001","format":"json","data":[]}
                            <br> value的"data"里的数据类型为dict或list,且数据内容只支持dict类型的数据格式
                            <br> 【dict】 : {"data":[{},{},...]}
                            <br> 【list】 : {"data":{"subkey1":{},"subkey2":{},...}}
                            `
          this.jsonEditorVal = {
            format: 'json',
            version: 'v0001',
            data: []
          }
          this.showSubKey = false
          this.showSubmit = true
          this.showSet = true
          this.showServerIP = false
          break
        case 'INSERT':
          this.docHeader = method
          this.docDetails = `<h3>INSERT METHOD</h3>
                             向key对应的原数据里插入value, INSERT,key,{"subkey":{}}
                             <br> 若key里的数据类型为dict时，{"subkey":value},"subkey"的值为要往key['data']里插入的key值
                             <br>【DEMO1】INSERT,test_demo,{"subkey":{"id":23,"name":"wills"}}
                             <br> 若key里的数据类型为list时，{"subkey":value}，"subkey"的值为要往key['data']里插入的索引位置
                             <br>【DEMO2】INSERT,test_demo,{"1":{"id":23,"name":"wills"}}
                            `
          this.jsonEditorVal = {
            subkey: {}
          }
          this.showSubKey = false
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = false
          break
        case 'UPDATE':
          this.docHeader = method
          this.docDetails = `<h3>UPDATE METHOD</h3>
                            更新key对应数据里的subkey的数据，UPDATE,key,subkey,{"update":value} / {"set":value}
                            <br> 若key里的数据类型为dict时，关键词为update时，根据value更新subkey里的相应值；若关键词为set时，重新为subkey重新赋值。
                            <br>【DEMO1】UPDATE,test_demo,subkey,{"update":{"id":25,"name":"kris"}}
                            <br> 若key里的数据类型为list时，关键词为update时，根据value更新key数据里索引值为subkey的相应值；若关键词为set时，重新为索引值为subkey重新赋值。
                            <br> 【DEMO】UPDATE,test_demo,1,{"update":{"id":25,"name":"kris"}}
                            `
          this.jsonEditorVal = {
            set: {},
            update: {}
          }
          this.showSubKey = true
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = false
          break
        case 'DELETE':
          this.docHeader = method
          this.docDetails = `<h3>DELETE METHOD</h3>
                            删除数据，DEL,key,subkey
                            <br> 若key数据类型为dict时，删除key数据里subkey的数据
                            <br>【DEMO1】DEL,test_demo,test_sub_key
                            <br> 若key数据类型为list时，删除key数据里索引值为subkey的数据
                            <br>【DEMO1】DEL,test_demo,1
                            `
          this.jsonEditorVal = {}
          this.showSubKey = true
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = false
          break
        case 'FIND':
          this.docHeader = method
          this.docDetails = `<h3>FIND METHOD【暂时仅支持 and 与 or 独立组合条件】</h3>
                            通过查询条件读得数据，FIND,key,{"and":{}} / {"or":{}}
                            <br> 【各查询条件说明】
                            <br> 【等于】 ":", 例{"id":1},相当于查询条件为 where id = 1
                            <br> 【大于】"gt", 例{"id":{"gt":1}}, 相当于查询条件 where id > 1
                            <br> 【大于等于】"gte", 例{"id":{"gte":1}}, 相当于查询条件 where id >= 1
                            <br> 【小于】"lt", 例{"id":{"lt":10}}, 相当于查询条件 where id < 10
                            <br> 【小于等于】"lte", 例{"id":{"lte":10}}, 相当于查询条件 where id <= 10
                            <br> 【不等于】"ne", 例{"id":{"ne":1}}, 相当于查询条件 where id != 1
                            <br> 【DEMO】{"and":{"id":1,"name":"wills","age":{"gt":20} 相当于 where id = 1 and name = "wills" and age > 20
                            <br> 【DEMO】{"or":{"id":1,"name":"wills","age":{"gt":20} 相当于 where id = 1 or name = "wills" or age > 20
                            `
          this.jsonEditorVal = {
            and: {},
            or: {}
          }
          this.showSubKey = false
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = false
          break
        case 'CONFIG':
          this.docHeader = method
          this.docDetails = 'HOSTNAME CONFIG:配置MemData的主机地址, 现主机地址：'
          this.jsonEditorVal = {}
          this.showSubKey = false
          this.showSubmit = true
          this.showSet = false
          this.showServerIP = true
          break
      }
      this.jsonMidVal = this.jsonEditorVal
    },
    // 移动端 picker 值更改触发的 method
    // 改变 submit 方式
    getSlotValue (picker, val) {
      let method = val[0]
      this.submitName = method
      switch (method) {
        case 'GET':
          this.docHeader = method
          this.docDetails = `<h3>GET METHOD</h3>
                             <h4>通过key值取得数据，GET,key,{"fileds":{}}</h4>
                             【DEMO】GET,test_demo,{"fileds":{}}
                             <br> 若key里的数据类型为dict时，{"fields":[]},"fields"的值为key['data']里的各个subkey值
                             <br> 若key里的数据类型为list时，{"fields":[]},"fields"的值为list的索引值
                             <br> 若{"fields":[]}未填写，默认全返回key里的所有值
                            `
          this.jsonEditorVal = {
            fields: []
          }
          this.hidden = false
          this.showServerIP = false
          break
        case 'SET':
          this.docHeader = method
          this.docDetails = `<h3>SET METHOD</h3>
                            通过key写入value数据，SET,key,value
                            <br>【DEMO】 SET,test_demo,{"version":"v00001","format":"json","data":[]}
                            <br> value的"data"里的数据类型为dict或list,且数据内容只支持dict类型的数据格式
                            <br> 【dict】 : {"data":[{},{},...]}
                            <br> 【list】 : {"data":{"subkey1":{},"subkey2":{},...}}
                            `
          this.jsonEditorVal = {
            format: 'json',
            version: 'v0001',
            data: []
          }
          this.hidden = false
          this.showServerIP = false
          break
        case 'INSERT':
          this.docHeader = method
          this.docDetails = `<h3>INSERT METHOD</h3>
                             向key对应的原数据里插入value, INSERT,key,{"subkey":{}}
                             <br> 若key里的数据类型为dict时，{"subkey":value},"subkey"的值为要往key['data']里插入的key值
                             <br>【DEMO1】INSERT,test_demo,{"subkey":{"id":23,"name":"wills"}}
                             <br> 若key里的数据类型为list时，{"subkey":value}，"subkey"的值为要往key['data']里插入的索引位置
                             <br>【DEMO2】INSERT,test_demo,{"1":{"id":23,"name":"wills"}}
                            `
          this.jsonEditorVal = {
            subkey: {}
          }
          this.hidden = false
          this.showServerIP = false
          break
        case 'UPDATE':
          this.docHeader = method
          this.docDetails = `<h3>UPDATE METHOD</h3>
                            更新key对应数据里的subkey的数据，UPDATE,key,subkey,{"update":value} / {"set":value}
                            <br> 若key里的数据类型为dict时，关键词为update时，根据value更新subkey里的相应值；若关键词为set时，重新为subkey重新赋值。
                            <br>【DEMO1】UPDATE,test_demo,subkey,{"update":{"id":25,"name":"kris"}}
                            <br> 若key里的数据类型为list时，关键词为update时，根据value更新key数据里索引值为subkey的相应值；若关键词为set时，重新为索引值为subkey重新赋值。
                            <br> 【DEMO】UPDATE,test_demo,1,{"update":{"id":25,"name":"kris"}}
                            `
          this.jsonEditorVal = {
            set: {},
            update: {}
          }
          this.hidden = true
          this.showServerIP = false
          break
        case 'DELETE':
          this.docHeader = method
          this.docDetails = `<h3>DELETE METHOD</h3>
                            删除数据，DEL,key,subkey
                            <br> 若key数据类型为dict时，删除key数据里subkey的数据
                            <br>【DEMO1】DEL,test_demo,test_sub_key
                            <br> 若key数据类型为list时，删除key数据里索引值为subkey的数据
                            <br>【DEMO1】DEL,test_demo,1
                            `
          this.jsonEditorVal = {}
          this.hidden = true
          this.showServerIP = false
          break
        case 'FIND':
          this.docHeader = method
          this.docDetails = `<h3>FIND METHOD【暂时仅支持 and 与 or 独立组合条件】</h3>
                            通过查询条件读得数据，FIND,key,{"and":{}} / {"or":{}}
                            <br> 【各查询条件说明】
                            <br> 【等于】 ":", 例{"id":1},相当于查询条件为 where id = 1
                            <br> 【大于】"gt", 例{"id":{"gt":1}}, 相当于查询条件 where id > 1
                            <br> 【大于等于】"gte", 例{"id":{"gte":1}}, 相当于查询条件 where id >= 1
                            <br> 【小于】"lt", 例{"id":{"lt":10}}, 相当于查询条件 where id < 10
                            <br> 【小于等于】"lte", 例{"id":{"lte":10}}, 相当于查询条件 where id <= 10
                            <br> 【不等于】"ne", 例{"id":{"ne":1}}, 相当于查询条件 where id != 1
                            <br> 【DEMO】{"and":{"id":1,"name":"wills","age":{"gt":20} 相当于 where id = 1 and name = "wills" and age > 20
                            <br> 【DEMO】{"or":{"id":1,"name":"wills","age":{"gt":20} 相当于 where id = 1 or name = "wills" or age > 20
                            `
          this.jsonEditorVal = {
            and: {}
          }
          this.hidden = false
          this.showServerIP = false
          break
        case 'CONFIG':
          this.docHeader = method
          this.docDetails = 'HOSTNAME CONFIG:配置MemData的主机地址。现主机地址：'
          this.jsonEditorVal = {}
          this.hidden = false
          this.showServerIP = true
          this.serverip = localStorage.serverip
          break
      }
      this.jsonMidVal = this.jsonEditorVal
    }
  },
  // 组件加载（页面刷新时）调用
  mounted () {
    this.docHeader = 'Memdata Editor'
    this.docDetails = '<h2>This is a tool to edit Memdata.</h2>'
    this.showServerIP = false
  },
  components: {
    JsonEditor,
    editor: require('vue2-ace-editor')
  }
}
</script>

<style>
  /*.mobile, .pc {
    width: 100%;
    height: 100%;
  }*/
  /* PC 端样式 */
  /*@media screen and (min-device-width: 760px) {*/
    .mobile {
      display: none;
    }
    #app {
      height: 800px;
    }
    body {
      margin: 0;
      padding: 0;
    }
    .el-menu {
      width: 100%;
    }
    .editor-container {
      display: flex;
      flex-flow: row;
      height: 100%;
      justify-content: flex-start;
    }
    .ace_editor {
      margin-top: 8px;
      margin-right: 8px;
      flex: 16;
    }
    .show-json {
      flex: row;
      margin-top: 280px;
      margin-left: 16px;
      margin-right: 8px;
    }
    .documentation {
      height: 300px;
      font-family: "Microsoft YaHei";
    }
    .doc-header {
      font-size: 20px;
    }
  /*}*/
  /* 移动端样式 */
  /*@media screen and (max-device-width: 760px) {
    .pc {
      display: none;
    }
    .mobile {
      height: 100%;
    }
    #app {
      height: 100%;
    }
    html, body {
      height: 100%;
      overflow: hidden;
    }
    .mint-tab-container {
      height: 100%;
    }
    .mint-tab-container-wrap {
      height: 85%;
      padding-top: 36px;
    }
    .mint-tab-container-item {
      height: 90%;
    }
    .ace_editor {
      height: 65%;
      width: 100%;
      margin: 8px 8px 0 8px;
      z-index: -100;
    }
    .doc {
      text-align: center;
    }
    .picker {
      margin-top: 5%;
      margin-bottom: 24px;
    }
  }*/
</style>
