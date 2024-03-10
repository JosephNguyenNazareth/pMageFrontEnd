import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Connector } from './connector';
import { ConnectorService } from './connector.service';
import { Bridge } from './interface/bridge';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private connectorService: ConnectorService) { }

  ngOnInit(): void {
    this.getConnectors();
  }

  public getConnectors(): void {
    this.connectorService.getConnectors().subscribe(
      (response: Connector[]) => {
        this.connectorList = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddConnector(addForm: NgForm): void {
    document.getElementById('add-connector-form')?.click();
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
    this.connectorService.updateConnector(connectorId, bridge).subscribe(
      (response: void) => {
        console.log(response);
        this.getConnectors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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
        || connector.bridge.projectLink.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(connector);
      }
    }
    this.connectorList = results;

    if (results.length === 0 || !key) {
      this.getConnectors();
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
      if (connector)
        this.editConnector = connector;
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
    container?.appendChild(button);
    button.click();
  }

  enterPass: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
}  