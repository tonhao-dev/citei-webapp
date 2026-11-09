import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Search from '../../src/components/search';

describe('<Search />', () => {
  let onToggle: ReturnType<typeof vi.fn>;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Arrange
    onToggle = vi.fn();
    onChange = vi.fn();
    render(<Search onChange={onChange} onToggle={onToggle} />);
  });

  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve exibir o componente de busca corretamente quando ele for renderizado', () => {
    it('Deve exibir um input text editável quando o icone de busca for clicado', async () => {
      // Arrange
      const searchIcon = screen.getByLabelText('search-icon');

      // Act
      await userEvent.click(searchIcon);

      // Assert
      expect(screen.getByRole('textbox')).toBeVisible();
    });

    it('Deve exibir um icone de close quando o icone de busca for clicado', async () => {
      // Arrange
      const searchIcon = screen.getByLabelText('search-icon');

      // Act
      await userEvent.click(searchIcon);

      // Assert
      expect(screen.getByLabelText('search-close')).toBeVisible();
    });

    it('Deve exibir o texto digitado pelo usuário no input de texto exibido quando o icone de busca for clicado', async () => {
      // Arrange
      const title = faker.word.words(1);
      await userEvent.click(screen.getByLabelText('search-icon'));
      const input = screen.getByRole('textbox');

      // Act
      await userEvent.type(input, title);

      // Assert
      expect(screen.getByDisplayValue(title)).toBeInTheDocument();
    });

    it('Deve executar a função de "onToggle" quando o usuário clicar no icone de buscar', async () => {
      // Arrange
      const searchIcon = screen.getByLabelText('search-icon');

      // Act
      await userEvent.click(searchIcon);

      // Assert
      expect(onToggle).toBeCalledTimes(1);
    });

    it('Deve executar a função de "onChange" o número de vezes igual ao tamanho do texto digitado no campo de buscar', async () => {
      // Arrange
      const text = faker.word.words(2);
      await userEvent.click(screen.getByLabelText('search-icon'));
      const input = screen.getByRole('textbox');

      // Act
      await userEvent.type(input, text);

      // Assert
      expect(onChange).toBeCalledTimes(text.length);
      expect(onChange).toHaveBeenCalledWith(text);
    });
  });
});
