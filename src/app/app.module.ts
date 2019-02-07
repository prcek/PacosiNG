import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TEST_TOKEN } from './token';
import { GraphQLModule } from './graphql.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { UsersPageComponent } from './users-page/users-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { YesnoPipe } from './pipes/yesno.pipe';
import { CalendarsPageComponent } from './calendars-page/calendars-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { CalendarEditorComponent } from './calendar-editor/calendar-editor.component';
import { TstimePipe } from './pipes/tstime.pipe';
import { WeekDaysPipe } from './pipes/week-days.pipe';
import { WeekDayPipe } from './pipes/week-day.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TimepickerDirective } from './timepicker/timepicker-input';
import { TimepickerToggleComponent } from './timepicker/timepicker-toggle.component';
import { TimepickerComponent, TimepickerContent, APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './timepicker/timepicker.component';
import { TimepickerPanelComponent } from './timepicker/timepicker-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    MainMenuComponent,
    UsersPageComponent,
    UserPageComponent,
    UserEditorComponent,
    YesnoPipe,
    CalendarsPageComponent,
    CalendarPageComponent,
    CalendarEditorComponent,
    TstimePipe,
    WeekDaysPipe,
    WeekDayPipe,
    TimepickerDirective,
    TimepickerToggleComponent,
    TimepickerComponent,
    TimepickerContent,
    TimepickerPanelComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatMomentDateModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
// last
    GraphQLModule,
  ],
  providers: [
    APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TimepickerContent
  ]
})
export class AppModule { }
