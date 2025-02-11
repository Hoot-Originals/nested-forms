<script setup>
import { ref, watch } from 'vue'
import { PersonalInfoSchema } from '~/types'

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

const personalInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const personalInfoForm = ref()
const skillsForm = ref()

const validate = async () => {
  try {
    console.log('validating personal info')
    await Promise.all([
      personalInfoForm.value?.validate(),
      skillsForm.value?.validate()
    ])
    return true
  } catch (error) {
    throw error
  }
}


const parse = async () => {
  try {
    await validate()
    const parsedPersonalInfo = PersonalInfoSchema.parse(personalInfo.value)
    const parsedSkills = skillsForm.value?.parse()

    return {
      ...parsedPersonalInfo,
      skills: parsedSkills
    }
  } catch (error) {
    throw error
  }
}

watch(personalInfo.value, (newVal) => {
  if (newVal) {
    jobApplication.value.personalInfo = newVal
  }
})

// Define a type for the exposed properties
defineExpose({
  validate,
  parse
})

</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Personal Information</h3>
    </template>

    <UForm
      ref="personalInfoForm"
      :state="personalInfo"
      :schema="PersonalInfoSchema"
      :validate-on="['blur', 'change', 'input']"
    >
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          label="First Name"
          name="firstName"
        >
          <UInput v-model="personalInfo.firstName" />
        </UFormField>

        <UFormField
          label="Last Name"
          name="lastName"
        >
          <UInput v-model="personalInfo.lastName" />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput v-model="personalInfo.email" type="email" />
        </UFormField>

        <UFormField
          label="Phone"
          name="phone"
        >
          <UInput v-model="personalInfo.phone" type="tel" />
        </UFormField>
      </div>
    </UForm>

    <div class="mt-6">
      <SkillsForm
        ref="skillsForm"
        v-model:job-application="jobApplication"
        :organization-data="props.organizationData"
      />
    </div>
  </UCard>
</template>