import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {

  @Input('header') header: string = '';

  // 2-way binding
  @Input('visible') visible: boolean = false;
  @Output() visibleChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public onClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

}
