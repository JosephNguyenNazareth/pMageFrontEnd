import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Connector } from './connector';
import { ConnectorService } from './connector.service';
import { Bridge } from './interface/bridge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Alignment } from './interface/alignment';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit {
  public connectorList: Connector[] = [];
  public editConnector!: Connector;
  public deleteConnector!: Connector;
  public monitoringConnector!: Connector;
  public historyConnector!: Connector;
  public baseConnectorId !: string;
  public updatePMSConfigurationResponse !: string;

  pmsFunctions = new Map<string, string>();
  appMessageInfo: string[] = ['id', 'time', 'title', 'committer'];
  
  listNbParams = Array.from(Array(5).keys());
  nbParam = 0;
  listTrueNbParams = Array.from(Array(this.nbParam).keys());
  
  caseIdList: string[] = [];
  selectedCaseId: string = "";

  constructor(private connectorService: ConnectorService) { }

  ngOnInit(): void {
    this.getConnectors();

    this.pmsFunctions.set('login', 'Authentication information to access process instance in the PMS. Ex: http://localhost:8080/bonita/loginservice');
    this.pmsFunctions.set('verify', 'Process Instance availability verification. Ex: http://localhost:8080/bonita/API/bpm/case/{processInstanceId}',);
    this.pmsFunctions.set('getTask', 'Collect all the related task to the user. Ex: http://localhost:8080/bonita/API/bpm/task?f=caseId={processInstanceId}',);
    this.pmsFunctions.set('validateTask', 'Task instance availability verification. Ex: http://localhost:8080/bonita/API/bpm/task/{taskInstanceId}',);
    this.pmsFunctions.set('startTask', 'Start a task instance',);
    this.pmsFunctions.set('endTask', 'Complete a task instance. Ex: http://localhost:8080/bonita/API/bpm/task/{taskInstanceId}',);
    this.pmsFunctions.set('getArtifact', 'Collect all artifacts of the related task to the user');
  }

  public onChange(connectorChange: MatRadioChange) {
    this.baseConnectorId = connectorChange.value;
 } 

  public getConnectors(): void {
    this.connectorService.getConnectors().subscribe(
      (response: Connector[]) => {
        // console.log(response);
        this.connectorList = response;
        console.log(this.connectorList);
        // console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public onAddConnector(addForm: NgForm): void {
    document.getElementById('add-connector-form')?.click();
    console.log(addForm.value);
    this.connectorService.addConnector(addForm.value).subscribe(
      (response: string) => {
        console.log(response);
        this.getConnectors();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onAddSuppConnector(addSuppForm: NgForm): void {
    document.getElementById('add-supp-connector-form')?.click();
    console.log(addSuppForm.value);
    this.connectorService.addSuppConnector(addSuppForm.value, this.baseConnectorId).subscribe(
      (response: string) => {
        console.log(response);
        this.getConnectors();
        addSuppForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addSuppForm.reset();
      }
    );
  }

  public onGenerateActionTable(connectorId: string): void {
    this.connectorService.generateActionLinkage(connectorId).subscribe(
      (response: string) => {
        const textarea: HTMLTextAreaElement = document.getElementById('actionEventDescription') as HTMLTextAreaElement;
        textarea.value = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onCancelSavingActionTable(originalActionEventDescription: string): void {
      const textarea: HTMLTextAreaElement = document.getElementById('actionEventDescription') as HTMLTextAreaElement;
      textarea.value = originalActionEventDescription;
  }

  public onAddActionTable(connectorId: string, actionEventDescription :string): void {
    document.getElementById('add-action-table')?.click();
    this.connectorService.addAction(connectorId, actionEventDescription).subscribe(
      (response: void) => {
        console.log(response);
        this.getConnectors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
  
      }
    );
  }

  public onUpdateConnector(connectorId: string, bridge: Bridge): void {
    if (this.baseConnectorId != undefined) {
      console.log(this.baseConnectorId);
      this.connectorService.updateSuppConnector(connectorId, bridge, this.baseConnectorId).subscribe(
        (response: void) => {
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      this.connectorService.updateConnector(connectorId, bridge).subscribe(
        (response: void) => {
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public onUpdatePMSConfig(updatePMSForm: NgForm): void {
    console.log(updatePMSForm.value);
    this.connectorService.updatePMSConfig(updatePMSForm.value).subscribe(
      (response: string) => {
        this.updatePMSConfigurationResponse = response;
        console.log(response);
        this.getConnectors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateAppConfig(updateAppForm: NgForm): void {

  }

  public onDeleteConnector(connectorId?: string): void {
    if (connectorId) {
      this.connectorService.deleteConnector(connectorId).subscribe(
        (response: void) => {
          console.log(response);
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public onStartMonitoring(connectorId?: string): void {
    if (connectorId) {
      this.connectorService.startMonitoring(connectorId).subscribe(
        (response: void) => {
          console.log(response);
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public onStopMonitoring(connectorId?: string): void {
    if (connectorId) {
      this.connectorService.stopMonitoring(connectorId).subscribe(
        (response: void) => {
          console.log(response);
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public getConnectorHistory(connectorId: string): void {
    this.connectorService.getConnectorHistory(connectorId).subscribe(
      (response: void) => {
        console.log(response);
        this.getConnectors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public searchConnectors(key: string): void {
    const results: Connector[] = [];
    for (const connector of this.connectorList) {
      if (connector.bridge.userNamePms.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.bridge.pmsName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.bridge.appName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.bridge.userNameApp.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.bridge.projectLink.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.userName.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(connector);
      }
    }
    this.connectorList = results;

    if (results.length === 0 || !key) {
      this.getConnectors();
    }
  }


  public onOpenDynamicModal(history: Alignment, connector: Connector): void {
    if (history.monitoringMessage.includes("Task unknown")) {
      this.onOpenModal(connector, "add_table");
    } else if (history.monitoringMessage.includes("not found")) {
      this.onOpenModal(connector, "discuss");
    }
  }


  public downloadHistory(): void {
    const colList = ["commitId", "commitTime", "processInstanceChange", "processInstanceChangeTime", "taskFound", "monitoringMessage", "violated"];
    this.exportToCsv(this.historyConnector.historyCommitList, "history", colList);
  }

  public downloadSuppHistory(connectorId: string): void {
    this.connectorService.downloadConnectorHistory(connectorId).subscribe(
      (response: Alignment[]) => {
        console.log(response);
        const colList = ["commitId", "commitTime", "processInstanceChange", "processInstanceChangeTime", "taskFound", "monitoringMessage", "violated"];
    this.exportToCsv(response, "supp_history", colList);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
  }

  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const blob = new Blob([buffer], { type: fileType});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }


  public exportToCsv(data: Alignment[], fileName: string, keys: string[]): void {
    let dataObj: Array<any> = Array.from(data);
    let rows: string[] = [];
    let header = keys.join(",") + "\n";
    let csvContent = header;

    dataObj.forEach((item) => {
      let values: string[] = [];
      keys.forEach((key) => {
        let val: any = item[key];

        if (val !== undefined && val !== null) {
          val = new String(val);
        } else {
          val = "";
        }
        values.push(val);
      });
      rows.push(values.join(","));
    })
    csvContent += rows.join("\n");
    this.saveAsFile(csvContent, `${fileName}.csv`, 'text/csv');
  }

  public updateProcessInstanceId(pmsName: string, pmsUrl: string, usernamePms: string, passwordPms: string, processDef: string): void {
    if (this.selectedCaseId == "reload") {
      this.connectorService.getCaseId(pmsName, pmsUrl, usernamePms, passwordPms, processDef).subscribe(
        (response: string[]) => {
          console.log(response);
          this.caseIdList = response;
        },
        (error: HttpErrorResponse) => {
          alert("No process instance found for the following information. Please try again.");
        }
      );
    }
  }


  public onOpenModal(connector: Connector | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addConnectorModal');
    }
    if (mode === 'add-config') {
      button.setAttribute('data-target', '#addConfigModal');
    }
    if (mode === 'start_monitor') {
      if (connector) {
      //   connector.monitoring = true;
        this.monitoringConnector = connector;        
      }
      if (!connector?.monitoring)
        button.setAttribute('data-target', '#startMonitorConnectorModal');
    }
    if (mode === 'stop_monitor') {
      if (connector) {
      //   connector.monitoring = false;
        this.monitoringConnector = connector;
      }
      if (connector?.monitoring)
        button.setAttribute('data-target', '#stopMonitorConnectorModal');
    }
    if (mode === 'edit') {
      if (connector) {
        this.editConnector = connector;
      }
      button.setAttribute('data-target', '#updateConnectorModal');
    }
    if (mode === 'delete') {
      if (connector)
        this.deleteConnector = connector;
      button.setAttribute('data-target', '#deleteConnectorModal');
    }
    if (mode === 'add_table') {
      if (connector)
        this.editConnector = connector;
      button.setAttribute('data-target', '#addTableModal');
    }
    if (mode === 'history') {
      if (connector)
        this.historyConnector = connector;
      button.setAttribute('data-target', '#historyConnectorModal');
      this.getConnectorHistory(this.historyConnector.id);
    }
    if (mode === "discuss") {
      button.setAttribute('data-target', '#discussModal');
    }
    container?.appendChild(button);
    button.click();
  }

  enterPass: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
}  