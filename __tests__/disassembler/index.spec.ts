import { expect } from 'chai';
import { Disassembler } from '../../src/disassembler';

describe('EVM Bytecode Disassembler Tests', () => {
  const EXPECTED_SANITIZED_BYTECODE =
    '6080604052603e80600f5f395ff3fe60806040525f80fdfea2646970667358221220d8c7d282abb0ffe5ffaa3ade3e8405fff7c89ef4a3da325e2c9ea1c09924b7c264736f6c63430008150033';

  it('Should prepare a valid bytecode', () => {
    const BYTECODE =
      '  0x6080604052603e80600f5f395ff3fe60806040525f80fdfea2646970667358221220d8c7d282abb0ffe5ffaa3ade3e8405fff7c89ef4a3da325e2c9ea1c09924b7c264736f6c63430008150033 ';

    const sanitizedBytecode = Disassembler.prepBytecode(BYTECODE);

    expect(sanitizedBytecode).to.eq(EXPECTED_SANITIZED_BYTECODE);
  });

  it('Should return null if bytecode has odd length', () => {
    const BYTECODE = '0x40F';

    expect(Disassembler.prepBytecode(BYTECODE)).to.be.null;
  });
});
