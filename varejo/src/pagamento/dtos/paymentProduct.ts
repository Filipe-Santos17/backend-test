import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

class Produto {
    @IsNumber()
    @IsNotEmpty()
    codigo: number
    
    @IsString()
    @IsNotEmpty()
    nome: string

    @IsNumber()
    @IsNotEmpty()
    valor: number
}

class CondicaoPagamento {
    @IsNumber()
    @IsNotEmpty()
    valorEntrada: number
    
    @IsNumber()
    @IsNotEmpty()
    qtdeParcelas: number
}

export class PaymentProduct {
    produto: Produto
    condicaoPagamento: CondicaoPagamento
}