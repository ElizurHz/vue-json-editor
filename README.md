# vue-json-editor
本 Web App 使用 Vue.js  构建，使用了 ace 的代码编辑器插件([https://github.com/chairuosen/vue2-ace-editor]()) 与 JSONEditor 插件 ([https://github.com/Adam-Jimenez/vue2-jsoneditor]())。

## 项目结构
- index.html  — Web App 主入口
- src — 组件
	- App.vue — 主组件
	- main.js
	- components
		- JsonEditor.vue — JSON 编辑器的组件
- dist — Webpack 构建生成的文件

## 本地部署方法
1. 安装 Node.js (版本 \>= 6.0.0) 
2. 从 Github Clone 项目
3. 使用终端(Terminal)进入项目根目录，安装依赖环境: `npm install`
4. 本机测试: `npm run dev`。之后浏览器会自动打开 [ http://localhost:8080 ]()，即可在本机运行。在同一局域网下的设备可访问[ http://本机的局域网IP:8080 ]()访问（如手机）。
5. （可选）构建: `npm run build`。构建完的文件在根目录的 dist 文件夹中，必须在 HTTP 服务器中打开。

## 已知 bug
ace 插件在移动端无法正常显示，已用普通div+字符串取代。











