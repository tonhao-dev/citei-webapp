import { test, fc } from '@fast-check/vitest';
import { Collection } from '../../src/entities/collection';
import { ImageURL } from '../../src/entities/url';

const nonEmpty = fc.string({ minLength: 1 });
const validImage = fc.webUrl();

describe('entities/collection (propriedades)', () => {
  afterEach(() => {
    // Teardown
    vi.restoreAllMocks();
  });

  test.prop([nonEmpty, nonEmpty, nonEmpty, validImage])(
    'deve ser válida para qualquer combinação de campos não vazios com imagem válida',
    (title, author, subtitle, image) => {
      // Arrange
      const imageUrl = new ImageURL(image);

      // Act
      const collection = new Collection(title, author, subtitle, imageUrl);

      // Assert
      expect(collection.isValid).toBe(true);
    }
  );

  test.prop([
    fc.constantFrom('title', 'author', 'subtitle'),
    nonEmpty,
    nonEmpty,
    nonEmpty,
    validImage,
  ])('deve ser inválida quando qualquer um dos campos de texto estiver vazio', (emptyField, title, author, subtitle, image) => {
    // Arrange
    const fields = { title, author, subtitle, [emptyField]: '' };

    // Act
    const collection = new Collection(
      fields.title,
      fields.author,
      fields.subtitle,
      new ImageURL(image)
    );

    // Assert
    expect(collection.isValid).toBe(false);
  });

  test.prop([nonEmpty, nonEmpty, nonEmpty, fc.string().filter(value => !/^[a-z][a-z0-9+.-]*:/i.test(value))])(
    'deve ser inválida quando a imagem não for uma URL http ou https',
    (title, author, subtitle, image) => {
      // Arrange
      const imageUrl = new ImageURL(image);

      // Act
      const collection = new Collection(title, author, subtitle, imageUrl);

      // Assert
      expect(collection.isValid).toBe(false);
    }
  );
});
