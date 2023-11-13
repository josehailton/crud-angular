import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { Course } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { CoursePage } from './../../models/coursePage';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  coursePage$: Observable<CoursePage> | null = null;

  length = 10;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    this.refresh(this.pageIndex, this.pageSize);

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.refresh(e.pageIndex, e.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  refresh(page: number, pageSize: number) {
    this.coursePage$ = this.coursesService.findAll(page, pageSize)
      .pipe(
        catchError(error => {
          this.onError('Erro ao carregar cursos.');
          return of({ courses: [], totalElements: 0, totalPages: 0 });
        }),
        tap(coursePage => {
          this.length = coursePage.totalElements;
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
