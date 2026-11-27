import { faker } from '@faker-js/faker';
import { ImageURL } from '../../src/entities/url';

afterEach(() => {
  // Teardown
  vi.restoreAllMocks();
});

describe('entities/url', () => {
  describe('isValid', () => {
    it('Deve retornar true quando uma URL válida for enviada', () => {
      // Arrange
      const url = faker.image.url();

      // Act
      const isValid = new ImageURL(url).isValid;

      // Assert
      expect(isValid).toBe(true);
    });

    it('Deve retornar false quando uma URL inválida for enviada', () => {
      // Arrange
      const url = faker.person.fullName();

      // Act
      const isValid = new ImageURL(url).isValid;

      // Assert
      expect(isValid).toBe(false);
    });

    it('Deve retornar false quando uma URL for criada com uma string vazia', () => {
      // Arrange
      const url = '';

      // Act
      const isValid = new ImageURL(url).isValid;

      // Assert
      expect(isValid).toBe(false);
    });

    it('Deve retornar a URL padrão quando uma URL inválida for enviada', () => {
      // Arrange
      const DEFAULT_IMAGE_URL = 'https://i.ibb.co/ZHDSnj4/foo.jpg';
      const url = '';

      // Act
      const result = new ImageURL(url).url;

      // Assert
      expect(result).toBe(DEFAULT_IMAGE_URL);
    });

    it('Deve retornar true quando a URL informada for uma URL estatica da propria aplicação', () => {
      // Arrange
      const url = 'http://localhost:5173/assets/collection.jpg';

      // Act
      const isValid = new ImageURL(url).isValid;

      // Assert
      expect(isValid).toBe(true);
    });
  });
});
