import { PmsConfig } from "./interface/pmsconfig";
import { Retriever } from "./interface/retriever";
import { Bridge } from "./interface/bridge";
import { ActionEvent } from "./interface/action.event";


export interface Connector {
    id: string;
    userEmail: string;
    bridge: Bridge;
    actionEventTable: ActionEvent[];
    actionEventDescription: string;
    historyCommitList: string[];
    violatedCommitList: string[];
    monitoringLog: Map<string, string>;
    monitoring: boolean;
    retriever: Retriever;
    pmsConfig: PmsConfig;
}