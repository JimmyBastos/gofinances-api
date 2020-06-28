import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const calculateTransactionsBalance = async (type: 'income' | 'outcome'): Promise<number> => {
      let { value } = await this.createQueryBuilder('transactions')
        .select('SUM(transactions.value)', 'value')
        .where({ type: type })
        .getRawOne();

      return Number(value)
    }

    const income = await calculateTransactionsBalance('income')

    const outcome = await calculateTransactionsBalance('outcome')

    const total = income - outcome

    return {
      income,
      outcome,
      total
    }
  }
}

export default TransactionsRepository;
