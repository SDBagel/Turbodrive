import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, StorageService } from '../core/services';
import { Turbo$Announcement, Turbo$CourseWork, Turbo$Course } from '../core/schemas';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: Turbo$Course;
  feed: Array<Turbo$Announcement|Turbo$CourseWork> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private data: DataService,
              private storage: StorageService) {}

  ngOnInit(): void {
    if (this.storage.has("courses")) {
      const courses = this.storage.get("courses");

      this.activatedRoute.params.subscribe(params => {
        courses.forEach((course: Turbo$Course) => {
          if (course.id === params.id) {
            this.course = course;

            this.data.subscribeCourseData(this.course.id, (data) => {
              // Reset feed
              this.feed = [];
              // Concatenates all items, sorts by updateTime descending
              this.feed = this.feed.concat(data.announcements);
              this.feed = this.feed.concat(data.assignments);
              this.feed = this.feed.sort((a, b) => { 
                return (a.updateTime < b.updateTime) ? 1 : -1
              });
            }, true);

            this.data.tryMarkCourseRead(course.id);
          }
        });
      });
    }
  }
  
  markAsRead(courseId: string, type: string, id: string): void {
    this.data.markRead(courseId, type, id);
  }
}
