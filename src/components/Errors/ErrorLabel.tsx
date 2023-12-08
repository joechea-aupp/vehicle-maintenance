import { FieldError } from "react-hook-form";

type Props = {
  fieldError: FieldError | undefined;
};

export default function ErrorLabel({ fieldError }: Props) {
  if (!fieldError) {
    return null;
  }

  return (
    <span className="label-text-alt text-red-500">{fieldError.message}</span>
  );
}
