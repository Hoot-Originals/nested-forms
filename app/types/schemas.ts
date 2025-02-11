import { z } from 'zod'

export const JobApplicationSchema = z.object({
  branch: z.string().min(1, 'Branch is required'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(1, 'Role is required'),
  job: z.string().min(1, 'Job is required'),
})

export const PersonalInfoSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').trim().min(1, 'Email is required').toLowerCase(),
  phone: z.string().trim().min(1, 'Phone number is required'),
})

export const SkillSchema = z.object({
  experience: z.string().trim().min(1, 'Experience is required'),
  portfolio: z.string().trim().min(1, 'Portfolio is required'),
  skills: z.array(z.object({
    skill: z.string(),
    description: z.string()
  }))
})
