import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const Form = memo(
  ({ methods, validation, onSubmit, defaultValues, children }) => {
    let finalMethods;

    if (methods) {
      finalMethods = methods;
    } else {
      finalMethods = useForm({
        resolver: zodResolver(validation),
        defaultValues,
      });
    }

    if (Object.keys(finalMethods.formState.errors).length > 0) {
      console.log({ errors: finalMethods.formState.errors });
    }

    return (
      <FormProvider {...finalMethods}>
        <form onSubmit={finalMethods.handleSubmit(onSubmit)}>{children}</form>
      </FormProvider>
    );
  }
);
