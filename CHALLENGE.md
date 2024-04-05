# Simplified Meeting Scheduling Application Challenge

## Objectives

1. Develop a user-friendly interface for users to create and manage their availability for meetings.
2. Allow other users to view available time slots and schedule meetings with the available user.
3. Ensure that there are no conflicts in meeting schedules and that the system maintains data integrity.

## Features

### 1. User availability management

- Allow users to define their available time slots for meetings.
- Support setting availability on a weekly basis (e.g., available every Monday and Wednesday from 2 PM to 4 PM).

<img src="https://github.com/mybasket-io/anyaa-fs-challenge/blob/main/docs/availability.png?raw=true" alt="User availability management" width="600">

### 2. Meeting scheduling

- Display a user's available date and time slots on their public profile page.
- Allow other users to select an available time slot and schedule a meeting.
- Collect necessary information from the meeting requestor (name, email, meeting purpose).
- Store the scheduled meeting details in the database.

<img src="https://github.com/mybasket-io/anyaa-fs-challenge/blob/main/docs/book.png?raw=true" alt="User availability management" width="600">

### 3. Meeting management

- Allow users to view their scheduled meetings.
  - List of:
    - Meeting date and time
    - Meeting purpose
    - Requestor name and email

### 4. Booking conflict prevention

- Ensure that no two meetings can be scheduled for the same time slot.
- Display only available time slots to users.
- Handle concurrent booking attempts gracefully.

## Technical Requirements

1. Use React / [Remix](https://remix.run/) for the application.
2. Use [Prisma](https://www.prisma.io/docs) as the ORM for database management.
3. Use [DayJS](https://day.js.org/) for date and time handling.
4. Use [Mantine](https://mantine.dev/) for building the user interface components.
5. Implement proper error handling and user feedback.
6. Write unit tests for critical functionality (optional).
7. Provide clear instructions on how to set up and run the application.

## Evaluation Criteria

1. **Functionality**: Does the application meet the specified requirements?
2. **Code Quality**: Is the code well-structured, readable, and maintainable?
3. **UI/UX**: Is the user interface intuitive and visually appealing?
4. **Data Integrity**: Are meeting conflicts prevented, and is data consistency maintained?
5. **Testing**: Are unit tests provided for critical functionality?
6. **Documentation**: Are setup instructions and API documentation provided?

## Submitting Your Solution

Once you have completed the challenge, please follow these steps to submit your solution:

1. Create a new repository on your GitHub account.
2. Push your local repository to your GitHub repository using the following commands:
   1. `git remote add origin https://github.com/your-username/your-repository.git`
   2. `git push -u origin main`
3. Ensure that your repository is public and accessible.
4. Send the link to your repository to the hiring team for review.

We will review your solution and provide feedback. If you have any questions or need assistance, please don't hesitate to reach out.

## Notes

- The challenge focuses on the core functionality of managing user availability and scheduling meetings.
- User authentication has been excluded to simplify the challenge and keep it manageable.
- The candidate should demonstrate their skills in building a fullstack application using the specified technologies, handling date and time operations, implementing input validation, and ensuring data integrity.
- The challenge should be completed within a week.

Feel free to reach out if you have any questions or need further clarification regarding the challenge. Good luck!
