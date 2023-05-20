
// API-HOST
var host = 'http://wechatmini.lich.cn/api/v1';

var config = {

    service: {
        host,
        // 阿里云Bucket外网域名-可前往阿里云oss控制台查看
        AliyunOssHost: 'https://lich-cn.oss-cn-beijing.aliyuncs.com',
        // 自己的接口地址
        getAliyunSts:  `${host}/aliyun/sts/get`
    }

}