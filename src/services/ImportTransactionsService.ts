import csvParse from 'csv-parse'
import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

interface ImportedTransaction {
  type: 'income' | 'outcome',
  title: string,
  category: string,
  value: number
}

class ImportTransactionsService {
  async execute(rawCsvString: string): Promise<Transaction[]> {
    const transactions: Transaction[] = []

    const importedTransactions: ImportedTransaction[] = []

    const createTransaction = new CreateTransactionService()

    const csvParser = csvParse({
      ltrim: true,
      rtrim: true,
      columns: true
    })

    csvParser.on('data', (transaction: ImportedTransaction) => {
      importedTransactions.push(transaction)
    });

    csvParser.write(rawCsvString)
    csvParser.end()

    await new Promise(resolve => { csvParser.on('end', resolve) })


    for (let { title, category, type, value } of importedTransactions) {
      let transaction = await createTransaction.execute({ title, category, type, value })
      transactions.push(transaction)
    }

    return transactions
  }
}

export default ImportTransactionsService;
