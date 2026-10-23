<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from '@adonisjs/inertia/vue'
import type { AuthFormField, ButtonProps, SeparatorProps } from '@nuxt/ui'
import type { urlFor } from '~/client'

/**
 * Port of Nuxt UI's <UAuthForm> built on the AdonisJS <Form> component.
 *
 * The form is a regular HTML form submitted by Inertia to a named AdonisJS
 * route: there is no client-side schema, VineJS on the server is the single
 * source of truth and its errors are displayed under the matching fields.
 * Extra attributes (`:options`, `reset-on-error`, `@success`...) are
 * forwarded to <Form>.
 */
defineOptions({ inheritAttrs: false })

type RouteName = Parameters<typeof urlFor>[0]
type Slot = (props?: any) => any
type UiSlots =
  | 'root'
  | 'header'
  | 'leading'
  | 'leadingIcon'
  | 'title'
  | 'description'
  | 'body'
  | 'providers'
  | 'separator'
  | 'form'
  | 'footer'

const props = withDefaults(
  defineProps<{
    /**
     * Named AdonisJS route the form is submitted to
     */
    route: RouteName
    /**
     * The icon displayed above the title
     */
    icon?: string
    title?: string
    description?: string
    fields?: AuthFormField[]
    /**
     * Buttons displayed under the description, e.g. social logins
     */
    providers?: ButtonProps[]
    /**
     * Text displayed in the separator between providers and fields
     */
    separator?: string | SeparatorProps
    /**
     * Props of the submit button. Defaults to `{ label: 'Continue', block: true }`
     */
    submit?: ButtonProps
    disabled?: boolean
    /**
     * Fields to clear when the server rejects the submission, e.g.
     * `['password']`. `true` clears every field.
     */
    resetOnError?: boolean | string[]
    ui?: Partial<Record<UiSlots, string>>
  }>(),
  {
    icon: undefined,
    title: undefined,
    description: undefined,
    fields: () => [],
    providers: () => [],
    separator: 'or',
    submit: undefined,
    resetOnError: false,
    ui: undefined,
  }
)

const slots = defineSlots<
  {
    header?: Slot
    leading?: Slot
    title?: Slot
    description?: Slot
    providers?: Slot
    separator?: Slot
    validation?: (props: { errors: Record<string, string> }) => any
    submit?: (props: { processing: boolean }) => any
    footer?: Slot
  } & Record<string, Slot | undefined>
>()

/**
 * Props for <UFormField> (label, hint...). Checkboxes render their own label.
 */
const formFieldKeys = ['name', 'label', 'description', 'help', 'hint', 'size', 'required']

/**
 * Props owned by <UFormField> and not forwarded to the control
 */
const formFieldOnlyKeys = ['type', 'help', 'hint', 'size', 'required', 'error']

function formFieldProps(field: AuthFormField) {
  const keys =
    field.type === 'checkbox' ? ['name', 'help', 'hint', 'size', 'required'] : formFieldKeys
  return Object.fromEntries(Object.entries(field).filter(([key]) => keys.includes(key)))
}

/**
 * Props for the control itself (placeholder, autocomplete...). `name` is kept
 * so the browser includes the value in the submitted form data.
 */
function controlProps(field: AuthFormField) {
  const omitted =
    field.type === 'checkbox' ? formFieldOnlyKeys : [...formFieldOnlyKeys, 'label', 'description']
  return Object.fromEntries(Object.entries(field).filter(([key]) => !omitted.includes(key)))
}

/**
 * Field values. The controls are bound to this state (like <UAuthForm>) and
 * also carry a `name`, so the native form data submitted by <Form> picks
 * them up. Keeping them controlled preserves what the user typed when the
 * page re-renders with validation errors.
 */
const state = reactive<Record<string, any>>(
  Object.fromEntries(props.fields.map((field) => [field.name, field.defaultValue]))
)

function onError() {
  const names = props.resetOnError === true ? Object.keys(state) : props.resetOnError || []
  for (const name of names) {
    state[name] = props.fields.find((field) => field.name === name)?.defaultValue
  }
}

defineExpose({ state })

/**
 * Read the server-side validation error of a field
 */
function errorOf(errors: object, name: string) {
  return (errors as Record<string, string | undefined>)[name]
}

const passwordVisibility = reactive<Record<string, boolean>>({})
</script>

<template>
  <div data-slot="root" :class="['w-full space-y-6', props.ui?.root]">
    <div
      v-if="
        props.icon ||
        slots.leading ||
        props.title ||
        slots.title ||
        props.description ||
        slots.description ||
        slots.header
      "
      data-slot="header"
      :class="['flex flex-col text-center', props.ui?.header]"
    >
      <slot name="header">
        <div
          v-if="props.icon || slots.leading"
          data-slot="leading"
          :class="['mb-2', props.ui?.leading]"
        >
          <slot name="leading">
            <UIcon
              v-if="props.icon"
              :name="props.icon"
              :class="['size-8 shrink-0 inline-block', props.ui?.leadingIcon]"
            />
          </slot>
        </div>

        <div
          v-if="props.title || slots.title"
          data-slot="title"
          :class="['text-xl text-pretty font-semibold text-highlighted', props.ui?.title]"
        >
          <slot name="title">{{ props.title }}</slot>
        </div>

        <div
          v-if="props.description || slots.description"
          data-slot="description"
          :class="['mt-1 text-base text-pretty text-muted', props.ui?.description]"
        >
          <slot name="description">{{ props.description }}</slot>
        </div>
      </slot>
    </div>

    <div data-slot="body" :class="['gap-y-6 flex flex-col', props.ui?.body]">
      <div
        v-if="props.providers?.length || slots.providers"
        :class="['space-y-3', props.ui?.providers]"
      >
        <slot name="providers">
          <UButton
            v-for="(provider, index) in props.providers"
            :key="index"
            block
            color="neutral"
            variant="subtle"
            v-bind="provider"
          />
        </slot>
      </div>

      <slot name="separator">
        <USeparator
          v-if="props.providers?.length && props.fields?.length"
          v-bind="
            typeof props.separator === 'object' ? props.separator : { label: props.separator }
          "
          :class="props.ui?.separator"
        />
      </slot>

      <Form
        v-if="props.fields?.length"
        v-slot="{ errors, processing }"
        :route="props.route"
        v-bind="$attrs"
        :class="['space-y-5', props.ui?.form]"
        data-slot="form"
        @error="onError"
      >
        <UFormField
          v-for="field in props.fields"
          :key="field.name"
          v-bind="formFieldProps(field)"
          :error="errorOf(errors, field.name) ?? field.error"
        >
          <slot
            :name="`${field.name}-field`"
            v-bind="{ field, state, error: errorOf(errors, field.name) }"
          >
            <UCheckbox
              v-if="field.type === 'checkbox'"
              v-model="state[field.name]"
              :disabled="props.disabled"
              v-bind="controlProps(field)"
            />
            <USelectMenu
              v-else-if="field.type === 'select'"
              v-model="state[field.name]"
              class="w-full"
              :disabled="props.disabled"
              v-bind="controlProps(field)"
            />
            <UPinInput
              v-else-if="field.type === 'otp'"
              :id="field.name"
              v-model="state[field.name]"
              class="w-full"
              otp
              :disabled="props.disabled"
              v-bind="controlProps(field)"
            />
            <UInput
              v-else-if="field.type === 'password'"
              v-model="state[field.name]"
              class="w-full"
              :disabled="props.disabled"
              v-bind="controlProps(field)"
              :type="passwordVisibility[field.name] ? 'text' : 'password'"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="passwordVisibility[field.name] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="passwordVisibility[field.name] ? 'Hide password' : 'Show password'"
                  :aria-pressed="!!passwordVisibility[field.name]"
                  @click="passwordVisibility[field.name] = !passwordVisibility[field.name]"
                />
              </template>
            </UInput>
            <UInput
              v-else
              v-model="state[field.name]"
              class="w-full"
              :disabled="props.disabled"
              v-bind="controlProps(field)"
              :type="field.type"
            />
          </slot>

          <template v-if="slots[`${field.name}-label`]" #label>
            <slot :name="`${field.name}-label`" />
          </template>
          <template v-if="slots[`${field.name}-description`]" #description>
            <slot :name="`${field.name}-description`" />
          </template>
          <template v-if="slots[`${field.name}-hint`]" #hint>
            <slot :name="`${field.name}-hint`" />
          </template>
          <template v-if="slots[`${field.name}-help`]" #help>
            <slot :name="`${field.name}-help`" />
          </template>
          <template v-if="slots[`${field.name}-error`]" #error>
            <slot :name="`${field.name}-error`" :error="errorOf(errors, field.name)" />
          </template>
        </UFormField>

        <slot name="validation" :errors="errors" />

        <slot name="submit" :processing="processing">
          <UButton
            type="submit"
            label="Continue"
            block
            :loading="processing"
            :disabled="props.disabled"
            v-bind="props.submit"
          />
        </slot>
      </Form>
    </div>

    <div
      v-if="slots.footer"
      data-slot="footer"
      :class="['text-sm text-center text-muted mt-2', props.ui?.footer]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
