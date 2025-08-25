import { ComponentExample } from "./ComponentExample";
import { TextEditor, Button } from "@/components/Dexain";
import { FormProvider, useForm } from "react-hook-form";

const TextEditorExample = () => {
    const methods = useForm({
        defaultValues: {
            textEditor: "Hello World"
        }
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <ComponentExample title="Text Editor">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <TextEditor 
                        name="textEditor"
                        label="Text Editor"
                        placeholder="Write something..."
                        required={true}
                    />
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </FormProvider>
        </ComponentExample>
    );
};

export default TextEditorExample;