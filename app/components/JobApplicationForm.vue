<script setup>
import { ref, computed, watch } from 'vue'
import { object, string } from 'yup'

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

const formSchema = object({
  branch: string().required('Branch is required'),
  department: string().required('Department is required'),
  role: string().required('Role is required'),
  job: string().required('Job is required'),
})

const formRef = ref(null)

// Method that parent can call to validate entire form
const validate = async () => {
  try {
    const [formValid, personalInfoValid, skillsValid] = await Promise.all([
      formRef.value?.validate(),
      personalInfoRef.value?.validate(),
      skillsRef.value?.validate()
    ])
  } catch (error) {
    throw error
  }
}

// Add parse method alongside validate
const parse = async () => {
  try {
    const [formParsed, personalInfoParsed, skillsParsed] = await Promise.all([
      formSchema.validate(jobApplication.value, { stripUnknown: true }),
      personalInfoRef.value?.parse(),
      skillsRef.value?.parse()
    ])

    return {
      ...formParsed,
      personalInfo: personalInfoParsed,
      skills: skillsParsed
    }
  } catch (error) {
    throw error
  }
}

const personalInfoRef = ref(null)
const skillsRef = ref(null)

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

watch(() => jobApplication.value?.branch, (oldVal, newVal) => {
  if (oldVal !== newVal) {
    jobApplication.value.department = undefined
    jobApplication.value.role = undefined
    jobApplication.value.job = undefined
  }
})

watch(() => jobApplication.value?.department, (oldVal, newVal) => {
  if (oldVal !== newVal) {
    jobApplication.value.role = undefined
    jobApplication.value.job = undefined
  }
})

watch(() => jobApplication.value?.role, (oldVal, newVal) => {
  if (oldVal !== newVal) {
    jobApplication.value.job = undefined
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
      <h3 class="text-lg font-semibold">Org Details</h3>
    </template>

    <UForm
      ref="formRef"
      :state="jobApplication"
      :schema="formSchema"
      :validate-on="['blur', 'change', 'input']"
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
            :items="departments"
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
            :items="roles"
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

        <!-- Nested Form Components -->
        <PersonalInfoForm
          ref="personalInfoRef"
          v-model:job-application="jobApplication"
          :organization-data="props.organizationData"
        />
      </div>
    </UForm>
  </UCard>
</template>