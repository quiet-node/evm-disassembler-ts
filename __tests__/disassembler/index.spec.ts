import { expect } from 'chai';
import { Utils } from '../../src/Utils';
import { EVM_OPCODES } from '../../src/evm_opcodes';

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
      const bytecode = '6380401abf2d5f'; // must be proper bytecode
      const index = 0;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // PUSH4

      // @notice 63 = PUSH4 => this will push 4 bytes (4 * 2 letters) to the operands array.
      //         Therefore, offset will skip the first byte of the opcodes and 4 bytes of the operands
      const expectedOffset = index + 4 * 2;

      const operandObject = Utils.getPushOperands(opcode!, bytecode, index);

      const expectedOperand = ['0x80', '0x40', '0x1a', '0xbf'];

      expect(operandObject.offset).to.eq(expectedOffset);
      expect(operandObject.operands.join(' ')).to.eq(expectedOperand.join(' '));
    });

    it('Should parse bytecode for opcodes in PUSH family', () => {
      const bytecode = '60406380401abf2d5f'; // must be proper bytecode
      const index = 4;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // PUSH4

      // @notice 63 = PUSH4 => this will push 4 bytes (4 * 2 letters) to the operands array.
      //         Therefore, offset will skip the first byte of the opcodes and 4 bytes of the operands
      const expectedOffset = index + 4 * 2;

      const expectedOperand = ['0x80', '0x40', '0x1a', '0xbf'];

      const result = Utils.parseBytecode(bytecode, opcode, index);

      expect(result.index).to.eq(expectedOffset);
      expect(result.opcodeRepresentation.index16).to.eq('0x4');
      expect(result.opcodeRepresentation.mnemonic).to.eq('PUSH4');
      expect(result.opcodeRepresentation.operand.join(' ')).to.eq(
        expectedOperand.join(' ')
      );
    });

    it('Should parse bytecode for opcodes that are NOT in PUSH family', () => {
      const bytecode = '6080604052'; // must be proper bytecode
      const index = 8;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // MSTORE

      const result = Utils.parseBytecode(bytecode, opcode, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.index16).to.eq('0x8');
      expect(result.opcodeRepresentation.mnemonic).to.eq('MSTORE');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });

    it('Should parse bytecode for opcodes that are INVALID', () => {
      const bytecode = '60806040fe'; // must be proper bytecode
      const index = 8;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // Invalid opcode

      const result = Utils.parseBytecode(bytecode, opcode, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.index16).to.eq('0x8');
      expect(result.opcodeRepresentation.mnemonic).to.eq('INVALID');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });
  });
});
