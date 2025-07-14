// Input validation utilities for security
import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(1, 'Email é obrigatório')
  .max(100, 'Email muito longo');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(100, 'Senha muito longa')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  );

// Team name validation schema
export const teamNameSchema = z
  .string()
  .min(1, 'Nome da equipe é obrigatório')
  .max(50, 'Nome da equipe muito longo')
  .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_]+$/, 'Nome da equipe contém caracteres inválidos');

// Player name validation schema
export const playerNameSchema = z
  .string()
  .min(1, 'Nome do jogador é obrigatório')
  .max(50, 'Nome do jogador muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Nome do jogador contém caracteres inválidos');

// UUID validation schema
export const uuidSchema = z
  .string()
  .uuid('ID inválido');

// Generic text input sanitizer
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate and sanitize email
export const validateEmail = (email) => {
  try {
    const sanitized = sanitizeInput(email);
    // Additional email-specific sanitization
    const emailSanitized = sanitized.replace(/[<>]/g, '');
    return emailSchema.parse(emailSanitized);
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || 'Email inválido');
  }
};

// Validate and sanitize password
export const validatePassword = (password) => {
  try {
    return passwordSchema.parse(password);
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || 'Senha inválida');
  }
};

// Validate and sanitize team name
export const validateTeamName = (name) => {
  try {
    const sanitized = sanitizeInput(name);
    // Additional team name-specific sanitization
    const teamSanitized = sanitized.replace(/[<>]/g, '');
    return teamNameSchema.parse(teamSanitized);
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || 'Nome da equipe inválido');
  }
};

// Validate and sanitize player name
export const validatePlayerName = (name) => {
  try {
    const sanitized = sanitizeInput(name);
    // Additional player name-specific sanitization - allow quotes for names like O'Connor
    const playerSanitized = sanitized.replace(/[<>]/g, '');
    return playerNameSchema.parse(playerSanitized);
  } catch (error) {
    throw new Error(error.errors?.[0]?.message || 'Nome do jogador inválido');
  }
};

// Validate UUID
export const validateUUID = (id) => {
  try {
    return uuidSchema.parse(id);
  } catch (error) {
    throw new Error('ID inválido');
  }
};

// Rate limiting utility (simple client-side)
export const createRateLimiter = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();
  
  return (key) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      throw new Error('Muitas tentativas. Tente novamente mais tarde.');
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    return true;
  };
};

// Auth rate limiter
export const authRateLimiter = createRateLimiter(5, 300000); // 5 attempts per 5 minutes