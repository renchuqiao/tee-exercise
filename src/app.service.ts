import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import * as abi from './abi/nft.json';

require('dotenv').config();


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async redeem(nftId: string): Promise<string> {
    const privateKey = `${process.env.PRIVATE_KEY}`;
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`${process.env.RPC_URL}`),
    );
    const contract = new web3.eth.Contract(
      abi,
      '0xAA875A983746F2A5e9F7ECcDC1BC988Ca7cE4035',
    );
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const tx = contract.methods.redeem(
      web3.utils.toWei(nftId, 'wei'),
      'you need to exercise',
      web3.utils.toWei('0', 'wei'),
    );
    const gas = await tx.estimateGas({
      from: account.address,
    });

    const raw_tx = {
      from: account.address,
      to: '0xAA875A983746F2A5e9F7ECcDC1BC988Ca7cE4035',
      data: tx.encodeABI(),
      gas: gas,
      chainId: 8453,
      maxPriorityFeePerGas: await web3.eth.getGasPrice(),
      maxFeePerGas: (await web3.eth.getGasPrice()) + BigInt(1000000000),
    };


    const signed_tx = await web3.eth.accounts.signTransaction(
      raw_tx,
      account.privateKey,
    );
    console.log(signed_tx);

    const tx_hash = await web3.eth
      .sendSignedTransaction(signed_tx.rawTransaction)
      .catch((err) => {
        console.log(err);
      });

    return 'ok';
  }
}
