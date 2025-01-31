import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import type { PaymentProduct } from './dtos/paymentProduct';
import iSelic from './dtos/selic.dto';

@Injectable()
export class PagamentoService {
    currentSelic: iSelic | null

    constructor() {
        this.currentSelic = null
    }

    async paymentAndInstallment(data: PaymentProduct) {
        const selicVal = await this.getSelicHistory()

        if (!selicVal || typeof selicVal !== "number") {
            throw new HttpException('Selic value not available', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const { qtdeParcelas } = data.condicaoPagamento

        const installmentValue = Number(data.produto.valor) - Number(data.condicaoPagamento.valorEntrada)
        
        const installments = []

        if(!isNaN(installmentValue) && installmentValue <= 0){
            return installments //Não tem parcelas
        }

        const valueByInstallments = installmentValue / qtdeParcelas

        let j = 0 

        for(let i = 1; i <= qtdeParcelas; i++) {
            let val = valueByInstallments
            let tax = 0
            
            if(i > 6){
                val = this.calcSimpleFees(val, selicVal, ++j)
                tax = +selicVal.toFixed(2)
            }

            const installment = {"numeroParcela": i, "valor": val, "taxaJurosAoMes": tax}
            
            installments.push(installment)
        }

        return installments
    }

    private async getSelicHistory() {
        try {
            const getSelicHistory = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json")

            const selicHistoryJson = await getSelicHistory.json() as iSelic[]

            const currentSelicString = selicHistoryJson.at(-1)

            const currentSelic = +currentSelicString.valor

            return currentSelic
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message)
            }

            return false
        }
    }

    private calcSimpleFees(val: number, selic: number, time: number){
        const valueWithFees = +((val * ((1 + selic) ** time)).toFixed(2))
        return valueWithFees
    }

    // transformDataPayment(data: PaymentProduct){
    //     return {
            
    //     }
    // }
}
