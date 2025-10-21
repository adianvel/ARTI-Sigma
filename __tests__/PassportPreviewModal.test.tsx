import React from 'react'
import { render, screen } from '@testing-library/react'
import PassportPreviewModal from '../components/PassportPreviewModal'

describe('PassportPreviewModal', () => {
  test('renders fractional summary when passport contains fractional info', () => {
    const passport = {
      platform_info: {
        fractional: {
          total_units: 27,
          sale_type: 'direct',
          price_primary_idr: 260000,
          partner_share_percent: 0
        }
      }
    }

    render(<PassportPreviewModal open={true} onClose={() => {}} onConfirm={() => {}} passportJson={passport} />)

    expect(screen.getByText(/Fractional mint summary/i)).toBeInTheDocument()
    expect(screen.getByText(/Total units:/i)).toBeInTheDocument()
    expect(screen.getByText(/Sale type:/i)).toBeInTheDocument()
  })
})
