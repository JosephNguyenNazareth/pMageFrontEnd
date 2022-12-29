import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Connector } from './connector';
import { ConnectorService } from './connector.service';
import { UserPMage } from './interface/userpmage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public connectorList: Connector[] = [];
  public editConnector!: Connector;
  public deleteConnector!: Connector;

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

  public onUpdateConnector(connectorId: string, user: UserPMage): void {
    this.connectorService.updateConnector(connectorId, user).subscribe(
      (response: void) => {
        console.log(response);
        this.getConnectors();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(connectorId?: string): void {
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

  public searchConnectors(key: string): void {
    const results: Connector[] = [];
    for (const connector of this.connectorList) {
      if (connector.userPMage.realName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.userPMage.pmsName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.userPMage.userName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || connector.userPMage.originRepo.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
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
    container?.appendChild(button);
    button.click();
  }
}  
