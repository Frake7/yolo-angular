import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnChanges {
  category: any = { title: '', description: '' };
  private taskService = inject(TaskService);

  @Output() categorySaved = new EventEmitter<void>();
  @Input() categoryToEdit: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryToEdit']) {
      this.category = changes['categoryToEdit'].currentValue
        ? { ...changes['categoryToEdit'].currentValue }
        : { title: '', description: '' };
    }
  }

  onSubmit(): void {
    if (this.category.id) {
      this.taskService.updateCategory(this.category).subscribe(() => {
        this.categorySaved.emit();
      });
    } else {
      this.taskService.createCategory(this.category).subscribe(() => {
        this.category = { title: '', description: '' };
        this.categorySaved.emit();
      });
    }
  }
}