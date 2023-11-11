import { CoursePage } from './../../models/coursePage';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { Course } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  coursePage$: Observable<CoursePage> | null = null;

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    this.refresh(0, 10); // para fins de teste -- tornar dinâmico depois

  }

  refresh(page: number, pageSize: number) {
     this.coursePage$ = this.coursesService.findAll(page, pageSize)
      .pipe(
        catchError(error => {
          this.onError('Erro ao carregar cursos.');
          return of({ courses: [], totalElements: 0, totalPages: 0 });
        })
      );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], { relativeTo: this.route });
  }

  onDelete(course: Course) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coursesService.delete(course._id)
          .pipe(
            tap(() => {
              this.snackBar.open('Excluído com sucesso!', 'X', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            }),
            catchError(error => {
              this.onError('Não foi possível excluir o curso!');
              throw error;
            })
          )
          .subscribe(() => {
            this.refresh(0, 10);
          });
      }
    });

  }

}
