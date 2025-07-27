import { render } from '@testing-library/react';

import CodescapeFinancialCoreUi from './core-ui';

describe('CodescapeFinancialCoreUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CodescapeFinancialCoreUi />);
    expect(baseElement).toBeTruthy();
  });
});
