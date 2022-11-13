// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { EthereumTransaction, EthereumLog } from "@subql/types-ethereum";
import { BigNumber } from "@ethersproject/bignumber";

import { HashSubmittedEvent, SubmitHash } from "../types";

// Setup types from ABI
type HashSubmittedEventArgs = [string, BigNumber, string, BigNumber] & {
  submitter: string;
  epochId: BigNumber;
  hash: string;
  timestamp: BigNumber
};
type SubmitHashCallArgs = [BigNumber, string] & {
  epochId: BigNumber;
  hash: string;
};

export async function handleLog(
  event: EthereumLog<HashSubmittedEventArgs>
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
  event: EthereumTransaction<SubmitHashCallArgs>
): Promise<void> {
  const approval = SubmitHash.create({
    id: event.hash,
    epochId: JSON.parse(event.args[0].toString()),
    hash: event.args[1],
    contractAddress: event.to,
  });

  await approval.save();
}
