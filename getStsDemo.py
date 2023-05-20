import oss2
from aliyunsdkcore import client
from aliyunsdkcore.request import CommonRequest
import json

class OSSHelper:
    @staticmethod
    def getSts():
        # 填写步骤1创建的RAM用户AccessKey。
        access_key_id = '填写你自己的key'
        access_key_secret =  '填写你自己的secret'
        oss_bucket = '填写你自己的bucket' #例如 lich-cn
        # role_Arn填写步骤3获取的角色ARN，例如acs:ram::175708322470****:role/ramtest。
        role_arn = '填写你自己的ARN'

        # 创建权限策略。
        # 仅允许对examplebucket执行上传（PutObject）和下载（GetObject）操作。
        # policy_text = '{"Version": "1", "Statement": [{"Action": ["oss:PutObject","oss:GetObject"], "Effect": "Allow", "Resource": ["acs:oss:*:*:{oss_bucket}/*"]}]}'

        clt = client.AcsClient(access_key_id, access_key_secret, '填写你自己的bucket所在的区域') # 例如cn-beijing
        request = CommonRequest(product="Sts", version='2015-04-01', action_name='AssumeRole')
        request.set_method('POST')
        request.set_protocol_type('https')
        request.add_query_param('RoleArn', role_arn)
        # 指定自定义角色会话名称，用来区分不同的令牌，例如填写为sessiontest。
        request.add_query_param('RoleSessionName', 'upload')
        # 指定临时访问凭证有效时间单位为秒，最小值为900，最大值为3600。
        request.add_query_param('DurationSeconds', '3000')
        # 如果policy为空，则RAM用户默认获得该角色下所有权限。如果有特殊权限控制要求，请参考上述policy_text设置。
        # request.add_query_param('Policy', policy_text)
        request.set_accept_format('JSON')

        body = clt.do_action_with_exception(request)

        # 使用RAM用户的AccessKey ID和AccessKey Secret向STS申请临时访问凭证。
        token = json.loads(oss2.to_unicode(body))
        # 打印STS返回的临时访问密钥（AccessKey ID和AccessKey Secret）、安全令牌（SecurityToken）以及临时访问凭证过期时间（Expiration）。
        return token
        print('AccessKeyId: '+token['Credentials']['AccessKeyId'])
        print('AccessKeySecret: '+token['Credentials']['AccessKeySecret'])
        print('SecurityToken: '+token['Credentials']['SecurityToken'])
        print('Expiration: '+token['Credentials']['Expiration'])