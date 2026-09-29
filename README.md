Setup:
Navigate to /portfolioApp
npm install
npm run dev

# TODO:

- User authentication with OAuth
- User signup creates a portfolio page and commits it to the db (possibly as an attribute of the user)
- When that page is navigated to in the future, it is retrieved from the db
- when logging in, default to that user's page
- when navigating to the page, if the user is the owner of the page, an edit panel is rendered that they can use
- if the user is not authenticated as the owner, the edit panel is not rendered and they are a viewer
- logged in users can still access the home page and other pages (maybe a page header that always renders containing a link to homepage and a primitive search box that navigates to the username specified)
