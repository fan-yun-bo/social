import { Body, Controller, Post } from '@nestjs/common';

@Controller('pay/wechat')
export class PayController {
  @Post('prepay')
  prepay(@Body() body: { orderNo: string }) {
    return { mock: true, orderNo: body.orderNo, message: '微信支付参数待接入商户号后替换' };
  }

  @Post('notify')
  notify(@Body() body: unknown) {
    return { code: 'SUCCESS', message: '已接收支付回调', body };
  }
}
