import { expect } from 'chai';
import { Helpers } from '../../src/utils/helpers';
import { EVM_OPCODES } from '../../src/utils/evm_opcodes';
import { Disassembler } from '../../src/disassembler';
import { DISASSEMBLER_TESTING_ASSETS } from './assets/disassembler_test_assets';

describe('EVM Bytecode Disassembler Tests', () => {
  describe('Utility functions tests', () => {
    it('Should prepare a valid bytecode', () => {
      const BYTECODE = '  0x6080604052603e80600f5f395ff3fe ';
      const EXPECTED_SANITIZED_BYTECODE = '6080604052603e80600f5f395ff3fe';

      const sanitizedBytecode = Helpers.prepBytecode(BYTECODE);

      expect(sanitizedBytecode).to.eq(EXPECTED_SANITIZED_BYTECODE);
    });

    it('Should return null if bytecode has odd length', () => {
      const BYTECODE = '0x40F';

      expect(Helpers.prepBytecode(BYTECODE)).to.be.null;
    });

    it('Should get operands for opcodes in PUSH family', () => {
      const bytecode = '6380401abf2d5f'; // must be proper and clean bytecode
      const index = 0;
      const opcode = EVM_OPCODES.get(bytecode.substring(index, index + 2)); // PUSH4

      // @notice 63 = PUSH4 => this will push 4 bytes (4 * 2 letters) to the operands array.
      //         Therefore, offset will skip the first byte of the opcodes and 4 bytes of the operands
      const expectedOffset = index + 4 * 2;

      const operandObject = Helpers.getPushOperands(opcode!, bytecode, index);

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

      const result = Helpers.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(expectedOffset);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x2');
      expect(result.opcodeRepresentation.mnemonic).to.eq('PUSH4');
      expect(result.opcodeRepresentation.operand.join(' ')).to.eq(
        expectedOperand.join(' ')
      );
    });

    it('Should parse bytecode for opcodes that are NOT in PUSH family', () => {
      const bytecode = '6080604052'; // must be proper bytecode
      const index = 8;
      const byte = bytecode.substring(index, index + 2); // MSTORE

      const result = Helpers.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x4');
      expect(result.opcodeRepresentation.mnemonic).to.eq('MSTORE');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });

    it('Should parse bytecode for opcodes that are INVALID', () => {
      const bytecode = '60806040fe'; // must be proper bytecode
      const index = 8;
      const byte = bytecode.substring(index, index + 2); // Invalid opcode

      const result = Helpers.parseBytecode(bytecode, byte, index);

      expect(result.index).to.eq(index);
      expect(result.opcodeRepresentation.hex).to.eq(byte);
      expect(result.opcodeRepresentation.index16).to.eq('0x4');
      expect(result.opcodeRepresentation.mnemonic).to.eq('INVALID');
      expect(result.opcodeRepresentation.operand.length).to.eq(0);
    });

    it('Should remove CBOR-encoded metadata hash appended at the end of bytecode', () => {
      const BYTECODE =
        '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80636b06623714610038578063e69f19cd14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea26469706673582212203730408c8004d51639b6ff1e841d6944bb83c335c0fe79a602ee0066681b007664736f6c63430008150033';

      const EXPECTED_BYCODE =
        '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80636b06623714610038578063e69f19cd14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fe';

      const noMetadataBycode = Helpers.removeCBORMetadata(BYTECODE);

      expect(noMetadataBycode).to.eq(EXPECTED_BYCODE);
    });

    it('Should leave the bytecode as-is if there is no CBOR-encoded metadata', () => {
      const BYTECODE = '0x6080604052';

      const noMetadataBycode = Helpers.removeCBORMetadata(BYTECODE);

      expect(noMetadataBycode).to.eq(BYTECODE);
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
