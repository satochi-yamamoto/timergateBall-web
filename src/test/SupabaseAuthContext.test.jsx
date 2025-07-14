import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/lib/customSupabaseClient'

// Test component to use the auth context
const TestComponent = () => {
  const { user, session, loading, signIn, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <div data-testid="session">{session ? 'Has Session' : 'No Session'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('SupabaseAuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide initial loading state', () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
  })

  it('should handle successful authentication', async () => {
    const mockSession = {
      user: { email: 'test@example.com' }
    }
    
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('session')).toHaveTextContent('Has Session')
    })
  })

  it('should handle sign in', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => screen.getByTestId('loading').textContent === 'Not Loading')
    
    const signInButton = screen.getByText('Sign In')
    signInButton.click()
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })
  })

  it('should handle sign out', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.signOut.mockResolvedValue({ error: null })
    
    // Mock window.location.href
    delete window.location
    window.location = { href: '' }
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => screen.getByTestId('loading').textContent === 'Not Loading')
    
    const signOutButton = screen.getByText('Sign Out')
    signOutButton.click()
    
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled()
    })
  })

  it('should handle authentication errors', async () => {
    const mockError = { message: 'Invalid credentials' }
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.signInWithPassword.mockResolvedValue({ error: mockError })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => screen.getByTestId('loading').textContent === 'Not Loading')
    
    const signInButton = screen.getByText('Sign In')
    signInButton.click()
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
    })
  })

  it('should throw error when used outside provider', () => {
    // Mock console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })
})