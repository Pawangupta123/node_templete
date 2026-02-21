import mongoose, { ClientSession } from 'mongoose';

/**
 * MongoDB Transaction Helper
 * Session management ka boilerplate ek function mein
 * Auto commit on success, auto abort on error, auto cleanup
 *
 * Usage:
 *   const result = await withTransaction(async (session) => {
 *     const payment = await PaymentModel.create([data], { session });
 *     await UserModel.updateOne({ _id: userId }, { $set: { plan } }, { session });
 *     return payment;
 *   });
 *
 * Note: MongoDB transactions require replica set (standalone mein nahi chalega)
 */
export async function withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
