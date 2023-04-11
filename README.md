# DU Central :books: :file_folder: :computer:

DU Central is a website where people can upload and download notes, question papers, practical files and ebooks for University courses. The website uses Node.js for the backend and Vanilla JavaScript for the frontend. Google Drive API is used to store the uploaded files and MySQL as the database.

## Getting Started :rocket:

To run the site, you can follow these steps:

1. Clone the repository:
   `https://github.com/Kartikey-Tiwari/du-central`
2. Install the npm dependencies:
   `npm install`
3. Create a service account from Google Cloud Console, and get the credentials.js file from there.
4. Put the `credentials.js` file in the current directory.
5. Create database ducentral on your machine and change the username and password in the server.js file
   `mysql -u [username] -p ducentral < ducentral.sql`
6. Run the server
   `node server.js`

## Features :star2:

- Upload notes, question papers, practical files and ebooks for University courses.
- Download files uploaded by other users.
- Search for courses by course name, or the exact university, course, and semester.
- Responsive design that works well on mobile devices.

## Contributing :handshake:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes, and commit them with a descriptive commit message.
- Push your changes to your forked repository.
- Create a pull request from your branch to the main repository.
