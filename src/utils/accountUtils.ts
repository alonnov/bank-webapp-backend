import { bankingConfig } from '../config/config'
import { userService, accountService, transactionService } from '../services/serviceContainer';
import { AccountPageData } from '../types/responseTypes'

export const createAccountPageData = async (userId: string): Promise<AccountPageData> => {
  const user = await userService.findByAccountId(userId);
  if (!user) throw new Error('User not found');

  const account = await accountService.findByUserId(userId);
  if (!account) throw new Error('Account not found');

  const recentTransactions = await transactionService.getTransactionsForUser(
    userId,
    bankingConfig.transactionsPerPage
  );

  const transactionsWithDirection = recentTransactions.map(tx => ({
    ...tx,
    isIncoming: tx.recipient === userId
  }));

  return {
    user: { first_name: user.first_name },
    account: { balance: account.balance, status: account.status },
    recentTransactions: transactionsWithDirection
  };
};
