# Sharoute

_Share gpx routes!_

<hr />

<p align="center">
    <img src="https://raw.githubusercontent.com/wpazderski/sharoute/master/readme-img1.png" width="900" />
</p>

<hr />

## Main features

-   Uploading a route (.gpx files); to upload and manage routes user has to sign in (currently only Google provider is supported - more providers are coming soon)
-   Setting basic route properties: name and description
-   Route descriptions support Rich Text
-   Adding route points e.g. "Coffee Stop" (with custom name and description)
-   Sharing the route via link or QR code; shared route can be viewed without signing in
-   Shared routes contain:
    -   Name, description
    -   Map with the route
    -   Grade and elevation charts
    -   Basic stats e.g. "elevation gain"

## Demo

A demo instance is available here: https://sharoute.vercel.app

There are some limitations when the app runs in demo mode - read warning in the app for more details.

## Stuff to implement in the future

1. Add support for uploading photos (both in routes and route points
1. Add more grade-related stats: "Max grade over {distance}" e.g. "Max grade over 100m"
1. Add route point location picker for new route points (currently the closest one is picked)
1. Switch npm "recharts" to non-alpha as soon as 2.13 stable is released (current stable version is throwing errors)
1. Add Next.js's "Partial Prerendering" - currently it's an experimental feature
1. Add more authentication providers

## What's the tech behind this project?

-   [TypeScript](https://www.typescriptlang.org/)
-   [MongoDB](https://www.mongodb.com/)
-   [React](https://react.dev/)
-   [Next.js 14](https://nextjs.org/) (App router)
-   [next-intl](https://next-intl-docs.vercel.app/)
-   [Auth.js](https://authjs.dev/)
-   [Mantine](https://mantine.dev/)
-   [Tabler icons](https://tabler.io/)
-   [Geodesy](https://www.movable-type.co.uk/scripts/geodesy-library.html)
-   [Mapbox](https://www.mapbox.com/)
-   [Eslint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   ...and more

## Usage

Start by cloning the repository and installing dependencies:

```
git clone https://github.com/wpazderski/sharoute.git
cd sharoute
pnpm install
```

Then copy `.env.example` file to `.env.local` and set env vars. You'll need:

-   MongoDB connection params,
-   Google OAuth ID and Secret,
-   Mapbox Access Token.

### Development

Start the application in development mode:

```
pnpm run dev
```

### Production

Start the application in production mode:

```
pnpm run build
pnpm run start
```
