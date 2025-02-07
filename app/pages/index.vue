<script setup>
import { ref, reactive } from 'vue'
import orgData from '~/org.json'
import { sanitizeObject } from '~/utils/sanitize'

const toast = useToast()

const jobApplicationRef = ref(null)

const jobApplication = ref({
  branch: undefined,
  department: undefined,
  role: undefined,
  job: undefined,
  personalInfo: undefined,
  skills: undefined
})

const handleSubmit = async () => {
  try {
    // First validate
    await jobApplicationRef.value?.validate()

    // Then parse through Yup schemas
    const parsedData = await jobApplicationRef.value?.parse()

    // Then sanitize
    const sanitizedData = sanitizeObject(parsedData)

    console.log('Final application data:', sanitizedData)

    toast.add({
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    return toast.add({
      title: 'Validation Errors',
      description: 'The form contains errors. Please fix them and try again.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold mb-6">Job Application</h1>

      <JobApplicationForm
        ref="jobApplicationRef"
        :key="jobApplicationKey"
        v-model:job-application="jobApplication"
        :organization-data="orgData"
      />

      <div class="mt-6">
        <UButton
          color="primary"
          @click="handleSubmit"
        >
          Submit Application
        </UButton>
      </div>
    </div>
  </div>
</template>