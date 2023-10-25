import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../models/course';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

  form = this.formBuilder.group({
    _id: [''],
    name: [''],
    category: ['']
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {

    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category
    })

  }

  onSubmit() {
    this.service.save(this.form.value)
      .pipe(
        tap(result => this.onSuccess()),
        catchError(error => {
          this.onError();
          throw error;
        })
      )
      .subscribe();
  }

  onCancel() {
    this.location.back();
  }

  onSuccess() {
    this.snackBar.open('Salvo com sucesso!', '', { duration: 3000 });
    this.onCancel();
  }

  onError() {
    this.snackBar.open('Erro ao salvar!', '', { duration: 3000 });
  }


}
