import { Utils } from '../Utils';
import { DisassembledOpcodeOutput } from '../types';

export class Disassembler {
  /**
   * @dev disassembles bytecode into EVM opcodes
   * @param bytecode: string
   * @return
   */
  public static disassemble(bytecode: string) {
    const properBytecode = Utils.prepBytecode(bytecode);

    if (!properBytecode) return null;
    const disassembly: DisassembledOpcodeOutput[] = [];

    for (let i = 0; i < properBytecode.length; i += 2) {
      const hex = properBytecode.substring(i, i + 2);
      const parsedOpcodeResult = Utils.parseBytecode(properBytecode, hex, i);

      disassembly.push(parsedOpcodeResult.opcodeRepresentation);

      i = parsedOpcodeResult.index;
    }

    return disassembly;
  }
}
