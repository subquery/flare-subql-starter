import { FlareTransaction, FlareLog, FlareBlock } from "@subql/types-flare";
import { BigNumber } from "@ethersproject/bignumber";
import { HashSubmittedEvent, SubmitHash } from "../types";

// Setup types from ABI
type HashSubmittedEventArgs = [string, BigNumber, string, BigNumber] & {
  submitter: string;
  epochId: BigNumber;
  hash: string;
  timestamp: BigNumber;
};

type SubmitHashCallArgs = [BigNumber, string] & {
  epochId: BigNumber;
  hash: string;
};

/*
export async function handleBlock(block: FlareBlock): Promise<void> {
  // do something with each and every block
}
*/

export async function handleLog(
  event: FlareLog<HashSubmittedEventArgs>
): Promise<void> {
  const transaction = HashSubmittedEvent.create({
    id: event.transactionHash,
    submitter: event.args.submitter,
    epochId: event.args.epochId.toBigInt(),
    hash: event.args.hash,
    timestamp: event.args.timestamp.toBigInt(),
    contractAddress: event.address,
  });

  await transaction.save();
}

export async function handleTransaction(
  event: FlareTransaction<SubmitHashCallArgs>
): Promise<void> {
  const approval = SubmitHash.create({
    id: event.hash,
    epochId: JSON.parse(event.args[0].toString()),
    hash: event.args[1],
    contractAddress: event.to,
  });

  await approval.save();
}
