export class Disassembler {
  /**
   * @dev sanitize & evaluate bytecode
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
}
