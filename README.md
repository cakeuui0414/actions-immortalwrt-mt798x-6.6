# 🖥️ ImmortalWrt 24.10 (6.6 内核) 多设备固件

&gt; 基于 padavanonly/immortalwrt-mt798x-24.10，支持 **Cudy TR3000 v1** / **CMCC RAX3000M** / **H3C NX30 Pro**

---

## 📦 支持设备

| 设备 | 芯片 | 内存 | 状态 |
|------|------|------|------|
| 🟢 **Cudy TR3000 v1** | MT7981 | 256MB | ✅ 稳定 |
| 🟢 **CMCC RAX3000M** | MT7981 | 256MB | ✅ 稳定 |
| 🟢 **H3C NX30 Pro** | MT7981 | 256MB | ✅ 稳定 |

---

## ⚡ 固件特点

- 🧹 **纯净简洁** — 无多余预装，追随源码更新
- 🚀 **闭源硬件加速** — MTK 网络加速驱动
- 📦 **插件即装即用** — 按需选择，不臃肿

---

## 🔌 预装插件

| 插件 | 说明 |
|------|------|
| 🌐 **PassWall2** | 代理插件 |
| 💾 **USB 支持** | 移动硬盘 + USB-Net 网卡 |
| 📂 **网络共享** | ksmbd 文件共享 |
| ⬇️ **Aria2 下载** | 移动硬盘根目录新建 `aria2` 文件夹即可运行 |
| ⚡ **MTK 硬件加速** | 网络流量硬件卸载 |

---

## 🌐 网络信息

| 项目 | 默认值 |
|------|--------|
| 🔗 登录地址 | `10.0.0.1` |
| 🔑 登录密码 | 无 |
| 📶 WiFi 名称 | `immortalwrt-2.4G` / `immortalwrt-5G` |
| 📶 WiFi 密码 | 无 |
| 🐧 内核版本 | 6.6 |

---

## 🔧 刷机说明

### 🟢 Cudy TR3000 v1

&gt; 使用 **mod-112m** 刷入（新版 256MB 不适用）

📎 [Cudy TR3000 v1 中文三分区 DHCP Uboot 第二版](https://www.right.com.cn/forum/thread-8415351-1-1.html)

### 🟢 CMCC RAX3000M

📎 [RAX3000M 刷机教程](https://www.cnblogs.com/mianfeijiaocheng/p/19412069)

### 🟢 H3C NX30 Pro

📎 [NX30 Pro 刷机教程](https://www.cnblogs.com/gloves7/p/18628961)

&gt; ⚠️ 刷机前请备份原厂固件，操作有风险，请谨慎操作

---

## 🙏 感谢

- ☁️ [Microsoft Azure](https://azure.microsoft.com)
- 🏗️ [GitHub Actions](https://github.com/features/actions)
- 💻 [padavanonly](https://github.com/padavanonly/immortalwrt-mt798x-6.6)
- 🔧 [VIKINGYFY](https://github.com/VIKINGYFY/OpenWRT-CI)
- 📋 [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)
- 🚀 [softprops/action-gh-release](https://github.com/softprops/action-gh-release)

---

## 📄 License

[MIT](https://github.com/P3TERX/Actions-OpenWrt/blob/main/LICENSE) © [**P3TERX**](https://p3terx.com)
