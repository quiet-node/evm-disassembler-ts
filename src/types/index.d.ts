export interface EvmOpcode {
  mnemonic: string;
  operand: number;
}

export interface DisassembledOpcodeOutput {
  index16: string;
  hex: string;
  mnemonic: string;
  operand: string[];
}
