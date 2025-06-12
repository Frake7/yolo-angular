import { Component, OnInit, inject } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { CategoryComponent } from "../category/category.component";
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CategoryComponent, CardComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  taskService = inject(TaskService);
  tasks: any[] = [];
  pagedTasks: any[] = [];
  categories: any[] = [];
  category!: number;
  pageSize = 3;
  currentPage = 1;
  filterCategories: string = '';
  filterTasks: string = '';
  filteredTasks: any[] = [];
  filteredCategories: any[] = [];
  selectedTaskStatus: string = '';
  selectedCategoryId: number | null = null;
  fromDate: string = '';
  toDate: string = '';
  editingCategory: any | null = null;
  pageSizeCategories = 5;
  currentPageCategories = 1;
  pagedCategories: any[] = [];
  
  get totalPagesCategories(): number {
  const source = this.filteredCategories.length || this.filterCategories ? this.filteredCategories : this.categories;

  return Math.ceil(source.length / this.pageSizeCategories);
  }
  
  get pagesCategories(): number[] {
    return Array.from({ length: this.totalPagesCategories }, (_, i) => i + 1);
  }

  statusMap: { [key: number]: string } = {
    1: 'todo',
    2: 'inprogress',
    3: 'done'
  };
  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }

  updatePagedCategories() {
    const source = this.filteredCategories.length || this.filterCategories
    ? this.filteredCategories
    : this.categories;

  const startIndex = (this.currentPageCategories - 1) * this.pageSizeCategories;
  this.pagedCategories = source.slice(startIndex, startIndex + this.pageSizeCategories);
  }

  goToPageCategories(page: number) {
    if (page < 1 || page > this.totalPagesCategories) return;
    this.currentPageCategories = page;
    this.updatePagedCategories();
  }

  deleteCategoryById(id: number): void {
    this.taskService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.id !== id);
        this.filteredCategories = [];
        this.currentPageCategories = 1;
        this.updatePagedCategories();
      },
      error: (err) => {
        alert('Error deleting category')
        console.error(err);
      }
    });
  }

  onTaskDeleted(id: number): void {
  this.tasks = this.tasks.filter(task => task.id !== id);
  this.filteredTasks = [];
  this.currentPage = 1;
  this.updatePagedTasks();

  }

  openTaskModal(task: any){
    const event = new CustomEvent('editTask', { detail: task });
     window.dispatchEvent(event);

      const modalEl = document.getElementById('taskModal');
      if (modalEl) {
     const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
    modalInstance.show();
  }
  }

  get totalPages(): number {
    const source = this.filteredTasks.length > 0 || this.fromDate || this.toDate || this.filterTasks || this.selectedTaskStatus
    ? this.filteredTasks
    : this.tasks;

    return Math.ceil(source.length / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilter(): void {
    const filter = this.filterCategories.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.title.toLowerCase().includes(filter)
    );
    this.currentPageCategories = 1;
    this.updatePagedCategories();
  }

  applyTaskFilter(): void {
  this.currentPage = 1;
  this.updatePagedTasks();
  }

  ngOnInit(): void {
    this.getAllTasks();
    this.getAllCategories();

  window.addEventListener('categoryListUpdated', () => {
      this.getAllCategories();
    });

  window.addEventListener('taskListUpdated', () => {
      this.getAllTasks();
    });
  }

  openCategoryModalForEdit(category: any) {
    const event = new CustomEvent('editCategory', { detail: category });
    window.dispatchEvent(event);
  
    const modalEl = document.getElementById('categoryModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.show();
    }
  }
 

  getAllTasks(category?: number) {
    this.taskService.getAllTasks(this.category).subscribe((res: any) => {
      this.tasks = res;
      this.filteredTasks = [];
      this.currentPage = 1;
      this.updatePagedTasks();
    });
  }

  getAllCategories() {
    this.taskService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
      this.currentPageCategories = 1;
    this.updatePagedCategories();
    });
  }

updatePagedTasks() {
  const titleFilter = this.filterTasks.toLowerCase();
  const statusFilter = this.selectedTaskStatus;

  this.filteredTasks = this.tasks.filter(task => {
    const matchesTitle = task.title.toLowerCase().includes(titleFilter);
    const taskStatus = this.statusMap[task.status];
    const matchesStatus = statusFilter ? taskStatus === statusFilter : true;
    const taskDate = new Date(task.dueDate * 1000);
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    const matchesFrom = from ? taskDate >= from : true;
    const matchesTo = to ? taskDate <= to : true;

    return matchesTitle && matchesStatus && matchesFrom && matchesTo;
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  this.pagedTasks = this.filteredTasks.slice(startIndex, startIndex + this.pageSize);
}

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedTasks();
  }

  onTasksLoaded(tasks: any[]) {
    this.tasks = tasks;
    this.currentPage = 1;
    this.updatePagedTasks();
  }
}