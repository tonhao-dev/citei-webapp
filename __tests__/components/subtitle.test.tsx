import { cleanup, render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import SubTitle from '../../src/components/subtitle';

describe('<SubTitle>', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  it('Deve exibir o subtítulo com o valor passado no children', () => {
    // Arrange
    const subtitle = faker.lorem.sentence();

    // Act
    render(<SubTitle>{subtitle}</SubTitle>);

    // Assert
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });
});
