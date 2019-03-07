import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { TEST_TOKEN } from './token';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CalendarOhtPageComponent } from './calendar-page/calendar-oht-page.component';
import { CalendarOhPageComponent } from './calendar-page/calendar-oh-page.component';
import { CalendarOhtEditorComponent } from './calendar-editor/calendar-oht-editor.component';
import { MatChipsModule} from '@angular/material/chips';
import { DialogConfirmComponent } from './dialogs/dialog-confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarNewPageComponent } from './calendar-page/calendar-new-page.component';
import { CalendarOhEditorComponent } from './calendar-editor/calendar-oh-editor.component';
import { DaypickerPanelComponent } from './daypicker/daypicker-panel.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UserNewPageComponent } from './user-page/user-new-page.component';
import { TestPageComponent } from './test-page/test-page.component';
import { CalendarEtPageComponent } from './calendar-page/calendar-et-page.component';
import { CalendarEtEditorComponent } from './calendar-editor/calendar-et-editor.component';
import { CalendarEtEditPageComponent } from './calendar-page/calendar-et-edit-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DaycardComponent } from './daycard/daycard.component';
import { CalendarEventsPageComponent } from './calendar-page/calendar-events-page.component';
import { CalendarEventPageComponent } from './calendar-page/calendar-event-page.component';
import { CalendarEventNewPageComponent } from './calendar-page/calendar-event-new-page.component';
import { CalendarEventEditorComponent } from './calendar-editor/calendar-event-editor.component';
import { CzdatePipe } from './pipes/czdate.pipe';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BusyfreePipe } from './pipes/busyfree.pipe';
import { PdfViewComponent } from './pdf/pdf-view.component';
import { DialogPdfComponent } from './dialogs/dialog-pdf.component';
import { CalendarEventClipComponent } from './calendar-page/calendar-event-clip.component';
import { CalendarEventPastePageComponent } from './calendar-page/calendar-event-paste-page.component';
import { LocationsPageComponent } from './locations/locations-page.component';
import { AccessDirective } from './access.directive';
import { LocationEditorComponent } from './locations/location-editor.component';
import { LocationPageComponent } from './locations/location-page.component';
import { LocationNewPageComponent } from './locations/location-new-page.component';
import { LocationNamePipe } from './pipes/location-name.pipe';
import { LocationPipe } from './pipes/location.pipe';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { CalendarChipComponent } from './calendar/calendar-chip.component';
import { CalendarPipe } from './pipes/calendar.pipe';

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
    TimepickerPanelComponent,
    CalendarOhtPageComponent,
    CalendarOhPageComponent,
    CalendarOhtEditorComponent,
    DialogConfirmComponent,
    CalendarNewPageComponent,
    CalendarOhEditorComponent,
    DaypickerPanelComponent,
    UserNewPageComponent,
    TestPageComponent,
    CalendarEtPageComponent,
    CalendarEtEditorComponent,
    CalendarEtEditPageComponent,
    DaycardComponent,
    CalendarEventsPageComponent,
    CalendarEventPageComponent,
    CalendarEventNewPageComponent,
    CalendarEventEditorComponent,
    CzdatePipe,
    BusyfreePipe,
    PdfViewComponent,
    DialogPdfComponent,
    CalendarEventClipComponent,
    CalendarEventPastePageComponent,
    LocationsPageComponent,
    AccessDirective,
    LocationEditorComponent,
    LocationPageComponent,
    LocationNewPageComponent,
    LocationNamePipe,
    LocationPipe,
    SubMenuComponent,
    CalendarChipComponent,
    CalendarPipe
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
    MatGridListModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSlideToggleModule,
// last
    GraphQLModule,
  ],
  providers: [
    APP_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TimepickerContent,
    DialogConfirmComponent,
    DialogPdfComponent,
  ]
})
export class AppModule { }
