export default mint;

import {mintSRC20} from './core/utils/minting/src20/index';

async function mint(toAddress: string, changeAddress: string, tick: string, feeRate: number, amt: string) {
    return await mintSRC20({toAddress, changeAddress, feeRate, tick, amt});
}