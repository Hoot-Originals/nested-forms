import { z } from 'zod'
import { JobApplicationSchema, PersonalInfoSchema, SkillSchema } from './schemas'
export type JobApplication = z.infer<typeof JobApplicationSchema>

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>

export type Skill = z.infer<typeof SkillSchema>
