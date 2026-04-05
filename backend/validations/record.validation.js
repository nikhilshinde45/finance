const { z } = require('zod');

const createRecord = z.object({
  body: z.object({
    amount: z.number({ required_error: 'Amount is required' }).positive('Amount must be positive'),
    type: z.enum(['income', 'expense'], { required_error: 'Type must be income or expense' }),
    category: z.string({ required_error: 'Category is required' }).min(1, 'Category cannot be empty'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }).transform((val) => new Date(val)),
    note: z.string().optional(),
  }),
});

const updateRecord = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid record ID'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().min(1, 'Category cannot be empty').optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }).transform((val) => new Date(val)).optional(),
    note: z.string().optional(),
  }),
});

const getRecords = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
    search: z.string().optional(),
  }),
});

module.exports = {
  createRecord,
  updateRecord,
  getRecords,
};
