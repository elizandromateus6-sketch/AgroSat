import { z } from 'zod';

export const farmSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome da propriedade deve ter pelo menos 3 caracteres')
    .max(100, 'Nome demasiado longo'),
  province: z
    .string()
    .min(1, 'Selecione a província'),
  municipality: z
    .string()
    .min(1, 'Indique o município ou comuna'),
  totalArea: z
    .number({ message: 'A área deve ser um número válido' })
    .positive('A área deve ser superior a zero')
    .max(100000, 'Área excede o limite do sistema'),
  mainCrop: z
    .string()
    .min(2, 'Selecione ou indique a cultura principal'),
  variety: z
    .string()
    .optional(),
  status: z
    .enum(['Excelente', 'Bom', 'Atenção', 'Crítico'])
    .default('Bom'),
  plantingDate: z
    .string()
    .min(1, 'A data de plantio é obrigatória'),
  irrigationType: z.enum([
    'Gotejamento',
    'Aspersão',
    'Pivot Central',
    'Sequeiro (Chuva)',
    'Manual',
  ]),
  notes: z
    .string()
    .max(500, 'As observações não devem exceder 500 caracteres')
    .optional(),
});

export type FarmFormData = z.infer<typeof farmSchema>;
