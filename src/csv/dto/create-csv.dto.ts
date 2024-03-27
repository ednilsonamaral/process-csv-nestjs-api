export class CreateCsvDto {
  qtd_cobrancas: number;
  cobrada_a_cada_x_dias: number;
  data_inicio: number;
  status: string;
  data_status: number;
  data_cancelamento?: number;
  valor: string;
  proximo_ciclo: number;
  id_assinante: string;
}
