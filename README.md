## The Two Branches

1_nextauth_aws uses AWS for the database and image storage.
2_nextauth_local uses local image storage and database.

The main branch uses AWS, so if you want to try this project at home without much trouble, checkout 2_nextauth_local before the following steps.

## Getting Started

- clone the repository
- cd into it and run _npm install_
- rename _env.example_ to _.env_ and fill in the values
- start the server with _npm run dev_
- open [http://localhost:3000](http://localhost:3000) with your browser
- enjoy

After signing up for an accout, you can use Prisma Studio to make the user administrator (set _isAdmin_ to true). Once you have a user that is administrator, you can access the admin console at
_/admin_.
