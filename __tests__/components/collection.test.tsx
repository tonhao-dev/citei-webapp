import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Collection from '../../src/components/collection';
import { collection } from '../factory/collection';
import { ImageURL } from '../../src/entities/url';

describe('<Collection>', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve exibir uma coleção corretamente quando as informações passadas forem válidas', () => {
    it('Deve exibir o título da coleção quando ele for passado na prop "title"', () => {
      // Arrange
      const title = faker.word.words(2);

      // Act
      render(<Collection collection={collection({ title })} />);

      // Assert
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('Deve exibir o subtítulo da coleção quando ele for passado na prop "subtitle"', () => {
      // Arrange
      const subtitle = faker.word.words(7);

      // Act
      render(<Collection collection={collection({ subtitle })} />);

      // Assert
      expect(screen.getByText(subtitle)).toBeInTheDocument();
    });

    it('Deve exibir o nome do autor da coleção quando ele for passado na prop "author"', () => {
      // Arrange
      const author = faker.person.fullName();

      // Act
      render(<Collection collection={collection({ author })} />);

      // Assert
      expect(screen.getByText(author)).toBeInTheDocument();
    });

    it('Deve exibir o botão de editar coleção quando o componente for renderizado', () => {
      // Arrange
      const data = collection();

      // Act
      render(<Collection collection={data} />);

      // Assert
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    it('Deve exibir o botão de excluir coleção quando o componente for renderizado', () => {
      // Arrange
      const data = collection();

      // Act
      render(<Collection collection={data} />);

      // Assert
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });

    it('Deve exibir uma imagem com o atributo src igual ao valor passado na prop "image"', () => {
      // Arrange
      const src = faker.image.url();
      const data = collection({ image: new ImageURL(src) });

      // Act
      render(<Collection collection={data} />);

      // Assert
      expect(screen.getByRole('img').getAttribute('src')).toBe(src);
    });
  });

  describe('Deve executar corretamente as ações da coleção quando o usuário clicar nelas', () => {
    it('Deve chamar a função de editar passada via prop "onEdit" quando o usuário clicar no botão Editar', async () => {
      // Arrange
      const onEdit = vi.fn();
      render(<Collection collection={collection()} onEdit={onEdit} />);

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Editar' }));

      // Assert
      expect(onEdit).toBeCalledTimes(1);
    });

    it('Deve chamar a função de excluir passada via prop "onDelete" quando o usuário clicar no botão de Excluir', async () => {
      // Arrange
      const onDelete = vi.fn();
      render(<Collection collection={collection()} onDelete={onDelete} />);

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));

      // Assert
      expect(onDelete).toBeCalledTimes(1);
    });
  });
});
