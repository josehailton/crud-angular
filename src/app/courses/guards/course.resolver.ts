import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Course } from '../models/course';
import { CoursesService } from '../services/courses.service';

export const courseResolver: ResolveFn<Observable<Course>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  service: CoursesService = inject(CoursesService)
) => {

  if (route.params?.['id']) {
    return service.findById(route.params['id']);
  }
  return of({ _id: '', name: '', category: '', lessons: [] });
};
