import { cleanup, render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import QuotationList from '../../src/components/quotationList'; // implement quotation
import { quotation } from '../factory/quotation';

describe('<QuotationList>', () => {
  afterEach(() => {
    // Teardown
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Deve renderizar o componente corretamente quando uma lista de citações for passada via prop', () => {
    it('Deve exibir o texto das citações quando uma lista de quotation for enviada via prop "quotations"', () => {
      // Arrange
      const quotations = Array.from(Array(faker.number.int({ min: 1, max: 10 }))).map(() =>
        quotation()
      );

      // Act
      render(<QuotationList quotations={quotations} />);

      // Assert
      quotations.forEach(quotation =>
        expect(screen.getByText(quotation.quote)).toBeInTheDocument()
      );
    });

    it('Deve exibir o nome dos autores das citações quando uma lista de quotation for passada via prop "quotations"', () => {
      // Arrange
      const quotations = Array.from(Array(faker.number.int({ min: 1, max: 10 }))).map(() =>
        quotation()
      );

      // Act
      render(<QuotationList quotations={quotations} />);

      // Assert
      quotations.forEach(quotation =>
        expect(screen.getByText(quotation.author)).toBeInTheDocument()
      );
    });

    it('Deve exibir o nome da coleção das citações quando uma lista de quotation for passada via prop "quotations"', () => {
      // Arrange
      const quotations = Array.from(Array(faker.number.int({ min: 1, max: 10 }))).map(() =>
        quotation({ collection: 'colecao' })
      );

      // Act
      render(<QuotationList quotations={quotations} />);

      // Assert
      expect(screen.getAllByText('colecao').length).toBe(quotations.length);
    });
  });
});
