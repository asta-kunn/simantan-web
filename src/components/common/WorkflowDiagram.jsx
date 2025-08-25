import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { Button } from "@/components/fields/Button";
import { Form } from "@/components/fields/Form";
import { Input } from "@/components/fields/Input";
import { Select } from "@/components/fields/Select";
import { TextArea } from "@/components/fields/TextArea";
import ReactFlow, { Background, useNodesState, useEdgesState } from "reactflow";
import dagre from "dagre";
import * as Yup from "yup";

/** Styles */
import "reactflow/dist/style.css";

/** Icons */
import { Loader2, Download } from "lucide-react";

/** Stores */
import { useUIStore } from "@/stores/uiStore";

/** Hooks */
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "../../hooks/use-mutation";

/** Services */
import {
  actionWorkflowTask,
  getWorkflowTask,
} from "@/services/workflow.service";
import { getUsers } from "@/services/master-data/user.service";

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph options with reduced spacing
  dagreGraph.setGraph({ rankdir: direction, nodesep: 90, ranksep: 40 });

  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    // Adjust height based on node type
    const nodeHeight = node.type === "default" ? 120 : 60; // Increased height for task nodes
    dagreGraph.setNode(node.id, { width: 200, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Apply the calculated positions to the nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const nodeHeight = node.type === "default" ? 120 : 60;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100, // Center the node (width/2)
        y: nodeWithPosition.y - nodeHeight / 2, // Center the node (height/2)
      },
      draggable: false, // Make nodes non-draggable
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const WorkflowDiagram = memo(({ workflowId, refetch }) => {
  /** Declarations */
  const effectRan = useRef(false);

  /** Store */
  const { openSheet, closeSheet } = useUIStore();

  /** Mutation */
  const getWorkflowTaskMutation = useMutation(getWorkflowTask);

  /** State */
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [data, setData] = useState([]);

  /** Use Effect */
  useEffect(() => {
    handleSearchWorkflowTask();
    // if (effectRan.current === false) {
    //   handleSearchWorkflowTask();
    //   effectRan.current = true;
    // }
  }, [workflowId]);

  useEffect(() => {
    if (getWorkflowTaskMutation.response?.data?.length > 0) {
      setData(getWorkflowTaskMutation.response.data);
    }
  }, [getWorkflowTaskMutation.response]);

  useEffect(() => {
    if (data?.length > 0) {
      // Create initial nodes from the provided data
      const initialNodes = data.map((task) => ({
        id: task.TASK_CODE,
        data: {
          label: (
            <div>
              <div style={{ fontWeight: "bold" }}>{task.TASK_NAME}</div>
              <div style={{ fontSize: "12px" }}>PIC : {task.PIC}</div>
              {/* <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                {task.STATUS}
              </div> */}
              {task.IS_MY_TASK === "Y" ? (
                <div className="mt-2">
                  <Button
                    key={`BUTTON_ACTION_${task.WORKFLOW_TASK_ID}`}
                    className="w-full"
                    variant="filled"
                    color="primary"
                    onClick={() =>
                      handleOpenSheet({
                        title: `Workflow Task ${task.TASK_NAME}`,
                        description: `Please fill in the form below to action the workflow`,
                        content: (
                          <ComponentAction
                            key={`ACTION_${task.WORKFLOW_TASK_ID}`}
                            task={task}
                            actionList={task.ACTION_LIST}
                            information={task.INFORMATION}
                            attachment={task.ATTACHMENT}
                            refetch={handleSearchWorkflowTask}
                          />
                        ),
                      })
                    }
                  >
                    Action
                  </Button>
                  {/* <Form initialValues={{ DELEGATE_TO: ["112724", "113235"] }}>

                    <Select
                      key={`SELECT_DELEGATE_TO_${task.WORKFLOW_TASK_ID}`}
                      label="Delegate to"
                      options={[
                        {
                          label: "112724",
                          value: "112724",
                        },
                        {
                          label: "113235",
                          value: "113235",
                        },
                      ]}
                      search={true}
                      // multiple={true}
                      name="DELEGATE_TO"
                    />
                  </Form> */}
                </div>
              ) : (
                <Button
                  key={`BUTTON_DETAIL_${task.WORKFLOW_TASK_ID}`}
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() =>
                    handleOpenSheet({
                      title: `Workflow Task ${task.TASK_NAME}`,
                      description: `List of Information and Attachments Required`,
                      content: (
                        <>
                          {task?.INFORMATION?.length > 0 && (
                            <>
                              <div className="font-semibold text-right">
                                Information Section
                              </div>
                            </>
                          )}
                          {task?.INFORMATION?.map((info) => (
                            <div key={info.WORKFLOW_TASK_INFORMATION_ID}>
                              <Input
                                key={`DETAIL_INPUT_INFORMATION_${info.WORKFLOW_TASK_INFORMATION_ID}`}
                                label={info.INFORMATION_NAME}
                                value={info.INFORMATION_VALUE}
                                readOnly={true}
                              />
                            </div>
                          ))}

                          {task?.ATTACHMENT?.length > 0 && (
                            <>
                              <hr className="my-2" />
                              <div className="font-semibold text-right">
                                Attachment Section
                              </div>
                            </>
                          )}
                          {task?.ATTACHMENT?.map((info) => (
                            <div key={info.WORKFLOW_TASK_ATTACHMENT_ID}>
                              <Button
                                key={`DETAIL_BUTTON_DOWNLOAD_${info.WORKFLOW_TASK_ATTACHMENT_ID}`}
                                className="w-full"
                                variant="outline"
                                onClick={() => {
                                  window.open(info.ATTACHMENT_PATH, "_blank");
                                }}
                              >
                                <Download className="w-4 h-4" />
                                {info.ATTACHMENT_NAME}
                              </Button>
                            </div>
                          ))}
                        </>
                      ),
                    })
                  }
                >
                  See Details
                </Button>
              )}
            </div>
          ),
        },
        position: { x: 0, y: 0 }, // Initial position will be overridden by layout
        type: "default",
        draggable: false, // Make nodes non-draggable
        style: {
          padding: "10px",
          width: "250px",
          height: "auto",
          minHeight: "100px",
          borderColor:
            task.STATUS === "COMPLETED"
              ? "#52c41a"
              : task.IS_MY_TASK === "Y"
                ? "#9A0101"
                : "black",
          borderWidth: task.IS_MY_TASK === "Y" ? "2.5px" : "0.5px",
          //   backgroundColor: task.STATUS === "COMPLETED" ? "#f6ffed" : "white",
        },
      }));

      // Add start process node
      const startNode = {
        id: "start-process",
        data: {
          label: (
            <div style={{ fontWeight: "bold", textAlign: "center" }}>
              Start Process
            </div>
          ),
        },
        position: { x: 0, y: 0 },
        type: "input",
        draggable: false, // Make start node non-draggable
        style: {
          padding: "10px",
          width: "250px",
          height: "40px",
          backgroundColor: "#e6f7ff",
          borderColor: "#1890ff",
          borderWidth: "2px",
          borderRadius: "8px",
        },
      };

      // Add end process node
      const endNode = {
        id: "end-process",
        data: {
          label: (
            <div style={{ fontWeight: "bold", textAlign: "center" }}>
              End Process
            </div>
          ),
        },
        position: { x: 0, y: 0 },
        type: "output",
        draggable: false, // Make end node non-draggable
        style: {
          padding: "10px",
          width: "250px",
          height: "40px",
          backgroundColor: "#f6ffed",
          borderColor: "#52c41a",
          borderWidth: "2px",
          borderRadius: "8px",
        },
      };

      // Add start and end nodes to the initial nodes
      const nodesWithStartEnd = [startNode, ...initialNodes, endNode];

      // Create initial edges from the provided data
      let initialEdges = data.flatMap((task) =>
        task.DEPENDENCIES.map((dep) => ({
          id: `${dep}-${task.TASK_CODE}`,
          source: dep,
          target: task.TASK_CODE,
          type: "smoothstep",
          animated: true,
        }))
      );

      // Find nodes with no dependencies (entry points)
      const entryNodes = data.filter(
        (task) => !task.DEPENDENCIES || task.DEPENDENCIES.length === 0
      );

      // Connect start node to entry nodes
      const startEdges = entryNodes.map((task) => ({
        id: `start-process-${task.TASK_CODE}`,
        source: "start-process",
        target: task.TASK_CODE,
        type: "smoothstep",
        animated: true,
      }));

      // Find nodes that are not dependencies for any other node (exit points)
      const allDependencies = data.flatMap((task) => task.DEPENDENCIES);
      const exitNodes = data.filter(
        (task) => !allDependencies.includes(task.TASK_CODE)
      );

      // Connect exit nodes to end node
      const endEdges = exitNodes.map((task) => ({
        id: `${task.TASK_CODE}-end-process`,
        source: task.TASK_CODE,
        target: "end-process",
        type: "smoothstep",
        animated: true,
      }));

      // Combine all edges
      initialEdges = [...startEdges, ...initialEdges, ...endEdges];

      // Apply layout to the initial nodes and edges
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodesWithStartEnd, initialEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [data, setNodes, setEdges]);

  /** Functions */
  const handleSearchWorkflowTask = () => {
    getWorkflowTaskMutation.mutate(workflowId);
  };

  const handleOpenSheet = useCallback(
    ({ title, description, content, position = "right", size = 400 }) => {
      openSheet({
        title,
        description,
        position,
        size,
        content,
      });
    },
    [openSheet]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 130px)",
        border: "1px solid #ddd",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false} // Disable dragging for all nodes at the ReactFlow level
      >
        <Background />
      </ReactFlow>
    </div>
  );
});

const ComponentAction = ({ key, task, information, attachment, refetch }) => {
  const { toast } = useToast();
  const formikRef = useRef();

  const { openSheet, closeSheet } = useUIStore();

  /** Mutation */
  const actionWorkflowTaskMutation = useMutation(actionWorkflowTask);
  const findUserMutation = useMutation(getUsers);

  /** State */
  const [optionDelegateTo, setOptionDelegateTo] = useState([]);

  const [actionList, setActionList] = useState([]);
  const [action, setAction] = useState("");
  const [delegateTo, setDelegateTo] = useState("");

  useEffect(() => {
    formikRef.current.setFieldValue("ACTION", task.ACTION_LIST[0]);
  }, [formikRef]);

  const handleFindUser = async ({ DEPARTMENT, NAME, EMAIL }) => {
    const result = await findUserMutation.mutate({
      DEPARTMENT: DEPARTMENT || undefined,
      NAME: NAME || undefined,
      EMAIL: EMAIL || undefined,
    });

    if (result?.success) {
      const users = result.data.map((user) => ({
        label: user.NAME,
        labelDetail: (
          <div>
            <b>{user.NAME}</b>
            <div className="text-sm text-gray-500">{user.DEPARTMENT_NAME}</div>
          </div>
        ),
        value: user.POSITION_CODE,
      }));

      setOptionDelegateTo(users);
    }
  };

  const handleAction = async (values, setSubmitting) => {
    try {
      const result = await actionWorkflowTaskMutation.mutate(values);
      if (result?.success) {
        toast({
          title: "Workflow task action submitted successfully",
          description: "Please wait for the workflow to be processed",
        });
        refetch();
        closeSheet();
      } else {
        toast({
          title: "Workflow task action failed",
          description: result?.data ? result?.data : result?.message,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div key={key}>
      <Form
        ref={formikRef}
        key={`FORM_ACTION_${task.WORKFLOW_TASK_ID}`}
        initialValues={{
          ACTION: action,
          REMARK: "",
          DELEGATE_TO: [],
        }}
        validationSchema={{
          ACTION: Yup.string().required("Action is required"),
          REMARK: Yup.string().when("ACTION", {
            is: (val) =>
              ["REJECT", "REVISE", "TERMINATE", "DELEGATE"].includes(val),
            then: () => Yup.string().required("Remark is required"),
            otherwise: () => Yup.string(),
          }),
        }}
        onSubmit={(values, { setSubmitting }) => {
          /** Add Workflow ID and Workflow Task ID to the values for API Call */
          values.WORKFLOW_ID = task.WORKFLOW_ID;
          values.WORKFLOW_TASK_ID = task.WORKFLOW_TASK_ID;
          if (values.DELEGATE_TO) {
            values.DELEGATE_TO = values.DELEGATE_TO.map((POSITION_CODE) =>
              Number(POSITION_CODE)
            );
          }

          handleAction(values, setSubmitting);
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <div className="space-y-2">
            {information?.length > 0 && (
              <>
                <div className="font-semibold text-right">
                  Information Section
                </div>
              </>
            )}
            {information?.map((info) => (
              <div>
                <Input
                  type="text"
                  label={info.INFORMATION_NAME}
                  name={`${info.INFORMATION_NAME}`}
                  placeholder={`Input Data ${info.INFORMATION_NAME}`}
                />
              </div>
            ))}
            {attachment?.length > 0 && (
              <>
                <hr className="my-2" />
                <div className="font-semibold text-right">
                  Attachment Section
                </div>
              </>
            )}
            {attachment?.map((info) => (
              <div>
                <Input
                  type="file"
                  label={info.ATTACHMENT_NAME}
                  name={`${info.ATTACHMENT_NAME}`}
                  placeholder={`Input Data ${info.ATTACHMENT_NAME}`}
                />
              </div>
            ))}
            <div>
              <Select
                key={`SELECT_ACTION_${task.WORKFLOW_TASK_ID}`}
                label="Action"
                name="ACTION"
                required={true}
                options={task.ACTION_LIST.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(value) => {
                  setAction(value);

                  if (value === "DELEGATE") {
                    handleFindUser({
                      DEPARTMENT: ["IT", "RA"],
                    });

                    // setFieldValue("DELEGATE_TO", ['112724', '113235']);
                  }
                }}
              />
            </div>
            {action === "DELEGATE" && (
              <div>
                <Input
                  label="Delegate from"
                  name="DELEGATE_FROM"
                  value={task.PIC}
                  disabled
                />
                <Select
                  key={`SELECT_DELEGATE_TO_${task.WORKFLOW_TASK_ID}`}
                  label="Delegate to"
                  name="DELEGATE_TO"
                  options={optionDelegateTo}
                  search={true}
                  multiple={true}
                  onChange={(value) => {
                    console.log("value", value);
                    setFieldValue("DELEGATE_TO", value);
                  }}
                />
              </div>
            )}
            <div>
              <Input
                label="Remark"
                name="REMARK"
                placeholder="Enter your remarks here..."
              />
            </div>
            <div className="flex mt-4">
              <Button
                className="w-full"
                type="submit"
                variant="gradient"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};
