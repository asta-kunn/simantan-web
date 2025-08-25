import React from "react";
import { useMutation } from "@/hooks/use-mutation";

const ProjectTermination = () => {
  const { mutate, loading, error, response } = useMutation();

  return (
    <div>
      <h1>ProjectTermination</h1>
    </div>
  );
};

export default ProjectTermination;