import { CommonModule } from '@angular/common';
import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() task!: { id: number; title: string; description: string; dueDate: number; status: number };
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<any>();

  private taskService = inject(TaskService);

  formatDueDate(dueDate: number): string {
    return new Date(dueDate * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  isOverdue(dueDate: number): boolean {
    const due = new Date(dueDate * 1000);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return due < now;
  }

  onDeleteClick() {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.deleteTask.emit(this.task.id),
      error: () => {}
    });
  }

  onEditClick() {
    this.editTask.emit(this.task);
  }
}
