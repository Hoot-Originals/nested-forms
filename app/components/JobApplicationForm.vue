<script setup>
import { ref, computed, watch } from 'vue'
import { JobApplicationSchema } from '~/types'

const jobApplication = defineModel('jobApplication', {
  type: Object,
  required: true
})

const props = defineProps({
  // jobApplication: {
  //   type: Object,
  //   required: true
  // },
  organizationData: {
    type: Object,
    required: true
  }
})

const jobForm = ref()
const personalInfoForm = ref()

// const jobApplication = ref({
//   branch: null,
//   department: null,
//   role: null,
//   job: null
// })

// onMounted(() => {
//   jobApplication.value = { ...jobApplication.value }
// })


// Method that parent can call to validate entire form
const validate = async () => {
  try {
    await jobForm.value?.validate()
    await personalInfoForm.value?.validate()
    // Validate all nested forms
    return true
  } catch (error) {
    throw error
  }
}

// Parse method to get all validated data
const parse = async () => {
  try {
    // First validate
    await validate()

    // Then parse each section
    const formData = JobApplicationSchema.parse(jobApplication.value)
    const personalData = await personalInfoForm.value?.parse()

    // Combine all data
    return {
      ...formData,
      personalInfo: personalData
    }
  } catch (error) {
    throw error
  }
}

const selectedBranch = computed(() => {
  if (jobApplication.value?.branch) {
    return props.organizationData.branches.find(branch => branch.branchId === jobApplication.value?.branch)
  }
  return null
})

const selectedDepartment = computed(() => {
  if (jobApplication.value?.department) {
    return selectedBranch.value?.departments.find(department => department.departmentId === jobApplication.value?.department)
  }
  return null
})

const selectedRole = computed(() => {
  if (jobApplication.value?.role) {
    return selectedDepartment.value?.roles.find(role => role.roleId === jobApplication.value?.role)
  }
  return null
})

const departments = computed(() => {
  if (jobApplication.value?.branch) {
    return props.organizationData.branches.find(branch => branch.branchId === jobApplication.value?.branch)?.departments
  }
  return []
})

const roles = computed(() => {
  if (jobApplication.value?.department) {
    return selectedDepartment.value?.roles
  }
  return []
})

const jobs = computed(() => {
  if (jobApplication.value?.role) {
    return selectedRole.value?.jobs
  }
  return []
})

// watch(() => jobApplication.value?.branch, (oldVal, newVal) => {
//   if (oldVal !== newVal) {
//     jobApplication.value.department = undefined
//     jobApplication.value.role = undefined
//     jobApplication.value.job = undefined
//   }
// })

// watch(() => jobApplication.value?.department, (oldVal, newVal) => {
//   if (oldVal !== newVal) {
//     jobApplication.value.role = undefined
//     jobApplication.value.job = undefined
//   }
// })

// watch(() => jobApplication.value?.role, (oldVal, newVal) => {
//   if (oldVal !== newVal) {
//     jobApplication.value.job = undefined
//   }
// })

// watch(jobApplication.value, (newVal) => {
//   jobApplication.value = {
//     ...jobApplication.value,
//     ...newVal
//   }
// })

defineExpose({
  validate,
  parse
})

</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Org Details</h3>
    </template>

    <UForm
      ref="jobForm"
      :state="jobApplication"
      :schema="JobApplicationSchema"
      :validate-on="['input']"
      class="space-y-6"
    >
      <div class="grid grid-cols-1 gap-4">
        <!-- Job Selection Section -->
        <UFormField
          label="Branch"
          name="branch"
        >
          <USelectMenu
            v-model="jobApplication.branch"
            :items="props.organizationData.branches"
            label-key="name"
            value-key="branchId"
            class="w-48"
          />
        </UFormField>

        <UFormField
          label="Department"
          name="department"
        >
          <USelectMenu
            v-model="jobApplication.department"
            :items="props.organizationData.branches.find(branch => branch.branchId === jobApplication.branch)?.departments"
            label-key="name"
            value-key="departmentId"
            :disabled="!jobApplication.branch"
            class="w-48"
          />
        </UFormField>

        <UFormField
          label="Role"
          name="role"
        >
          <USelectMenu
            v-model="jobApplication.role"
            :items="props.organizationData.branches.find(branch => branch.branchId === jobApplication.branch)?.departments.find(department => department.departmentId === jobApplication.department)?.roles"
            label-key="title"
            value-key="roleId"
            :disabled="!jobApplication.department"
            class="w-48"
          />
        </UFormField>

        <UFormField
          label="Job"
          name="job"
        >
          <USelectMenu
            v-model="jobApplication.job"
            :items="jobs"
            label-key="title"
            value-key="jobId"
            :disabled="!jobApplication.role"
            class="w-48"
          />
        </UFormField>
      </div>
    </UForm>

    <PersonalInfoForm
      ref="personalInfoForm"
      v-model:job-application="jobApplication"
      :organization-data="props.organizationData"
    />
  </UCard>
</template>