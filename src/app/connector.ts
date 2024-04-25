import { PmsConfig } from "./interface/pmsconfig";
import { Retriever } from "./interface/retriever";
import { Bridge } from "./interface/bridge";
import { ActionEvent } from "./interface/action.event";
import { Alignment } from "./interface/alignment";

export interface Connector {
    id: string;
    userEmail: string;
    bridge: Bridge;
    actionEventTable: ActionEvent[];
    actionEventDescription: string;
    historyCommitList: Alignment[];
    monitoringLog: Map<string, string>;
    monitoring: boolean;
    retriever: Retriever;
    pmsConfig: PmsConfig;
    userName: string;
    suppProjectLink: string;
}