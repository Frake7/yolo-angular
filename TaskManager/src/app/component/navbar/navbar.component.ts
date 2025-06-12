import { Component, OnInit, NgZone } from '@angular/core';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Modal } from 'bootstrap';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CategoryFormComponent, TaskFormComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  selectedTaskForEdit: any = null;
  selectedCategoryForEdit: any = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    window.addEventListener('editTask', (event: any) => {
      this.zone.run(() => {
        this.selectedTaskForEdit = event.detail;
        const modalEl = document.getElementById('taskModal');
        if (modalEl) {
          const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
          modalInstance.show();
        }
      });
    });

    window.addEventListener('editCategory', (event: any) => {
      this.zone.run(() => {
        this.selectedCategoryForEdit = event.detail;
        const modalEl = document.getElementById('categoryModal');
        if (modalEl) {
          const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
          modalInstance.show();
        }
      });
    });
  }

  onCategorySaved(): void {
    const modalEl = document.getElementById('categoryModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();
    }
    window.dispatchEvent(new CustomEvent('categoryListUpdated'));
  }

  openCategoryModal() {
    this.selectedCategoryForEdit = null;
    const modalEl = document.getElementById('categoryModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.show();
    }
  }

  onTaskSaved(): void {
    const modalEl = document.getElementById('taskModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();
    }
    window.dispatchEvent(new CustomEvent('taskListUpdated'));
  }

  openTaskModal() {
    this.selectedTaskForEdit = null;
    const modalEl = document.getElementById('taskModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.show();
    }
  }
}