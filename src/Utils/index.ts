import { Disassembler } from '../disassembler';
import { EvmOpcode } from '../types';

export class Utils {
  /**
   * @dev check if an opcode is a PUSH opcode
   * @param opcode
   * @returns
   */
  public static isPushOp(opcode: EvmOpcode): boolean {
    return opcode.mnemonic.includes('PUSH');
  }

  /**
   * @dev sanitizes & evaluates bytecode
   * @param bytecode
   * @returns string
   */
  public static prepBytecode(bytecode: string): string | null {
    // trim bytecode
    bytecode = bytecode.trim();

    // check if bytecode has valid length
    if (bytecode.length % 2 !== 0) return null;

    // omit 0x prefix
    if (bytecode.startsWith('0x')) {
      bytecode = bytecode.substring(2);
    }

    // return trimmed and lower cased bytecode
    return bytecode.toLocaleLowerCase();
  }

  /**
   * @dev retrieves the operands for opcodes in PUSH family
   * @param opcode
   * @param bytecode
   * @param index
   * @returns string[]
   */
  public static getPushOperands(
    opcode: EvmOpcode,
    bytecode: string,
    index: number
  ) {
    const mnemonic = opcode.mnemonic;

    const operandNum = parseInt(mnemonic[mnemonic.length - 1]);

    // @notice the opcode will push `operandNum` bytes (`operandNum` * 2 letters) to the operands array.
    //         Therefore, offset will skip the first byte of the opcodes and `operandNum` bytes of the operands
    const offset = index + operandNum * 2;

    const operandString = bytecode.substring(index + 2, offset + 2);

    let operands = [];

    for (let i = 0; i < operandString.length; i += 2) {
      operands.push(`0x${operandString.substring(i, i + 2)}`);
    }

    return { offset, operands };
  }

  /**
   * @dev parses byte to get opcode
   * @param bytecode: string
   * @param opcode: EvmOpcode | null
   * @param index: number
   * @return [index: string, mnemonic: string, operands: string]
   */
  public static parseBytecode(
    bytecode: string,
    opcode: EvmOpcode | undefined,
    index: number
  ) {
    const index16 = `0x${index.toString(16)}`;

    if (!opcode) {
      return {
        index,
        opcodeRepresentation: { index16, mnemonic: 'INVALID', operand: [] },
      };
    }

    if (Utils.isPushOp(opcode)) {
      const result = Utils.getPushOperands(opcode, bytecode, index);

      return {
        index: result.offset,
        opcodeRepresentation: {
          index16,
          mnemonic: opcode.mnemonic,
          operand: result.operands,
        },
      };
    } else {
      return {
        index,
        opcodeRepresentation: {
          index16,
          mnemonic: opcode.mnemonic,
          operand: [],
        },
      };
    }
  }
}
