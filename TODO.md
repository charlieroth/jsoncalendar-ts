# TODO

## 1. Setup & Installation

- [x] 1.1 Initialize TypeScript project (configure `tsconfig.json`)
- [x] 1.2 Install dependencies: `typescript`, `zod`, `vitest`
- [x] 1.3 Verify project builds and tests run (`npm run build`, `npm test`)


## 2. Implement Zod Schemas

Using zod, implement the following schemas in `src/schemas/`:

- [x] 2.1 Implement `DurationSchema` in `src/schemas/duration.ts`
- [x] 2.2 Implement `RecurrenceSchema` in `src/schemas/recurrence.ts`
- [x] 2.3 Implement `AttendeeSchema` in `src/schemas/attendee.ts`
- [x] 2.4 Implement `NotificationSchema` in `src/schemas/notification.ts`
- [x] 2.5 Implement `LocationSchema` in `src/schemas/location.ts`
- [x] 2.6 Implement `OrganizerSchema` in `src/schemas/organizer.ts`
- [x] 2.7 Implement `EventSchema` in `src/schemas/event.ts`
- [x] 2.8 Implement `CalendarSchema` in `src/schemas/calendar.ts`
- [x] 2.9 Implement `JsonCalendarDocumentSchema` in `src/schemas/jsonCalendarDocument.ts`
- [ ] 2.10 Write tests in `tests/schemas/` to validate each schema against valid and invalid data

## 3. Define TypeScript Interfaces

Using the zod schemas, define the following interfaces in `src/types/`:

- [x] 3.1 Create `Duration` interface in `src/types/duration.ts`
- [x] 3.2 Create `Recurrence` interface in `src/types/recurrence.ts`
- [x] 3.3 Create `Attendee` interface in `src/types/attendee.ts`
- [x] 3.4 Create `Notification` interface in `src/types/notification.ts`
- [x] 3.5 Create `Location` interface in `src/types/location.ts`
- [x] 3.6 Create `Organizer` interface in `src/types/organizer.ts`
- [x] 3.7 Create `event.ts` interface in `src/types/event.ts`
- [x] 3.8 Create `calendar.ts` interface in `src/types/calendar.ts`
- [x] 3.9 Create `jsonCalendarDocument.ts` interface in `src/types/jsonCalendarDocument.ts`

## 4. Load & Parse JSON Calendar
- [x] 4.1 Add `loadJsonCalendar(jsonData: unknown): JsonCalendarDocument` function in `src/index.ts`
- [x] 4.2 Ensure clear error handling for validation failures
- [x] 4.3 Write tests in `tests/load.spec.ts` for successful load and failure scenarios

## 5. Core Operations & Classes
- [x] 5.1 Create `JsonCalendarEvent` class in `src/JsonCalendarEvent.ts` with methods:
  - [x] `isRecurring()`
  - [x] `getOccurrences(startDate: string, endDate: string)`
  - [x] `addAttendee(attendee: Attendee)`
  - [x] `setNotification(notification: Notification)`
- [x] 5.2 Create `JsonCalendar` class in `src/JsonCalendar.ts` with methods:
  - [x] `addEvent(event: Event)`
  - [x] `findEventsByDateRange(start: string, end: string)`
  - [x] `getEventsByUid(uid: string)`
  - [x] `validate()`
- [x] 5.3 Write tests in `tests/utils/` covering all class methods

## 6. Event CRUD Utilities
- [x] 6.1 Implement CRUD helpers in `src/calendarOperations.ts`
  - [x] 6.1.1 `createEvent(calendar: Calendar, event: Event): Calendar` - Adds event, returns updated calendar.
  - [x] 6.1.2 `getEventByUid(calendar: Calendar, uid: string): Event | undefined` - Finds event by UID.
  - [x] 6.1.3 `getAllEvents(calendar: Calendar): Event[]` - Returns all events.
  - [x] 6.1.4 `updateEvent(calendar: Calendar, updatedEvent: Event): Calendar` - Replaces event by UID, updates `lastModified`, returns updated calendar.
  - [x] 6.1.5 `deleteEvent(calendar: Calendar, uid: string): Calendar` - Removes event by UID, returns updated calendar.
- [x] 6.2 Write tests in `tests/calendarOperations.spec.ts` to cover create/read/update/delete workflows

## 7. Recurrence Logic
- [ ] 7.1 Parse and interpret recurrence rules in `src/recurrence.ts`:
  - [ ] `frequency`, `interval`, `until`, `count`, `byDay`, `byMonthDay`, `weekStart`
  - [ ] Handle `exceptionDates` and `recurrenceAdditions`
- [ ] 7.2 Expose `getOccurrences(event: Event, start: string, end: string)` function
- [ ] 7.3 Write tests in `tests/recurrence.spec.ts` for:
  - [ ] Single and multiple occurrences
  - [ ] Exceptions and additions
  - [ ] Edge cases (leap years, month transitions)

## 8. Attendee & Notification Management
- [ ] 8.1 Implement attendee utilities in `src/utils/attendeeUtils.ts`:
  - [ ] `addAttendee(event: Event, attendee: Attendee)`
  - [ ] `removeAttendee(event: Event, email: string)`
  - [ ] `updateAttendee(event: Event, attendee: Attendee)`
- [ ] 8.2 Implement notification utilities in `src/utils/notificationUtils.ts`:
  - [ ] `addNotification(event: Event, notification: Notification)`
  - [ ] `removeNotification(event: Event, id: string)`
  - [ ] `updateNotification(event: Event, notification: Notification)`
- [ ] 8.3 Write tests in `tests/attendeeUtils.spec.ts` and `tests/notificationUtils.spec.ts`

## 9. Location Handling
- [ ] 9.1 Add helper functions in `src/utils/locationUtils.ts`
- [ ] 9.2 Write tests in `tests/locationUtils.spec.ts` to validate location data handling

## 10. Serialization
- [ ] 10.1 Implement `serializeJsonCalendar(doc: JsonCalendarDocument): string` in `src/index.ts`
- [ ] 10.2 Write tests in `tests/serialization.spec.ts` to ensure serialized output matches schema

## 11. Documentation & Examples
- [ ] 11.1 Generate API documentation using TypeDoc
- [ ] 11.2 Update `README.md` with:
  - [ ] Usage examples for loading and manipulating calendar data
  - [ ] Inline code references for key types and functions

## 12. Packaging & Publishing
- [ ] 12.1 Finalize `package.json` metadata (name, version, keywords, author)
- [ ] 12.2 Configure publishing settings (access level, tags)
- [ ] 12.3 Write changelog and release notes
- [ ] 12.4 Publish the package to npm registry 