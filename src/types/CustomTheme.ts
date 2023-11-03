import type { CustomFlowbiteTheme } from "flowbite-react";

export const customTextInputTheme: CustomFlowbiteTheme = {
  textInput: {
    field: {
      input: {
        colors: {
          primary:
            "bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-[#393f47] dark:bg-[#1d232a] dark:text-[#a7adba] dark:placeholder-gray-400 dark:focus:border-[#1c64f2] dark:focus:ring-[#1c64f2]",
        },
        sizes: {
          base: "p-[11.4px] text-base",
        },
      },
    },
  },
};

export const customDatepickerTheme: CustomFlowbiteTheme = {
  datepicker: {
    popup: {
      root: {
        inner:
          "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-[#1d232a]",
      },
    },
  },

  ...customTextInputTheme,
};
