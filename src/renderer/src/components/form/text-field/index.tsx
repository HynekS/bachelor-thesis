import { TextField, Label, Input, Text } from 'react-aria-components'
import { useController, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'

interface FormTextFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  label: React.ReactNode
  rules?:
    | Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    | undefined
}

const FormTextField = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  rules
}: FormTextFieldProps<T>): React.JSX.Element => {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: rules
  })

  return (
    <TextField
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      ref={field.ref}
    >
      <Label>{label}</Label>
      <Input />
      {error && <Text slot="description">Password must be at least 8 characters.</Text>}
    </TextField>
  )
}

export default FormTextField