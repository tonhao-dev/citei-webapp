import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Input from '../../src/components/input';

describe('<Input />', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve renderizar o input corretamente', () => {
    it('Deve renderizar o input com o texto que for passado via prop "value"', () => {
      // Arrange
      const text = faker.word.words(2);

      // Act
      render(<Input value={text} onChange={() => {}} />);

      // Assert
      expect(screen.getByDisplayValue(text)).toBeInTheDocument();
    });

    it('Deve exibir o texto que for digitado pelo usuário dentro do input', async () => {
      // Arrange
      const text = faker.word.words(2);
      render(<Input value={text} onChange={() => {}} />);

      // Act
      await userEvent.type(screen.getByRole('textbox'), text);

      // Assert
      expect(screen.getByDisplayValue(text)).toBeInTheDocument();
    });
  });
});
