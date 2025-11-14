import React from 'react'
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { Description, FieldError, Input, Label, fieldBorderStyles } from '../field'
import { composeTailwindRenderProps, focusRing } from '../../utils'
import { useController, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'

const inputStyles = tv({
  extend: focusRing,
  base: 'border-2 rounded-md',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled
  }
})

interface FormTextFieldProps<T extends FieldValues = FieldValues> extends AriaTextFieldProps {
  control: Control<T>
  name: Path<T>
  label?: React.ReactNode
  rules?:
    | Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    | undefined
  description?: React.ReactNode
}

export const FormTextField = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  rules,
  description,
  ...props
}: FormTextFieldProps<T>): React.JSX.Element => {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error, ...rest },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: rules
  })
  console.log(error);

  return (
    <AriaTextField
      {...props}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      ref={field.ref}
      className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1')}
    >
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      {error && <FieldError>{error.message}</FieldError>}
    </AriaTextField>
  )
}
