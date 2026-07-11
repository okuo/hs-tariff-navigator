import { isExtensionMessage } from '../messages';

describe('isExtensionMessage', () => {
  it('既知のメッセージ種別を受け入れる', () => {
    expect(isExtensionMessage({ type: 'GET_CURRENT_URL' })).toBe(true);
    expect(isExtensionMessage({
      type: 'HS_CODE_CLICKED',
      hsCode: '010121',
      context: null,
    })).toBe(true);
  });

  it('未知の種別と不正なpayloadを拒否する', () => {
    expect(isExtensionMessage({ type: 'UNKNOWN' })).toBe(false);
    expect(isExtensionMessage({ type: 'HS_CODE_CLICKED' })).toBe(false);
    expect(isExtensionMessage(null)).toBe(false);
  });
});
