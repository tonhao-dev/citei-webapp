import { cleanup, render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import Title from '../../src/components/title';

describe('<Title>', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  it('Deve renderizar o título com o valor passado no parâmetro do componente title', () => {
    // Arrange
    const title = faker.lorem.sentence();

    // Act
    render(<Title>{title}</Title>);

    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
