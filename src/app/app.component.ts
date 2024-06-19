import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Connector } from './connector';
import { ConnectorService } from './connector.service';
import { Bridge } from './interface/bridge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Alignment } from './interface/alignment';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { UserPMage } from './interface/userpmage';
import { FileUploadService } from './services/file-upload.service';
import { Observable } from 'rxjs';
import { PMSScore } from './interface/pmsscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit {
  public connectorList: Connector[] = [];
  public pmsList: string[] = [];
  public editConnector!: Connector;
  public deleteConnector!: Connector;
  public monitoringConnector!: Connector;
  public historyConnector!: Connector;
  public baseConnectorId !: string;
  public updatePMSConfigurationResponse !: string;
  public currentUser!: string;

  pmsFunctions = new Map<string, string>();
  appMessageInfo: string[] = ['id', 'time', 'title', 'committer'];
  
  listNbParams = Array.from(Array(5).keys());
  nbParam = 0;
  listTrueNbParams = Array.from(Array(this.nbParam).keys());
  
  selectedPMS: string = "";
  pmsCommonInfoList: PMSScore[] = [];
  caseIdList: string[] = [];
  selectedCaseId: string = "";

  projectMode: string = "";
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = 'Select File';
  fileInfos?: Observable<any>;


  constructor(private connectorService: ConnectorService, private uploadService: FileUploadService) { }


  ngOnInit(): void {
    this.getConnectors();
    this.getPMSList();

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
 
  public getPMSList(): void {
    this.connectorService.getPMSList().subscribe(
      (response: string[]) => {
        this.pmsList = response;
        console.log(this.pmsList);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getConnectors(): void {
    this.connectorService.getConnectors().subscribe(
      (response: Connector[]) => {
        this.connectorList = response;
        console.log(this.connectorList);
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

  public onLogin(loginForm: NgForm): void {
    console.log(loginForm.value.userName);
    this.connectorService.login(loginForm.value.userName, loginForm.value.password).subscribe(
      (response: UserPMage) => {
        this.currentUser = response.userName;
        this.connectorService.getUserConnectors(response.userName).subscribe(
          (response: Connector[]) => {
            this.connectorList = response;
            console.log(this.connectorList);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onRegister(registerForm: NgForm): void {
    console.log(registerForm.value.userName);
    this.connectorService.register(registerForm.value.userName, registerForm.value.password, registerForm.value.role).subscribe(
      (response: void) => {
        this.currentUser = registerForm.value.userName;
        this.connectorService.getUserConnectors(registerForm.value.userName).subscribe(
          (response: Connector[]) => {
            this.connectorList = response;
            console.log(this.connectorList);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
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

  public onUpdateConnector(connectorId: string, bridge: Bridge, taskArtifact: string): void {
    if (this.baseConnectorId != undefined) {
      console.log(this.baseConnectorId);
      this.connectorService.updateSuppConnector(connectorId, bridge, this.baseConnectorId, taskArtifact).subscribe(
        (response: void) => {
          this.getConnectors();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      this.connectorService.updateConnector(connectorId, bridge, taskArtifact).subscribe(
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

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }

  upload(): void {
    this.progress = 0;
    this.message = '';

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        }
      );
    }
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

  public updateProcessInfo(): void {
    if (this.currentUser !== "" && this.selectedPMS !== "") {
      this.connectorService.getCommonProcessInfo(this.currentUser, this.selectedPMS).subscribe(
        (response: PMSScore[]) => {
          console.log(response);
          this.pmsCommonInfoList = response;
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
    if (mode === 'login') {
      button.setAttribute('data-target', '#loginModal');
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