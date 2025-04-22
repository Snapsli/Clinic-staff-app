import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { staffStore } from '../../store/StaffStore';
import { StaffList } from '../StaffList'; 
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../services/api', () => ({
  api: {
    get: () => ({ json: async () => [] }),
    post: () => Promise.resolve(),
  },
}));

describe('StaffList', () => {
  it('renders title and empty table', async () => {
    staffStore.setStaff([]); 

    render(
      <BrowserRouter>
        <StaffList />
      </BrowserRouter>
    );

    expect(await screen.findByText('Список сотрудников клиники')).toBeInTheDocument();
    expect(screen.getByText('Добавить сотрудника')).toBeInTheDocument();
  });
});
