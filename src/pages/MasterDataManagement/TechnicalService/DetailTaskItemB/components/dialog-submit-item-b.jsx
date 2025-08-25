import { Button, Dialog, Input, TextArea } from '@/components/Dexain'
import { DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label';
import { Info } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation
const formSchema = (type) => {
  if(type === 'REJECT') {
    return z.object({
      email: z.string().email("Email tidak valid").nonempty("Email wajib diisi"),
      password: z.string().min(3, "Password minimal 3 karakter").nonempty("Password wajib diisi"),
      notes: z.string().nonempty("Notes wajib diisi"),
    })
  }
  
  return z.object({
    email: z.string().email("Email tidak valid").nonempty("Email wajib diisi"),
    password: z.string().min(3, "Password minimal 3 karakter").nonempty("Password wajib diisi"),
    notes: z.string().optional(),
  })
};

const DialogSubmitItemB = ({
  dialog, setDialog, onSubmit, type
}) => {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema(type)),
    defaultValues: {
      email: '',
      password: '',
      notes: ''
    }
  });

  const formCondition = () => {
    if (type === 'APPROVE') return 'Approval Form'
    if (type === 'REJECT') return 'Rejection Form'
    if (type === 'ARCHIVE') return 'Archive Form'
  }

  return (
    <Dialog isOpen={dialog.approve} onClose={() => { setDialog(prev => ({ ...dialog, approve: !prev })) }}>
      <DialogContent>
        <div className="flex items-center justify-center flex-col">
          <Info size={150} className="text-[#E58200]" />
          <h1 className="text-2xl font-semibold">{formCondition()}</h1>
          <p className="text-sm text-gray-500">Please review again because this action cannot be undone.</p>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email..."
                  />
                )}
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 text-left">{errors.email.message}</p>
              )}
            </div>

            <div className="w-full mt-2">
              <Label>Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <Input
                    type="password"
                    placeholder="Password..."
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 text-left">{errors.password.message}</p>
              )}
            </div>

            <div className="w-full mt-2">
              <Label>Notes</Label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <TextArea
                            placeholder="Enter your comment here..."
                            {...field}
                        />
                    )}
                />
              {errors.notes && (
                <p className="text-rose-500 text-xs mt-1 text-left">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2 w-full border-dashed mt-4">
              <Button
                type="button"
                className="w-1/3"
                variant="outline"
                onClick={() => { setDialog(prev => ({ ...dialog, approve: !prev })) }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#D32F2F] to-[#7F1710] text-white w-1/3"
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSubmitItemB
