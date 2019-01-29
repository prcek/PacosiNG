import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  login: string;
  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.login = this.route.snapshot.paramMap.get('id');
  }

  goBack(): void {
    this.location.back();
  }

}
