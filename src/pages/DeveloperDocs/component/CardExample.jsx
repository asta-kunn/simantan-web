import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Card, Button } from "@/components/Dexain";
import MainCard from "@/components/common/MainCard";
import CardCommon from "@/components/common/Card";
import CardDescription from "@/components/common/CardDescription";
import { ComponentSlot } from "@/pages/Dashboard/component/ryu";

/**
 * Card component documentation and examples
 */
const CardExample = () => {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Card</h2>
        <i className="text-gray-400 text-lg">
          A flexible card component for displaying content in a container with optional header, footer, and styling.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Card */}
        <ComponentExample
          title="Basic Card"
          description="Simple card with title, description, and content"
          code={`import { Card } from "@/components/Dexain";

<Card
  title="Card Title"
  description="This is a card description that explains the content"
>
  <p>Card content goes here. You can include any elements within the card.</p>
</Card>
`}
        >
          <Card
            title="Card Title"
            description="This is a card description that explains the content"
          >
            <ComponentSlot containerClassName="h-36" />
          </Card>
        </ComponentExample>

        {/* Card with Footer */}
        <ComponentExample
          title="Card with Footer"
          description="Card with a footer section for actions or additional information"
          code={`import { Card, Button } from "@/components/Dexain";

<Card
  title="Card with Footer"
  description="Cards can include a footer for actions"
  footer={
    <div className="flex justify-end space-x-2">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </div>
  }
>
  <p>This card features a footer with action buttons.</p>
</Card>
`}
        >
          <Card
            title="Card with Footer"
            description="Cards can include a footer for actions"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </div>
            }
          >
            <ComponentSlot containerClassName="h-36" />
          </Card>
        </ComponentExample>

        {/* Card with Custom Styling */}
        <ComponentExample
          title="Card with Custom Styling"
          description="Cards can be customized with additional classNames"
          code={`import { Card } from "@/components/Dexain";

<Card
  title="Styled Card"
  description="This card has custom styling applied"
  className="border-blue-200 shadow-md"
>
  <p className="text-blue-700">Card content with custom text styling</p>
</Card>
`}
        >
          <Card
            title="Styled Card"
            description="This card has custom styling applied"
            className="border-blue-200 shadow-md"
          >
            <p className="text-blue-700">Card content with custom text styling</p>
          </Card>
        </ComponentExample>

        {/* Headerless Card */}
        <ComponentExample
          title="Headerless Card"
          description="Card without title or description, useful as a simple container"
          code={`import { Card } from "@/components/Dexain";

<Card className="p-6">
  <div className="text-center">
    <h3 className="text-xl font-bold">Custom Header</h3>
    <p className="mt-2">
      This card doesn't use the built-in header, allowing for complete
      customization of the layout and styling.
    </p>
  </div>
</Card>
`}
        >
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold">Custom Header</h3>
              <p className="mt-2">
                This card doesn't use the built-in header, allowing for complete
                customization of the layout and styling.
              </p>
            </div>
          </Card>
        </ComponentExample>

        <ComponentExample
          title="Main Card"
          description="Main card with title, description, and content"
          code={`import MainCard from "@/components/common/MainCard";
import Badge from "@/components/fields/Badge";

<MainCard
  title="Main Card Title"
  subtitle="Subtitle"
  badgeTitle="Status"
  badgeSubtitle="In Progress"
  badgeSubtitleColor="blue"
  titleBody="Content Title"
  titleBodyBadge="Active"
  titleBodyBadgeColor="green"
  //scrollable={false}
  //maxHeight="200px"
  //className=""
  //children={}
>
  <p>Main card content goes here. This card includes a header with badges and a content section.</p>
</MainCard>
`}
        >
          <MainCard
            title="Main Card Title"
            subtitle="Subtitle"
            badgeTitle="Status"
            badgeSubtitle="In Progress"
            badgeSubtitleColor="blue"
            titleBody="Content Title"
            titleBodyBadge="Active"
            titleBodyBadgeColor="green"
          >
            <p>Main card content goes here. This card includes a header with badges and a content section.</p>
          </MainCard>
        </ComponentExample>

        <ComponentExample
          title="Card Description"
          description="Card for displaying product and manufacturing site information"
          code={`import CardDescription from "@/components/common/CardDescription";

<CardDescription
  cardDescriptionTitle="Product Name"
  item={[
    {
      name: "Manufacturing Site 1",
      materials: ["Material A", "Material B"]
    },
    {
      name: "Manufacturing Site 2",
      materials: ["Material C", "Material D"]
    }
  ]}
/>
`}
        >
          <CardDescription
            cardDescriptionTitle="Product Name"
            item={[
              {
                name: "Manufacturing Site 1",
                materials: ["Material A", "Material B"]
              },
              {
                name: "Manufacturing Site 2",
                materials: ["Material C", "Material D"]
              }
            ]}
          />
        </ComponentExample>

        <ComponentExample
          title="Common Card"
          description="A flexible card component with customizable styling and badges"
          code={`import CardCommon from "@/components/common/Card";

<CardCommon
  title="Card Title"
  variant="light"
  scrollable={true}
  maxHeight="300px"
  className=""
  // customStyle={{
  // children={}
>
  <p>This is a common card with badges and scrollable content.</p>
  <p>You can add multiple paragraphs here.</p>
  <p>The content will scroll if it exceeds the maxHeight.</p>
</CardCommon>
`}
        >
          <CardCommon
            title="Card Title"
            variant="light"
            scrollable={true}
            maxHeight="300px"
            className=""
          // customStyle={{
          // children={}
          >
            <p>This is a common card with badges and scrollable content.</p>
            <p>You can add multiple paragraphs here.</p>
            <p>The content will scroll if it exceeds the maxHeight.</p>
          </CardCommon>
        </ComponentExample>

        {/* Card Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Card Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    title
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string | ReactNode
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    The title displayed in the card header
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    description
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string | ReactNode
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    The description text displayed below the title
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    children
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ReactNode
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    The content to be displayed in the card body
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    footer
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ReactNode
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    undefined
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Content to be displayed in the card footer
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    className
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    string
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ""
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Additional CSS classes to apply to the card
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CardCommon Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">CardCommon Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The title displayed at the top of the card</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">variant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"light" | "dark"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"light"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The visual style variant of the card</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">scrollable</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the card content should be scrollable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">maxHeight</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"400px"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Maximum height of the card when scrollable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the card</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">customStyle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">object</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">empty object</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Custom styles to apply to the card and its content</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">children</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The content to be displayed in the card</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MainCard Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">MainCard Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The main title displayed in the card header</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">subtitle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The subtitle displayed in the card header</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">badgeTitle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Badge text displayed next to the title</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">badgeSubtitle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Badge text displayed next to the subtitle</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">badgeSubtitleColor</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string  ("green", "red", "blue", "gray")</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">gray</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Color of the subtitle badge</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">titleBody</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Title displayed in the card body</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">titleBodyBadge</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Badge text displayed next to the body title</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">titleBodyBadgeColor</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"green"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Color of the body title badge</td>

                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">scrollable</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the card content should be scrollable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">maxHeight</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"400px"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Maximum height of the card when scrollable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the card</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">children</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The content to be displayed in the card</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CardDescription Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">CardDescription Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cardDescriptionTitle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The Title name displayed at the top of the card</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">item</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Array</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Array of manufacturing sites with their materials</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">className</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Additional CSS classes to apply to the card</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardExample; 