import { test, fc } from '@fast-check/vitest';
import { ImageURL } from '../../src/entities/url';

const DEFAULT_IMAGE_URL = 'https://i.ibb.co/ZHDSnj4/foo.jpg';
const hasScheme = (value: string) => /^[a-z][a-z0-9+.-]*:/i.test(value);

describe('entities/url (propriedades)', () => {
  afterEach(() => {
    // Teardown
    vi.restoreAllMocks();
  });

  test.prop([fc.webUrl()])('deve aceitar qualquer URL http ou https e manter o valor original', url => {
    // Arrange
    const input = url;

    // Act
    const imageUrl = new ImageURL(input);

    // Assert
    expect(imageUrl.isValid).toBe(true);
    expect(imageUrl.url).toBe(input);
  });

  test.prop([fc.string().filter(value => !hasScheme(value))])(
    'deve rejeitar qualquer texto sem protocolo e usar a URL padrão',
    text => {
      // Arrange
      const input = text;

      // Act
      const imageUrl = new ImageURL(input);

      // Assert
      expect(imageUrl.isValid).toBe(false);
      expect(imageUrl.url).toBe(DEFAULT_IMAGE_URL);
    }
  );

  test.prop([fc.constantFrom('ftp', 'file', 'javascript', 'mailto', 'data'), fc.string()])(
    'deve rejeitar qualquer protocolo diferente de http e https',
    (scheme, rest) => {
      // Arrange
      const input = `${scheme}:${rest}`;

      // Act
      const imageUrl = new ImageURL(input);

      // Assert
      expect(imageUrl.isValid).toBe(false);
      expect(imageUrl.url).toBe(DEFAULT_IMAGE_URL);
    }
  );

  test.prop([fc.string()])('deve ser idempotente: criar uma ImageURL a partir da url de outra mantém a url', text => {
    // Arrange
    const first = new ImageURL(text);

    // Act
    const second = new ImageURL(first.url);

    // Assert
    expect(second.url).toBe(first.url);
    expect(second.isValid).toBe(true);
  });
});
