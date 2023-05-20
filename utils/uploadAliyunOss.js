var config = require('../config')
import crypto from './crypto-js';
import Base64 from './base64';

/**
 * 
 * @param {*} tmp_url 微信临时文件地址
 * @param {*} prefix  oss文件名前缀
 * @param {*} fileName oss文件名
 * @param {*} filePath oss文件目录
 */

export function upload_image(tmp_url, prefix = 'default', fileName = null, filePath = 'photo') {
    return new Promise((resolve, reject) => {
        wx.request({
            // 获取阿里云临时令牌-sts
            url: config.service.getAliyunSts,
            success(res) {
                if (res.data.code == 200) {
                    wx.showLoading({
                        title: '上传中...',
                        mask: true
                    })
                    // 这里根据自己接口返回的格式进行获取数据，最后都是取Credentials与Expiration
                    let stsCredentials = res.data.data.Credentials
                    const policyText = {
                        expiration: stsCredentials.Expiration, // policy过期时间。根据自己接口返回的格式进行获取数据-Expiration
                        conditions: [
                            // 限制上传大小。
                            ["content-length-range", 0, 1024 * 1024 * 1024],
                        ],
                    };

                    // policy必须为base64的string。
                    const policy = Base64.encode(JSON.stringify(policyText))
    
                    // 生成signature
                    let signature = crypto.enc.Base64.stringify(crypto.HmacSHA1(policy, stsCredentials.AccessKeySecret))

                    // 加入时间戳-以免文件名重复
                    let unix_time = String(Date.parse(new Date()) / 1000)

                    //获取最后一个.的位置
                    var file_index = tmp_url.lastIndexOf(".");

                    //获取文件后缀
                    var file_ext = tmp_url.substring(file_index + 1);

                    fileName = filePath + '/' + prefix + '_' + fileName + '_' + unix_time + '.' + file_ext

                    wx.uploadFile({
                        url: config.service.AliyunOssHost,
                        filePath: tmp_url,
                        name: 'file',
                        formData: {
                            key: fileName, //存放图片的位置及文件名
                            policy,
                            OSSAccessKeyId: stsCredentials.AccessKeyId,
                            signature,
                            'x-oss-security-token': stsCredentials.SecurityToken,
                            success_action_status: 200, // 自定义成功返回的http状态码，默认为204
                        },
                        success(result) {
                            if (result.statusCode == 200) {
                                // 最终的文件地址
                                let url = config.service.AliyunOssHost + '/' + fileName
                                resolve(url)
                            } else {
                                resolve(false)
                            }
                        },
                        fail: function (fail) {
                            resolve(false)
                        },
                        complete: function (res) {
                            // 不管成功或失败都关闭showLoading
                            wx.hideLoading();
                        }
                    })
                } else {
                    resolve(false)
                }

            }
        })
    });
}

module.exports = {
    upload_image: upload_image,
}