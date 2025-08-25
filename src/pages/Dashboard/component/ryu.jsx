import { Info } from "@/components/common/Info";
import { Card } from "@/components/Dexain";
import CardImage from "@/components/fields/CardImage";
import CardImageOverlay from "@/components/fields/CardImageOverlay";
import Sheet from "@/components/fields/Sheet";
import { Button } from "@/components/Dexain";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const ComponentSlot = ({ containerClassName, textClassName, subTextClassName }) => (
  <div className={cn("flex flex-col justify-center items-center gap-1 w-full h-full bg-info-normal/25 border-dashed border-2 border-info-normal rounded-md", containerClassName)}>
    <h4 className={cn("font-bold text-xl text-info-normal", textClassName)}>[Component Slot]</h4>
    <p className={cn("text-sm text-info-normal", subTextClassName)}>Swap instance to change the component.</p>
  </div>
)

export const ComponentSlotImage = ({ containerClassName }) => (
  <div className={cn("flex flex-col justify-center items-center gap-1 w-full h-full bg-info-normal/25 border-dashed border-2 border-info-normal rounded-md", containerClassName)}>
    <ImageIcon className="size-12 text-info-normal" />
  </div>
)

const sampleImageURL = "https://www.pbs.org/wnet/nature/files/2014/09/mezzanine_506.jpg";

export default function Ryu() {
  const { openSheet, closeSheet, openConfirmationModal, closeConfirmationModal } = useUIStore();

  const handleOpenSheet = (config) => {
    openSheet(config);
  }

  const handleopenConfirmationModal = (variant) => {
    openConfirmationModal({
      title: "Modal Title",
      description: "Modal Description",
      variant: variant || "default",
      content: <ComponentSlot containerClassName="h-36" />,
      footer: (
        <div className={cn("w-full gap-2 flex justify-between")}>
          <Button color="tertiary" variant="outline" size="sm">Cancel</Button>
          <Button color="info" size="sm">Action</Button>
        </div>
      )
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* MODAL */}
      <Button onClick={() => handleopenConfirmationModal("success")}>Open Success Modal GLOBAL</Button>
      <Button onClick={() => handleopenConfirmationModal("warning")}>Open Warning Modal GLOBAL</Button>
      <Button onClick={() => handleopenConfirmationModal("error")}>Open Error Modal GLOBAL</Button>

      {/* SHEET */}
      <Button onClick={() => handleOpenSheet({
        title: "Sheet Title",
        description: "Sheet Description",
        width: "md",
        content: (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">&#9745; Description &#9746; Footer</h1>
            <Card
              title="Card Title"
              description="Card Description"
            >
              <div className="grid grid-cols-2 gap-4 p-4">
                <Info label="EPI Category" value="Packaging" />
                <Info label="EPI Sub Category" value="Packaging Design" />
                <Info containerClassName="col-span-full" label="Change Title" value="Perubahan Pengajuan Design Logo kwkwkkwwk" />
                <Separator className="col-span-full" />
                <Info label="CC No." value="CC-00011" />
                <Info
                  label="Current Process"
                  value={(
                    <Link to="/npd" onClick={closeSheet}>
                      Create ProofPrint
                    </Link>
                  )}
                />
              </div>
            </Card>
            <Card
              title="Card Title"
              description="Card Description"
              headerActionElement="button"
            >
              <ComponentSlot containerClassName="h-72 rounded-t-none" />
            </Card>
            <Card
              title="Card Title"
              description="Card Description"
              headerActionElement="text"
              text="Action"
            >
              <ComponentSlot containerClassName="h-72 rounded-t-none" />
            </Card>
            <Card
              title="Card Title"
              description="Card Description"
              headerActionElement="more"
            >
              <ComponentSlot containerClassName="h-72 rounded-t-none" />
            </Card>
            &nbsp;
            <h1 className="text-2xl font-bold">&#9746; Description &#9745; Footer</h1>
            <Card
              title="Card Title"
              footer={
                <div className={`w-full gap-2 flex justify-end`}>
                  <Button variant="outline">Label</Button>
                  <Button>Label</Button>
                </div>
              }
            >
              <ComponentSlot containerClassName="h-72 rounded-none" />
            </Card>
            <Card
              title="Card Title"
              headerActionElement="button"
              footer={
                <div className={`w-full gap-2 flex justify-end`}>
                  <Button variant="outline">Label</Button>
                  <Button>Label</Button>
                </div>
              }
            >
              <ComponentSlot containerClassName="h-72 rounded-none" />
            </Card>
            <Card
              title="Card Title"
              headerActionElement="text"
              text="Action"
              footer={
                <div className={`w-full gap-2 flex justify-end`}>
                  <Button variant="outline">Label</Button>
                  <Button>Label</Button>
                </div>
              }
            >
              <ComponentSlot containerClassName="h-72 rounded-none" />
            </Card>
            <Card
              title="Card Title"
              headerActionElement="more"
              footer={
                <div className={`w-full gap-2 flex justify-end`}>
                  <Button variant="outline">Label</Button>
                  <Button>Label</Button>
                </div>
              }
            >
              <ComponentSlot containerClassName="h-72 rounded-none" />
            </Card>
          </div>
        ),
        primaryButton: "Primary Button",
        secondaryButton: "Secondary Button",
        buttonPositions: "between",
      })}>
        Open Sheet GLOBAL
      </Button>
      <Button onClick={() => handleOpenSheet({
        title: "Sheet Title",
        description: "Sheet Description",
        width: "sm",
      })}>
        Open Sheet
      </Button>
      <Sheet triggerText="Open Cards">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">&#9745; Description &#9746; Footer</h1>
          <Card
            title="Card Title"
            description="Card Description"
          >
            <div className="grid grid-cols-3 gap-4 p-4">
              <Info label="EPI Category" value="Packaging" />
              <Info label="EPI Sub Category" value="Packaging Design" />
              <Info label="Change Title" value="Perubahan Pengajuan Design Logo wkdaowkdoakdoawkdoaw" />
            </div>
          </Card>
          <Card
            title="Card Title"
            description="Card Description"
            headerActionElement="button"
          >
            <ComponentSlot containerClassName="h-72 rounded-t-none" />
          </Card>
          <Card
            title="Card Title"
            description="Card Description"
            headerActionElement="text"
            text="Action"
          >
            <ComponentSlot containerClassName="h-72 rounded-t-none" />
          </Card>
          <Card
            title="Card Title"
            description="Card Description"
            headerActionElement="more"
          >
            <ComponentSlot containerClassName="h-72 rounded-t-none" />
          </Card>
          &nbsp;
          <h1 className="text-2xl font-bold">&#9746; Description &#9745; Footer</h1>
          <Card
            title="Card Title"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button variant="outline">Label</Button>
                <Button>Label</Button>
              </div>
            }
          >
            <ComponentSlot containerClassName="h-72 rounded-none" />
          </Card>
          <Card
            title="Card Title"
            headerActionElement="button"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button variant="outline">Label</Button>
                <Button>Label</Button>
              </div>
            }
          >
            <ComponentSlot containerClassName="h-72 rounded-none" />
          </Card>
          <Card
            title="Card Title"
            headerActionElement="text"
            text="Action"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button variant="outline">Label</Button>
                <Button>Label</Button>
              </div>
            }
          >
            <ComponentSlot containerClassName="h-72 rounded-none" />
          </Card>
          <Card
            title="Card Title"
            headerActionElement="more"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button variant="outline">Label</Button>
                <Button>Label</Button>
              </div>
            }
          >
            <ComponentSlot containerClassName="h-72 rounded-none" />
          </Card>
        </div>
      </Sheet>
      <Sheet triggerText="Open Image Cards" width="xl">
        <div className="grid grid-cols-2 gap-4 h-fit">
          <CardImage
            title="Card Title"
            description="Card Description"
            image={sampleImageURL}
          />
          <CardImage
            title="Card Title"
            image={sampleImageURL}
          />
          <CardImage
            title="Card Title"
            description="Card Description"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button>Label</Button>
              </div>
            }
          />
          <CardImage
            title="Card Title"
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button>Label</Button>
              </div>
            }
          />
        </div>
      </Sheet>
      <Sheet triggerText="Open Image Overlay Cards" width="xl">
        <div className="grid grid-cols-2 gap-4 h-fit">
          <CardImageOverlay
            title="Card Title"
            description="Card Description"
          />
          <CardImageOverlay
            title="Card Title"
          />
          <CardImageOverlay
            title="Card Title"
            description="KWAODKWAPKDAOWKDAWOKDAPWDKWAPODKAWODKAWOPDKAWOPD KWAODKWAPKDAOWKDAWOKDAPWDKWAPODKAWODKAWOPDKAWOPD KWAODKWAPKDAOWKDAWOKDAPWDKWAPODKAWODKAWOPDKAWOPD KWAODKWAPKDAOWKDAWOKDAPWDKWAPODKAWODKAWOPDKAWOPD"
            image={sampleImageURL}
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button>Label</Button>
              </div>
            }
          />
          <CardImageOverlay
            title="Card Title"
            image={sampleImageURL}
            footer={
              <div className={`w-full gap-2 flex justify-end`}>
                <Button>Label</Button>
              </div>
            }
          />
        </div>
      </Sheet>
      <Sheet side="right" width="md" description="This is a description" primaryButton="Primary Button" secondaryButton="Secondary Button" onOk={() => { }} onCancel={() => { }} buttonPositions="between" />
      <Sheet side="right" width="lg" description="This is a description" primaryButton="Primary Button" secondaryButton="Secondary Button" onOk={() => { }} onCancel={() => { }} buttonPositions="between" />
      <Sheet side="right" width="xl" description="This is a description" primaryButton="Primary Button" secondaryButton="Secondary Button" onOk={() => { }} onCancel={() => { }} buttonPositions="between" />
      <Sheet side="right" width="xxl" description="This is a description" primaryButton="Primary Button" secondaryButton="Secondary Button" onOk={() => { }} onCancel={() => { }} buttonPositions="between" />
      <Sheet side="right" width="full" description="This is a description" primaryButton="Primary Button" secondaryButton="Secondary Button" onOk={() => { }} onCancel={() => { }} buttonPositions="between" />
    </div>
  );
}
