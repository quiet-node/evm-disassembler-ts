# EVM Bytecode Disassmebler

A highly lightweight EVM bytecode disassembler, this tool conducts static analysis on Ethereum Virtual Machine (EVM) bytecode. Its purpose is to offer a higher level of abstraction for the bytecode compared to raw EVM operations.

Additionally, the tool can automatically detect whether there is IPFS or Swarm hash CBOR-encoded metadata at the end of the bytecode and exclude it during disassembly.

## Install the package

```bash
  npm install evm-disassembler-ts
```

## Basic Example Usage

```typescript
import { Disassembler } from 'evm-disassembler-ts';

const BYTECODE = '6080604052603e80600f5f395ff3fe'; // or "0x6080604052603e80600f5f395ff3fe";

const disassembly = Disassembler.disassemble(BYTECODE);

console.log(disassembly);
// expected output:
//  [
//    { index16: '0x0', hex: '60', mnemonic: 'PUSH1', operand: [ '80' ] },
//    { index16: '0x4', hex: '52', mnemonic: 'MSTORE', operand: [] },
//    { index16: '0x2', hex: '60', mnemonic: 'PUSH1', operand: [ '40' ] },
//    { index16: '0x5', hex: '60', mnemonic: 'PUSH1', operand: [ '3e' ] },
//    { index16: '0x7', hex: '80', mnemonic: 'DUP1', operand: [] },
//    { index16: '0x8', hex: '60', mnemonic: 'PUSH1', operand: [ '0f' ] },
//    { index16: '0xa', hex: '5f', mnemonic: 'PUSH0', operand: [] },
//    { index16: '0xb', hex: '39', mnemonic: 'CODECOPY', operand: [] },
//    { index16: '0xc', hex: '5f', mnemonic: 'PUSH0', operand: [] },
//    { index16: '0xd', hex: 'f3', mnemonic: 'RETURN', operand: [] },
//    { index16: '0xe', hex: 'fe', mnemonic: 'INVALID', operand: [] }
//  ]
```
