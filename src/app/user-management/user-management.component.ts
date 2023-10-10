import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user-model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  userModal!: ElementRef;

  users: User[] = [];
  userForm: FormGroup;
  modalTitle: string = '';
  editing: boolean = false;
  editedUserId: number | null = null;
  private activeModal: NgbModalRef | null = null;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Cargar usuarios desde LocalStorage si existen
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      // Si no existen usuarios en LocalStorage, inicializa la lista con usuarios por defecto
      this.initializeDefaultUsers();
    }
  }

  initializeDefaultUsers() {
    const defaultUsers: User[] = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com' },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com' },
      { id: 3, name: 'Usuario 3', email: 'usuario3@example.com' },
      { id: 4, name: 'Usuario 4', email: 'usuario4@example.com' },
      { id: 5, name: 'Usuario 5', email: 'usuario5@example.com' }
    ];

    this.users = defaultUsers;
    this.saveUsersToLocalStorage();
  }

  deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
    this.saveUsersToLocalStorage();
  }


openEditModal(userId: number) {
  this.modalTitle = 'Editar Usuario';
  
  const userToEdit = this.users.find((user) => user.id === userId);
  if (userToEdit) {
    this.userForm.setValue({
      name: userToEdit.name,
      email: userToEdit.email,
    });
    this.editing = true;
    this.editedUserId = userId;
  }
}

  openCreateModal() {
    this.modalTitle = 'Crear Nuevo Usuario';    
    this.userForm.reset();
  }

  saveChanges() {
    if (this.userForm.valid) {
      if (this.editing && this.editedUserId !== null) {
        // Editar usuario existente
        const editedUserIndex = this.users.findIndex((user) => user.id === this.editedUserId);
        if (editedUserIndex !== -1) {
          this.users[editedUserIndex].name = this.userForm.value.name;
          this.users[editedUserIndex].email = this.userForm.value.email;
          this.editedUserId = null;
          this.editing = false;
        }
      } else {
        // Agregar nuevo usuario
        const newUser: User = {
          id: this.findMaxId() + 1,
          name: this.userForm.value.name,
          email: this.userForm.value.email,
        };
        this.users.push(newUser);
      }
  
      this.saveUsersToLocalStorage();
      this.userForm.reset(); // Restablecer el formulario después de guardar 


    }
  }

  findMaxId () {
    const maxId = Math.max.apply(Math, this.users.map(function (user) {
      return user.id;
    }));
    return maxId;
  }


  private saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

}
