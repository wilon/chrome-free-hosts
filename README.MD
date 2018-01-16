
```diff
+ 此 repo 不再维护，推荐免费 VPN —— 蓝灯
- 输入我的邀请码 YMD8TTG 来获得三个月的蓝灯专业版！立即下载 https://github.com/getlantern/forum
```

# Chrome Free Hosts

Chrome插件，自动更新本机host为 [googlehosts/hosts](https://github.com/googlehosts/hosts) 的最新可用的google hosts文件；

**注意: 原hosts文件被覆盖，请提前备份**，您可以使用 [Host Switch Plus](https://chrome.google.com/webstore/detail/host-switch-plus/bopepoejgapmihklfepohbilpkcdoaeo) 管理切换域名

## 安装

下载 crx 安装：[chrome-free-hosts.crx](https://raw.githubusercontent.com/wilon/chrome-free-hosts/master/chrome-free-hosts.crx)

或源码安装：`git clone https://github.com/wilon/chrome-free-hosts.git`，打开 [Chrome 扩展管理](chrome://extensions/)，点击*加载已解压的扩展*，选择文件夹`chrome-free-hosts`

## 使用

Chrome打开 [chrome://apps/](chrome://apps/)，点击 *Free Host* 应用，设置 host 文件位置，您可能需要更改权限

> 附：[各平台 hosts 位置](https://github.com/racaljk/hosts/wiki/各平台-hosts-文件位置)

##  更改 hosts 文件权限

##### · Windows

右键文件 hosts 并找到“属性” -> “安全”，然后选择你登陆的用户名，最后点击编辑，勾选“写入”即可。

##### · MacOS/Linux

打开 terminal，执行`sudo chmod -R 777 /etc/hosts`

------
此项目需 [googlehosts/hosts](https://github.com/googlehosts/hosts) 项目支持
