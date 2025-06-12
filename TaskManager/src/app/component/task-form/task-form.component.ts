import { Component, OnInit, inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() taskSaved = new EventEmitter<void>();

  @Input() task: any = {
    title: '',
    dueDate: '',
    status: 1,
    categoryId: null,
    description: ''
  };
  
  taskService = inject(TaskService);
  categories: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      const taskInput = changes['task'].currentValue;
  
      if (taskInput) {
        this.task = { ...taskInput };
        const date = new Date(this.task.dueDate * 1000);
        this.task.dueDate = date.toISOString().split('T')[0];
      } else {
        this.resetForm();
      }
    }
  }


  ngOnInit(): void {
    this.taskService.getAllCategories().subscribe(data => {
      this.categories = data;
    });

    if (this.task?.dueDate) {
      const d = new Date(this.task.dueDate * 1000);
      this.task.dueDate = d.toISOString().split('T')[0];
    }

    if (!this.task) {
      this.resetForm();
    } else {
      this.task = { ...this.task };
    }
  }

  submitForm(): void {
    const taskToSubmit = {
      ...this.task,
      dueDate: Math.floor(new Date(this.task.dueDate).getTime() / 1000)
    };
    const action = this.task.id
    ? this.taskService.updateTask(taskToSubmit)
    : this.taskService.createTask(taskToSubmit);

  action.subscribe(() => {
    this.taskSaved.emit();
  });
    if (this.task.id) {
      this.taskService.updateTask(taskToSubmit).subscribe(() => {
        this.formSubmitted.emit();
      });
    } else {
      
      
    }
  }

  resetForm() {
    this.task = {
      title: '',
      dueDate: '',
      status: 1,
      categoryId: null,
      description: ''
    };
  }
}