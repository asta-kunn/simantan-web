import React, { useState } from "react";
import { ComponentExample } from "./ComponentExample";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Dexain";

/**
 * Dialog component documentation and examples
 */
const DialogExample = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Dialog</h2>
      <p className="text-gray-600 mb-6">
        A modal dialog component that interrupts the user with important content and expects a response.
      </p>

      {/* Basic Dialog */}
      <ComponentExample
        title="Basic Dialog"
        description="Standard dialog with header, content, and footer"
        code={`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
`}
      >
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ComponentExample>

      {/* Controlled Dialog */}
      <ComponentExample
        title="Controlled Dialog"
        description="Dialog with controlled open state and form elements"
        code={`import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Dexain";

const [open, setOpen] = useState(false);
const [name, setName] = useState("");

<div>
  <Button onClick={() => setOpen(true)}>
    Open Controlled Dialog
  </Button>
  
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Enter details for your new project. Click create when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Input
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          formik={false}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => {
          alert(\`Project "\${name}" created!\`);
          setName("");
          setOpen(false);
        }}>
          Create Project
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
`}
      >
        <div className="flex justify-center">
          <div>
            <Button onClick={() => setOpen(true)}>
              Open Controlled Dialog
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Enter details for your new project. Click create when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    label="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    formik={false}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    alert(`Project "${name}" created!`);
                    setName("");
                    setOpen(false);
                  }}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ComponentExample>

      {/* Destructive Dialog (Confirmation) */}
      <ComponentExample
        title="Destructive Dialog (Confirmation)"
        description="Dialog for confirming destructive actions like deletion"
        code={`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this item? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="mt-4">
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
`}
      >
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ComponentExample>

      {/* Props Reference */}
      <div className="mt-12 border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Props Reference</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Component</th>
              <th className="p-2 border">Props</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border" rowSpan="3"><code>Dialog</code></td>
              <td className="p-2 border"><code>open</code></td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">Controls the open state of the dialog</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>onOpenChange</code></td>
              <td className="p-2 border">function</td>
              <td className="p-2 border">Callback fired when open state changes</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>modal</code></td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">Whether to block interaction with the rest of the page</td>
            </tr>
            <tr>
              <td className="p-2 border" rowSpan="2"><code>DialogTrigger</code></td>
              <td className="p-2 border"><code>asChild</code></td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">Pass the child as the trigger element</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>className</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">Additional CSS classes</td>
            </tr>
            <tr>
              <td className="p-2 border" rowSpan="2"><code>DialogContent</code></td>
              <td className="p-2 border"><code>className</code></td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">Additional CSS classes</td>
            </tr>
            <tr>
              <td className="p-2 border"><code>onEscapeKeyDown</code></td>
              <td className="p-2 border">function</td>
              <td className="p-2 border">Callback fired when escape key is pressed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DialogExample; 