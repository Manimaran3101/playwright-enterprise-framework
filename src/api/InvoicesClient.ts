import type { Invoice, Paginated } from '@data/types';
import { step } from '@utils/step';
import { BaseApiClient } from './BaseApiClient';

export class InvoicesClient extends BaseApiClient {
  @step('API: list my invoices')
  async list(): Promise<Paginated<Invoice>> {
    return this.send<Paginated<Invoice>>('get', '/invoices');
  }

  @step('API: get invoice')
  async get(id: string): Promise<Invoice> {
    return this.send<Invoice>('get', `/invoices/${id}`);
  }

  async findByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const { data } = await this.list();
    return data.find((i) => i.invoice_number === invoiceNumber);
  }
}
