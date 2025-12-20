import React from "react";
import { JournalsWorkspaceProvider, JournalsLeftPanel, JournalsMainPanel } from "./JournalsWorkspaceDock";

export const JournalsWorkspace = () => {
  return (
    <JournalsWorkspaceProvider>
      <div className="h-full flex bg-background">
        <JournalsLeftPanel />
        <JournalsMainPanel />
      </div>
    </JournalsWorkspaceProvider>
  );
};

