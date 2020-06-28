import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  type: 'income' | 'outcome',
  title: string,
  category: string,
  value: number
}


class CreateTransactionService {
  public async execute({ title, category, type, value }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)

    let balance = await transactionsRepository.getBalance()

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Outcome value is greater than the balance')
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category }
    })

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(transactionCategory)
    }

    const transaction = transactionsRepository.create({
      category_id: transactionCategory.id,
      title,
      type,
      value
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
