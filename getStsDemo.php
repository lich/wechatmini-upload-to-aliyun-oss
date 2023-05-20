<?php
/**
 * Created by PhpStorm.
 * User: Lich
 * email: tech@lich.cn
 * Date: 2022/10/19
 * Time: 15:33
 */
namespace App\Common;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;
use AlibabaCloud\Client\AlibabaCloud;
class OssTools
{
    public function getSts()
    {
        //构建一个阿里云客户端，用于发起请求。
        //设置调用者（RAM用户或RAM角色）的AccessKey ID和AccessKey Secret。
        AlibabaCloud::accessKeyClient('填写你自己的key', '填写你自己的secret')
            ->regionId('oss-cn-beijing')//你当前oss所在的区域id
            ->asDefaultClient();
        //设置参数，发起请求。
        try {
            $result = AlibabaCloud::rpc()
                ->product('Sts')
                ->scheme('https') // https | http
                ->version('2015-04-01')
                ->action('AssumeRole')
                ->method('POST')
                ->host('sts.aliyuncs.com')
                ->options([
                    'query' => [
                        'RegionId' => 'oss-cn-beijing',//你当前oss所在的区域id
                        'RoleArn' => "填写你自己的ARN",
//                        'RoleSessionName' => "<RoleSessionName>",
                        'RoleSessionName' => "upload",
                    ],
                ])
                ->request();
            return $result->toArray();
        } catch (ClientException $e) {
            return false;
//            echo $e->getErrorMessage() . PHP_EOL;
        } catch (ServerException $e) {
            return false;
//            echo $e->getErrorMessage() . PHP_EOL;
        }
    }
}
