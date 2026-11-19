import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(80, 'O nome é demasiado longo'),
  email: z
    .string()
    .email('Introduza um e-mail válido'),
  phone: z
    .string()
    .optional(),
  province: z
    .string()
    .min(1, 'A província é obrigatória'),
  role: z.enum([
    'agricultor',
    'estudante',
    'tecnico',
    'investigador',
    'gestor',
    'admin',
    'producer',
    'agronomist',
    'researcher',
  ] as const),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
