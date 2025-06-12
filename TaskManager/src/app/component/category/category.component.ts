import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  @Input() category!: { id: number; title: string; description: string };
  @Input() selectedCategoryId: number | null = null;
  @Output() selectedCategoryChange = new EventEmitter<number>();
  @Output() tasksLoaded = new EventEmitter<any[]>();
  @Output() deleteCategory = new EventEmitter<number>();
  @Output() editCategory = new EventEmitter<any>();

  private taskService = inject(TaskService);

  selectCategory() {
    this.selectedCategoryChange.emit(this.category.id);
    this.getTaskByCategory(this.category.id);
  }

  onEditClick() {
    this.editCategory.emit(this.category);
  }

  getTaskByCategory(categoryId: number) {
    this.taskService.getAllTasks(categoryId).subscribe(res => this.tasksLoaded.emit(res));
  }

  onDeleteClick() {
    this.deleteCategory.emit(this.category.id);
  }
}