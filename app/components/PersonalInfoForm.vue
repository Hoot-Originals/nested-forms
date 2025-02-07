<script setup>
import { ref, watch } from 'vue'
import { object, string } from 'yup'

const jobApplication = defineModel('jobApplication', {
  type: Object,
  default: () => ({})
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

const schema = object({
  firstName: string().required('First name is required').trim(),
  lastName: string().required('Last name is required').trim(),
  email: string().email('Invalid email').required('Email is required').lowercase().trim(),
  phone: string().required('Phone number is required').trim(),
})

const formRef = ref(null)
const skillsRef = ref(null)

const validate = async () => {
  try {
    await formRef.value?.validate()
    await skillsRef.value?.validate()
  } catch (error) {
    throw error
  }
}

const parse = async () => {
  try {
    const parsed = await schema.validate(personalInfo.value, { stripUnknown: true })
    return parsed
  } catch (error) {
    throw error
  }
}

watch(personalInfo.value, (newVal) => {
  if (newVal) {
    jobApplication.value.personalInfo = newVal
  }
})

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
      ref="formRef"
      :state="personalInfo"
      :schema="schema"
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
        ref="skillsRef"
        v-model:job-application="jobApplication"
        :organization-data="props.organizationData"
      />
    </div>
  </UCard>
</template>