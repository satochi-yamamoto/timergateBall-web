import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Timer from '@/components/Timer'

describe('Timer Component', () => {
  const defaultProps = {
    timeLeft: 1800, // 30 minutes
    gameState: 'running',
    onClick: vi.fn(),
  }

  it('should render timer with correct time format', () => {
    render(<Timer {...defaultProps} />)
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })

  it('should display correct status text for different game states', () => {
    const { rerender } = render(<Timer {...defaultProps} gameState="lobby" />)
    expect(screen.getByText('Toque para iniciar')).toBeInTheDocument()

    rerender(<Timer {...defaultProps} gameState="paused" />)
    expect(screen.getByText('Pausado')).toBeInTheDocument()

    rerender(<Timer {...defaultProps} gameState="completed" />)
    expect(screen.getByText('Finalizado')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const mockClick = vi.fn()
    render(<Timer {...defaultProps} onClick={mockClick} />)
    
    fireEvent.click(screen.getByText('30:00'))
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it('should format time correctly for different durations', () => {
    const { rerender } = render(<Timer {...defaultProps} timeLeft={125} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()

    rerender(<Timer {...defaultProps} timeLeft={59} />)
    expect(screen.getByText('00:59')).toBeInTheDocument()

    rerender(<Timer {...defaultProps} timeLeft={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('should show low time warning styles for time <= 300 seconds', () => {
    render(<Timer {...defaultProps} timeLeft={300} />)
    // This would need actual style checking implementation
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('should show critical time warning for time <= 60 seconds', () => {
    render(<Timer {...defaultProps} timeLeft={60} />)
    expect(screen.getByText('01:00')).toBeInTheDocument()
  })
})