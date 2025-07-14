import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateTeamName,
  validatePlayerName,
  validateUUID,
  sanitizeInput,
  createRateLimiter,
} from '@/lib/validation'

describe('Input Validation', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace and limit length', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
      const longString = 'a'.repeat(2000)
      expect(sanitizeInput(longString)).toHaveLength(1000)
    })

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe('')
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe('test@example.com')
      expect(validateEmail('user.name@domain.co.uk')).toBe('user.name@domain.co.uk')
    })

    it('should reject invalid emails', () => {
      expect(() => validateEmail('invalid-email')).toThrow()
      expect(() => validateEmail('test@')).toThrow()
      expect(() => validateEmail('@domain.com')).toThrow()
      expect(() => validateEmail('')).toThrow()
    })

    it('should handle malicious input', () => {
      expect(() => validateEmail('<script>alert("xss")</script>')).toThrow()
      expect(() => validateEmail('test@example.com')).not.toThrow()
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPass123')).toBe('StrongPass123')
      expect(validatePassword('MyPassword1')).toBe('MyPassword1')
    })

    it('should reject weak passwords', () => {
      expect(() => validatePassword('weak')).toThrow()
      expect(() => validatePassword('onlylowercase')).toThrow()
      expect(() => validatePassword('ONLYUPPERCASE')).toThrow()
      expect(() => validatePassword('NoNumbers')).toThrow()
      expect(() => validatePassword('1234567')).toThrow()
    })
  })

  describe('validateTeamName', () => {
    it('should validate correct team names', () => {
      expect(validateTeamName('Team Alpha')).toBe('Team Alpha')
      expect(validateTeamName('Águias-Douradas')).toBe('Águias-Douradas')
      expect(validateTeamName('Team_123')).toBe('Team_123')
    })

    it('should reject invalid team names', () => {
      expect(() => validateTeamName('')).toThrow()
      expect(() => validateTeamName('a'.repeat(100))).toThrow()
      expect(() => validateTeamName('Team@#$%')).toThrow()
    })
  })

  describe('validatePlayerName', () => {
    it('should validate correct player names', () => {
      expect(validatePlayerName('João Silva')).toBe('João Silva')
      expect(validatePlayerName("O'Connor")).toBe("O'Connor")
      expect(validatePlayerName('Jean-Pierre')).toBe('Jean-Pierre')
    })

    it('should reject invalid player names', () => {
      expect(() => validatePlayerName('')).toThrow()
      expect(() => validatePlayerName('Player123')).toThrow()
      expect(() => validatePlayerName('Player@#$%')).toThrow()
    })
  })

  describe('validateUUID', () => {
    it('should validate correct UUIDs', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      expect(validateUUID(validUUID)).toBe(validUUID)
    })

    it('should reject invalid UUIDs', () => {
      expect(() => validateUUID('invalid-uuid')).toThrow()
      expect(() => validateUUID('123')).toThrow()
      expect(() => validateUUID('')).toThrow()
    })
  })

  describe('createRateLimiter', () => {
    it('should allow requests within limit', () => {
      const rateLimiter = createRateLimiter(3, 1000)
      
      expect(() => rateLimiter('user1')).not.toThrow()
      expect(() => rateLimiter('user1')).not.toThrow()
      expect(() => rateLimiter('user1')).not.toThrow()
    })

    it('should block requests exceeding limit', () => {
      const rateLimiter = createRateLimiter(2, 1000)
      
      rateLimiter('user1')
      rateLimiter('user1')
      
      expect(() => rateLimiter('user1')).toThrow('Muitas tentativas')
    })

    it('should handle different users separately', () => {
      const rateLimiter = createRateLimiter(2, 1000)
      
      rateLimiter('user1')
      rateLimiter('user1')
      
      expect(() => rateLimiter('user1')).toThrow()
      expect(() => rateLimiter('user2')).not.toThrow()
    })
  })
})