import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Quotation from '../../src/components/quotation'; // implement quotation

describe('<Quotation>', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve deixar de exibir as informações quando elas não forem passadas para o componente', () => {
    it('Deve deixar de renderizar o parágrafo da citação quando nada for passado no atributo "quote"', () => {
      // Arrange
      const element = <Quotation />;

      // Act
      render(element);

      // Assert
      expect(screen.queryByTitle('quote-title')).not.toBeInTheDocument();
    });

    it('Deve deixar de renderizar o paragrafo com o nome do autor quando essa informação não for passada', () => {
      // Arrange
      const element = <Quotation />;

      // Act
      render(element);

      // Assert
      expect(screen.queryByTitle('quote-author')).not.toBeInTheDocument();
    });
  });

  describe('Deve renderizar as informações que foram passadas para o componente corretamente', () => {
    it('Deve exibir a citação que for passada no atributo "quote"', () => {
      // Arrange
      const quote = faker.word.words(10);

      // Act
      render(<Quotation quote={quote} />);

      // Assert
      expect(screen.getByText(quote)).toBeInTheDocument();
    });

    it('Deve exibir o nome do autor que for passado no atributo "author"', () => {
      // Arrange
      const author = faker.person.fullName();

      // Act
      render(<Quotation author={author} />);

      // Assert
      expect(screen.getByText(author)).toBeInTheDocument();
    });

    it('Deve exibir o nome da coleção quando ela for passada no atributo "collection"', () => {
      // Arrange
      const collection = faker.word.words(1);

      // Act
      render(<Quotation collection={collection} />);

      // Assert
      expect(screen.getByText(collection)).toBeInTheDocument();
    });

    it('Deve exibir o icone de copiar citação', () => {
      // Arrange
      const element = <Quotation />;

      // Act
      render(element);

      // Assert
      expect(screen.getByTestId('quotation-copy')).toBeInTheDocument();
    });

    it('Deve exibir o icone de compartilhar a citação', () => {
      // Arrange
      const element = <Quotation />;

      // Act
      render(element);

      // Assert
      expect(screen.getByTestId('quotation-share')).toBeInTheDocument();
    });
  });

  describe('Deve executar corretamente as ações quando o usuário clicar na citação', () => {
    it('Deve executar a função de copiar citação quando o usuário der um double clique no texto da citação', async () => {
      // Arrange
      const quote = faker.word.words(10);
      const onCopy = vi.fn();
      render(<Quotation quote={quote} onCopy={onCopy} />);

      // Act
      await userEvent.dblClick(screen.getByText(quote));

      // Assert
      expect(onCopy).toBeCalledTimes(1);
    });

    it('Deve executar a função de copiar citação quando o usuário clicar no ícone de copiar', async () => {
      // Arrange
      const quote = faker.word.words(10);
      const onCopy = vi.fn();
      render(<Quotation quote={quote} onCopy={onCopy} />);

      // Act
      await userEvent.click(screen.getByTestId('quotation-copy'));

      // Assert
      expect(onCopy).toBeCalledTimes(1);
    });

    it('Deve executar a função de compartilhar citação quando o usuário clicar no ícone de compartilhar', async () => {
      // Arrange
      const quote = faker.word.words(10);
      const onShare = vi.fn();
      render(<Quotation quote={quote} onShare={onShare} />);

      // Act
      await userEvent.click(screen.getByTestId('quotation-share'));

      // Assert
      expect(onShare).toBeCalledTimes(1);
    });
  });
});
