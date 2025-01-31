import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';

import type { PaymentProduct } from './dtos/paymentProduct';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }

  @Post()
  async PaymentPost(@Body() dataPayment: PaymentProduct) {
    return await this.pagamentoService.paymentAndInstallment(dataPayment)
  }
}
