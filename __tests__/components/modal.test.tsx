import { cleanup, render } from '@testing-library/react';
import Modal from '../../src/components/modal';

describe('<Modal />', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve renderizar o modal corretamente', () => {
    it('Deve esconder o modal quando ele for renderizado com a prop visible igual a false', () => {
      // Arrange
      const visible = false;

      // Act
      const { container } = render(<Modal visible={visible} />);

      // Assert
      expect(container).toBeEmptyDOMElement();
    });

    it('Deve exibir o modal quando o ele for renderizado com a prop visible igual a true', () => {
      // Arrange
      const visible = true;

      // Act
      const { container } = render(<Modal visible={visible} />);

      // Assert
      expect(container).not.toBeEmptyDOMElement();
    });
  });
});
