import { expect } from 'chai';
import { Utils } from '../../src/Utils';
import { EVM_OPCODES } from '../../src/evm_opcodes';
import { Disassembler } from '../../src/disassembler';
import { DISASSEMBLER_TESTING_ASSETS } from './assets/disassembler_test_assets';

describe('EVM Bytecode Disassembler Tests', () => {
  describe('Utility functions tests', () => {
    it('Should prepare a valid bytecode', () => {
      const BYTECODE = '  0x6080604052603e80600f5f395ff3fe ';
      const EXPECTED_SANITIZED_BYTECODE = '6080604052603e80600f5f395ff3fe';

      const sanitizedBytecode = Utils.prepBytecode(BYTECODE);

      expect(sanitizedBytecode).to.eq(EXPECTED_SANITIZED_BYTECODE);
    });

    it('Should return null if bytecode has odd length', () => {
      const BYTECODE = '0x40F';

      expect(Utils.prepBytecode(BYTECODE)).to.be.null;
    });

    it('Should get operands for opcodes in PUSH family', () => {
      const bytecode = '6380401abf2d5f'; // must be proper and clean bytecode
      const index = 0;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // PUSH4

      // @notice 63 = PUSH4 => this will push 4 bytes (4 * 2 letters) to the operands array.
      //         Therefore, offset will skip the first byte of the opcodes and 4 bytes of the operands
      const expectedOffset = index + 4 * 2;

      const operandObject = Utils.getPushOperands(opcode!, bytecode, index);

      const expectedOperand = ['80', '40', '1a', 'bf'];

      expect(operandObject.offset).to.eq(expectedOffset);
      expect(operandObject.operands.join(' ')).to.eq(expectedOperand.join(' '));
    });

    it('Should parse bytecode for opcodes in PUSH family', () => {
      const bytecode = '60406380401abf2d5f'; // must be proper bytecode
      const index = 4;
      const byte = bytecode.substring(index, index + 2); // PUSH4

      // @notice 63 = PUSH4 => this will push 4 bytes (4 * 2 letters) to the operands array.
      //         Therefore, offset will skip the first byte of the opcodes and 4 bytes of the operands
      const expectedOffset = index + 4 * 2;

      const expectedOperand = ['80', '40', '1a', 'bf'];

      const result = Utils.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(expectedOffset);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x4');
      expect(result.opcodeRepresentation.mnemonic).to.eq('PUSH4');
      expect(result.opcodeRepresentation.operand.join(' ')).to.eq(
        expectedOperand.join(' ')
      );
    });

    it('Should parse bytecode for opcodes that are NOT in PUSH family', () => {
      const bytecode = '6080604052'; // must be proper bytecode
      const index = 8;
      const byte = bytecode.substring(index, index + 2); // MSTORE

      const result = Utils.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x8');
      expect(result.opcodeRepresentation.mnemonic).to.eq('MSTORE');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });

    it('Should parse bytecode for opcodes that are INVALID', () => {
      const bytecode = '60806040fe'; // must be proper bytecode
      const index = 8;
      const byte = bytecode.substring(index, index + 2); // Invalid opcode

      const result = Utils.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x8');
      expect(result.opcodeRepresentation.mnemonic).to.eq('INVALID');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });
  });

  describe('Disassmebler tests', () => {
    it('Should disassemble a valid bytecode', () => {
      DISASSEMBLER_TESTING_ASSETS.forEach((asset) => {
        const disassembly = Disassembler.disassemble(asset.bytecode);

        for (let i = 0; i < disassembly!.length; i++) {
          expect(disassembly![i].index16).to.eq(
            asset.expectedDisassembly[i].index16
          );
          expect(disassembly![i].hex).to.eq(asset.expectedDisassembly[i].hex);
          expect(disassembly![i].mnemonic).to.eq(
            asset.expectedDisassembly[i].mnemonic
          );
          expect(disassembly![i].operand.join('')).to.eq(
            asset.expectedDisassembly[i].operand.join('')
          );
        }
      });
    });

    it('Should return null if bytecode is not valid', () => {
      const INVALID_BYTECODE = '0xabc';

      const disassembly = Disassembler.disassemble(INVALID_BYTECODE);

      expect(disassembly).to.be.null;
    });
  });
});
