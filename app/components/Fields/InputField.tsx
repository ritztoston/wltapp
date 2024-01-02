import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

import { classNames } from "~/utilities";

interface Fields {
  name: string;
  label?: string;
  className?: string;
  error?: string;
  autoComplete?: string;
  type?: HTMLInputTypeAttribute | undefined;
  accept?: string;
  defaultValue?: string | undefined;
  value?: string | undefined;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  inputClassName?: string;
  optional?: boolean;
  key?: string | number;
  placeholder?: string;
  disableErrorText?: boolean;
  required?: boolean;
  htmlFor?: string;
  [x: string]: unknown;
}

export const InputField = ({
  name,
  label,
  error,
  autoComplete,
  type = "text",
  className = "",
  defaultValue = undefined,
  onChange = undefined,
  value = undefined,
  disabled = false,
  accept = undefined,
  inputClassName = "",
  optional = false,
  placeholder,
  disableErrorText,
  required,
  htmlFor = undefined,
  ...x
}: Fields) => {
  let filteredDefaultValue = defaultValue;
  switch (filteredDefaultValue) {
    case "New":
    case "User":
      filteredDefaultValue = undefined;
      break;
  }
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={htmlFor ? htmlFor : name}
          className="block text-sm font-medium text-gray-300"
        >
          {label}{" "}
          {optional ? (
            <span className="italic text-gray-400">(Optional)</span>
          ) : (
            ``
          )}
        </label>
      ) : null}
      <div
        className={classNames(
          label ? "mt-1" : "",
          "relative rounded-md shadow-sm",
        )}
      >
        <input
          type={type}
          id={htmlFor ? htmlFor : name}
          name={name}
          disabled={disabled}
          accept={accept}
          className={classNames(
            error ? "border-red-400" : "border-gray-300",
            inputClassName
              ? inputClassName
              : "block w-full rounded-md shadow-sm placeholder:text-gray-400 focus:border-main-blue focus:ring-main-blue disabled:pointer-events-none disabled:opacity-25 sm:text-sm",
          )}
          autoComplete={autoComplete}
          defaultValue={filteredDefaultValue}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          {...x}
        />
        {error ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>
      {!disableErrorText && error ? (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
