"use client";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { InputProps } from "../Input/Input";
import { FocusEventHandler } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  placeholder: string;
  selected?: SelectOption;
  options: SelectOption[];
  onChange: (selected: SelectOption) => void;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  formName?: string;
} & Omit<InputProps, "inputProps">;

const compareBy = (optionA?: SelectOption, optionB?: SelectOption) =>
  optionA?.value === optionB?.value;

export const Select = ({
  options,
  label,
  onChange,
  onBlur,
  selected,
  placeholder,
  id,
  error,
  formName,
  disabled,
  isRequired,
}: SelectProps) => {
  return (
    <Listbox
      value={selected}
      onChange={onChange}
      as={"div"}
      className="relative flex flex-col w-full"
      onBlur={onBlur}
      by={compareBy}
      name={formName}
      disabled={disabled}
    >
      <Listbox.Label
        className={`font-semibold ${
          error ? "text-red-600" : "text-gray-800"
        }  text-sm mb-1`}
        htmlFor={`select--${id}`}
      >
        {label}
        {isRequired && "*"}
      </Listbox.Label>
      <Listbox.Button
        id={`select--${id}`}
        className={`relative p-2 px-4 bg-white border ${
          error ? "border-red-600" : "border-gray-800"
        } font-normal text-gray-800 text-sm rounded w-full flex justify-between disabled:bg-black/10 disabled:cursor-not-allowed`}
      >
        <span className="block truncate">
          {selected?.value ? selected.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
        as={"div"}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={"relative"}
      >
        <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none text-sm">
          {options.map((option) => (
            <Listbox.Option
              key={`select-option-${option.value}`}
              className={({ active }) =>
                `cursor-pointer select-none p-2 pl-9 text-gray-900 relative ${
                  active ? "bg-gray-100" : ""
                }`
              }
              value={option}
            >
              {({ selected }) => (
                <>
                  {selected && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-900">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
      {error && (
        <p className="mt-1 text-sm font-normal text-red-600">{error}</p>
      )}
    </Listbox>
  );
};
