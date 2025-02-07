<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { object, string, array } from 'yup'

const jobApplication = defineModel('jobApplication', {
  type: Object,
  required: true
})

const props = defineProps({
  organizationData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const schema = object({
  skills: array().of(object({
    skill: string().required().trim(),
    description: string().required().trim()
  })).required(),
  experience: string().required().trim(),
  portfolio: string().url().required().trim()
})

const selectedBranch = computed(() => {
  return props.organizationData.branches.find(branch => branch.branchId === jobApplication.value?.branch)
})

const selectedDepartment = computed(() => {
  return selectedBranch.value?.departments.find(department => department.departmentId === jobApplication.value?.department)
})

const selectedRole = computed(() => {
  return selectedDepartment.value?.roles.find(role => role.roleId === jobApplication.value?.role)
})

const selectedJob = computed(() => {
  return selectedRole.value?.jobs.find(job => job.jobId === jobApplication.value?.job)
})

const requiredSkills = computed(() => {
  return selectedJob.value?.requiredSkills
})

watch(() => jobApplication.value.job, (newVal) => {
  if (newVal) {
    const skills = requiredSkills.value.map(skill => ({
      skill,
      description: ''
    }))

    jobApplication.value.skills = skills
  }
})

function updateSkill(skill, description) {
  if (!jobApplication.value.skills[skill]) {
    jobApplication.value.skills[skill] = {
      skill,
      description
    }
  } else {
    jobApplication.value.skills[skill].description = description
  }
}

const formRef = ref(null)

async function validate() {
  try {
    await formRef.value?.validate()
  } catch (error) {
    throw error
  }
}

const parse = async () => {
  try {
    const parsed = await schema.validate({
      skills: jobApplication.value.skills,
      experience: jobApplication.value.experience,
      portfolio: jobApplication.value.portfolio
    }, { stripUnknown: true })
    return parsed
  } catch (error) {
    throw error
  }
}

defineExpose({
  validate,
  parse
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Skills & Experience</h3>
    </template>

    <UForm
      ref="formRef"
      :state="jobApplication"
      :schema="schema"
      :validate-on="['blur', 'change', 'input']"
    >
      <div class="space-y-4">
        <div class="text-lg font-semibold">
          Required Skills
        </div>
        <div v-for="(skill, idx) in requiredSkills" :key="skill" class="mb-2">
          <UFormField :label="skill" :name="skill">
            <UTextarea
              v-model="jobApplication.skills[idx].description"
              :placeholder="`Describe your experience with ${skill}`"
              @update:model-value="updateSkill(skill, $event)"
            />
          </UFormField>
        </div>

        <UFormField
          label="Overall Experience"
          name="experience"
        >
          <UTextarea
            v-model="jobApplication.experience"
            placeholder="Describe your relevant work experience"
          />
        </UFormField>

        <UFormField
          label="Portfolio URL (Optional)"
          name="portfolio"
        >
          <UInput
            v-model="jobApplication.portfolio"
            type="url"
          />
        </UFormField>
      </div>
    </UForm>
  </UCard>
</template>