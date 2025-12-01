import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdminProjectsService, ProjectInput } from '../../services/admin-projects';
import { AdminPostsService, Post, PostInput } from '../../services/admin-posts';
import { Project } from '../../services/projects';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  username = '';
  password = '';
  authError: string | null = null;
  loading = false;
  saving = false;
  projects: Project[] = [];
  editingId: number | null = null;
  // blog state
  posts: Post[] = [];
  postEditingId: number | null = null;
  postsLoading = false;
  postsSaving = false;
  postsError: string | null = null;

  form: FormGroup;

  postForm: FormGroup;

  constructor(
    private adminService: AdminProjectsService,
    private adminPosts: AdminPostsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
      longDescription: [''],
      techStack: ['', [Validators.required]],
      githubUrl: [''],
      demoUrl: [''],
      imageUrl: [''],
      iframe: [false],
      visible: [true],
    });

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      slug: ['', [Validators.required, Validators.maxLength(160), Validators.pattern('^[a-z0-9-]+$')]],
      shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
      longDescription: [''],
      techStack: [''],
      githubUrl: [''],
      demoUrl: [''],
      imageUrl: [''],
      excerpt: ['', [Validators.maxLength(400)]],
      content: ['', [Validators.required]],
      iframe: [false],
      visible: [true],
      published: [false],
    });
  }

  ngOnInit(): void {}

  connect() {
    this.authError = null;
    this.adminService.setCredentials(this.username, this.password);
    this.adminPosts.setCredentials(this.username, this.password);
    this.loadProjects();
    this.loadPosts();
  }

  loadProjects() {
    this.loading = true;
    this.authError = null;
    this.adminService.listAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authError = 'Credenciales inválidas';
        } else {
          this.authError = 'No se pudieron cargar los proyectos';
        }
      },
    });
  }

  startEdit(project: Project) {
    this.editingId = project.id;
    this.form.patchValue({
      title: project.title,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      imageUrl: project.imageUrl,
      iframe: project.iframe,
      visible: project.visible,
    });
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({
      title: '',
      shortDescription: '',
      longDescription: '',
      techStack: '',
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
      iframe: false,
      visible: true,
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as ProjectInput;
    this.saving = true;
    const request$ = this.editingId
      ? this.adminService.update(this.editingId, payload)
      : this.adminService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.resetForm();
        this.loadProjects();
      },
      error: () => {
        this.saving = false;
        this.authError = 'Error al guardar. Revisa credenciales o datos.';
      },
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar este proyecto?')) return;
    this.adminService.delete(id).subscribe({
      next: () => this.loadProjects(),
      error: () => (this.authError = 'No se pudo eliminar el proyecto'),
    });
  }

  // ==== BLOG ====
  loadPosts(includeUnpublished = true) {
    this.postsLoading = true;
    this.postsError = null;
    this.adminPosts.list(includeUnpublished).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsLoading = false;
      },
      error: (err) => {
        this.postsLoading = false;
        this.postsError = err.status === 401 || err.status === 403 ? 'Credenciales inválidas' : 'No se pudieron cargar los posts';
      },
    });
  }

  startEditPost(post: Post) {
    this.postEditingId = post.id;
    this.postForm.patchValue({
      title: post.title,
      slug: post.slug,
      shortDescription: post.shortDescription,
      longDescription: post.longDescription,
      techStack: post.techStack,
      githubUrl: post.githubUrl,
      demoUrl: post.demoUrl,
      imageUrl: post.imageUrl,
      excerpt: post.excerpt,
      content: post.content,
      iframe: post.iframe,
      visible: post.visible,
      published: post.published,
    });
  }

  resetPostForm() {
    this.postEditingId = null;
    this.postForm.reset({
      title: '',
      slug: '',
      shortDescription: '',
      longDescription: '',
      techStack: '',
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
      excerpt: '',
      content: '',
      iframe: false,
      visible: true,
      published: false,
    });
  }

  submitPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    const payload = this.postForm.value as PostInput;
    this.postsSaving = true;
    const request$ = this.postEditingId
      ? this.adminPosts.update(this.postEditingId, payload)
      : this.adminPosts.create(payload);

    request$.subscribe({
      next: () => {
        this.postsSaving = false;
        this.resetPostForm();
        this.loadPosts();
      },
      error: (err) => {
        this.postsSaving = false;
        this.postsError = err.status === 400 ? 'Validación fallida. Revisa los campos.' : 'No se pudo guardar el post';
      },
    });
  }

  deletePost(id: number) {
    if (!confirm('¿Eliminar este post?')) return;
    this.adminPosts.delete(id).subscribe({
      next: () => this.loadPosts(),
      error: () => (this.postsError = 'No se pudo eliminar el post'),
    });
  }
}
