import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LeaveRequest } from '../../services/chat.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss'
})
export class LeaveFormComponent {
  @Output() submitted = new EventEmitter<LeaveRequest>();
  @Output() cancel = new EventEmitter<void>();
  
  leaveForm: FormGroup;
  leaveTypes = ['Sick Leave', 'Vacation', 'Personal', 'Other'];
  
  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['']
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.submitted.emit(this.leaveForm.value);
      this.leaveForm.reset();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.leaveForm.reset();
  }
}
