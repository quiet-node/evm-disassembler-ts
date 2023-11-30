# evm-disassembler-ts (WIP)

## Abstract

This tool performs static analysis on EVM bytecode to provide a higher level of abstraction for the bytecode than raw EVM operations.

## Get started

1. Clone the repo & install the project

```bash
git clone https://github.com/quiet-node/evm-disassembler-ts.git
cd evm-disassembler-ts
npm install
```

2. Run test

```bash
npm run test
```

## Basic Example Usage

```typescript
import { Disassembler } from './src/disassembler';

const BYTECODE = '6080604052603e80600f5f395ff3fe'; // or "0x6080604052603e80600f5f395ff3fe";

const disassembly = Disassembler.disassemble(BYTECODE);

console.log(disassembly);
```

The `console.log(disassembly)` will print out

```bash
[
  { index16: '0x0', hex: '60', mnemonic: 'PUSH1', operand: [ '80' ] },
  { index16: '0x4', hex: '60', mnemonic: 'PUSH1', operand: [ '40' ] },
  { index16: '0x8', hex: '52', mnemonic: 'MSTORE', operand: [] },
  { index16: '0xa', hex: '60', mnemonic: 'PUSH1', operand: [ '3e' ] },
  { index16: '0xe', hex: '80', mnemonic: 'DUP1', operand: [] },
  { index16: '0x10', hex: '60', mnemonic: 'PUSH1', operand: [ '0f' ] },
  { index16: '0x14', hex: '5f', mnemonic: 'PUSH0', operand: [] },
  { index16: '0x16', hex: '39', mnemonic: 'CODECOPY', operand: [] },
  { index16: '0x18', hex: '5f', mnemonic: 'PUSH0', operand: [] },
  { index16: '0x1a', hex: 'f3', mnemonic: 'RETURN', operand: [] },
  { index16: '0x1c', hex: 'fe', mnemonic: 'INVALID', operand: [] }
]
```
