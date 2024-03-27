import { Injectable } from '@nestjs/common';

import { CreateCsvDto } from './dto/create-csv.dto';
import { ICreateCSV } from './interfaces/create-csv.interface';

@Injectable()
export class CsvService {
  async create(data: CreateCsvDto[]): Promise<ICreateCSV> {
    const formatDate = (value: any) => {
      if (
        typeof value === 'number' &&
        !isNaN(value) &&
        Number.isInteger(value)
      ) {
        const utcDays = Math.floor(value - 25569);
        const utcValue = utcDays * 86400;
        const dateInfo = new Date(utcValue * 1000);
        return dateInfo.toLocaleDateString();
      }
      return value;
    };

    const processedData = data.map((row: any) => {
      const newRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        if (['data_inicio', 'data_status', 'proximo_ciclo'].includes(key)) {
          newRow[key] = formatDate(value);
        } else {
          newRow[key] = value;
        }
      }
      return newRow;
    });

    const totalMRR = await this.processMRR(processedData);

    const churnRate = await this.processChurnRate(processedData);

    const totalARR = await this.processARR(processedData);

    const activeClients = await this.processActiveClientsByYear(processedData);

    const canceledClients =
      await this.processCanceledClientsByYear(processedData);

    const returnData: ICreateCSV = {
      mrr: `R$ ${totalMRR}`,
      arr: `R$ ${totalARR}`,
      churn: `${churnRate} %`,
      active_clients: {
        2022: activeClients[2022],
        2023: activeClients[2023],
      },
      canceled_clients: {
        2022: canceledClients[2022],
        2023: canceledClients[2023],
      },
    };

    return returnData;
  }

  private processARR(processedData: CreateCsvDto[]): number {
    const filteredData = processedData.filter((row: any) => {
      return (
        row.status === 'Ativa' && parseInt(row.cobrada_a_cada_x_dias) === 365
      );
    });

    let totalMRR = 0;
    filteredData.forEach((row: any) => {
      totalMRR += parseFloat(row.valor);
    });

    return parseFloat(totalMRR.toFixed(2));
  }

  private processMRR(processedData: CreateCsvDto[]): number {
    const filteredData = processedData.filter((row: any) => {
      return (
        row.status === 'Ativa' && parseInt(row.cobrada_a_cada_x_dias) === 30
      );
    });

    let totalMRR = 0;
    filteredData.forEach((row: any) => {
      totalMRR += parseFloat(row.valor);
    });

    return parseFloat(totalMRR.toFixed(2));
  }

  private processChurnRate(processedData: CreateCsvDto[]): string {
    const canceledSubscriptions = processedData.filter((row: any) => {
      return (
        (row.status === 'Cancelada' || row.status === 'Trial cancelado') &&
        row.data_cancelamento !== null
      );
    });

    const totalCustomers = processedData.length;
    const churnedCustomers = canceledSubscriptions.length;

    const churnRate = ((churnedCustomers / totalCustomers) * 100).toFixed(2);

    return churnRate;
  }

  private processActiveClientsByYear(processedData: CreateCsvDto[]): any {
    const activeClients2022 = processedData.filter((row: any) => {
      const startDate = new Date(row.data_inicio);
      return startDate.getFullYear() === 2022 && row.status === 'Ativa';
    }).length;

    const activeClients2023 = processedData.filter((row: any) => {
      const startDate = new Date(row.data_inicio);
      return startDate.getFullYear() === 2023 && row.status === 'Ativa';
    }).length;

    return {
      2022: activeClients2022,
      2023: activeClients2023,
    };
  }

  private processCanceledClientsByYear(processedData: CreateCsvDto[]): any {
    const activeClients2022 = processedData.filter((row: any) => {
      const startDate = new Date(row.data_inicio);
      return startDate.getFullYear() === 2022 && row.status === 'Ativa';
    }).length;

    const activeClients2023 = processedData.filter((row: any) => {
      const startDate = new Date(row.data_inicio);
      return (
        startDate.getFullYear() === 2023 &&
        (row.status === 'Cancelada' || row.status === 'Trial cancelado')
      );
    }).length;

    return {
      2022: activeClients2022,
      2023: activeClients2023,
    };
  }
}
