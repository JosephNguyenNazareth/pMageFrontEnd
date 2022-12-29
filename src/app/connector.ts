import { PmsConfig } from "./interface/pmsconfig";
import { Retriever } from "./interface/retriever";
import { UserPMage } from "./interface/userpmage";

export interface Connector {
    id: string;
    userPMage: UserPMage;
    historyCommitList: string[];
    violatedCommitList: string[];
    monitoringLog: Map<string, string>;
    isMonitoring: boolean;
    retriever: Retriever;
    pmsConfig: PmsConfig;
}