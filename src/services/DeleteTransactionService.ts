import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  transaction_id: string
}

class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    try {
      const transactionsRepository = getCustomRepository(
        TransactionsRepository
      )

      await transactionsRepository.delete(
        transaction_id
      )
    } catch (error) {
      throw new AppError('Transaction not found!', 404)
    }
  }
}

export default DeleteTransactionService;
