import { faker } from '@faker-js/faker';
import { ImageURL } from '../../src/entities/url';

describe('entities/url', () => {
  describe('isValid', () => {
    it('Deve retornar true quando uma URL válida for enviada', () => {
      const url = faker.image.url();

      expect(new ImageURL(url).isValid).toBe(true);
    });

    it('Deve retornar false quando uma URL inválida for enviada', () => {
      const url = faker.person.fullName();

      expect(new ImageURL(url).isValid).toBe(false);
    });

    it('Deve retornar false quando uma URL for criada com uma string vazia', () => {
      const url = '';

      expect(new ImageURL(url).isValid).toBe(false);
    });

    it('Deve retornar a URL padrão quando uma URL inválida for enviada', () => {
      const DEFAULT_IMAGE_URL = 'https://i.ibb.co/ZHDSnj4/foo.jpg';
      const url = '';

      expect(new ImageURL(url).url).toBe(DEFAULT_IMAGE_URL);
    });

    it('Deve retornar true quando a URL informada for uma URL estatica da propria aplicação', () => {
      const url = 'http://localhost:5173/assets/collection.jpg';

      const isValid = new ImageURL(url).isValid;

      expect(isValid).toBe(true);
    });
  });
});
