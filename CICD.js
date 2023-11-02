const { deploy, deployBackup, rollback } = require('gtxy-sftp')
// 配置信息
const config = {
  // 服务器登录信息
  sftpConfig: {
    host: '192.168.140.108',
    port: '10030',
    username: 'polarday',
    password: 'Polar^Test@2023'
  },
  // 本地需要上传的文件
  uploadFile: './build',
  // 服务器路径
  remotePath: `/home/polarday/h5-retail/dist`,
  // 服务器备份路径
  backupFolder: `/home/polarday/h5-retail/backup`,
  // 作者
  author: 'CICD'
}
// 获取命令行参数，确定要执行的操作
const command = process.argv[2]
if (command === 'deploy') {
  // 部署
  deploy(config)
} else if (command === 'deployBackup') {
  // 部署并备份
  deployBackup(config)
} else if (command === 'rollback') {
  // 回滚最近一次
  rollback(config)
} else {
  console.log('请在命令行中输入正确的指令：deploy 或 deployBackup 或 rollback')
}