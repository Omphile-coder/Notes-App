# Washi Notes

Washi Notes is an Android and iOS notes app for organizing work, study, and personal notes. Its interface takes inspiration from a paper notebook, with a cream grid, pastel cards, washi tape, and Caveat handwriting.

Built by Omphile Lucas for CodeTribe's React Native Task 2.

## Features

<img src="./mobile/assets/notes-iphone.jpg"/>

## Features

- Register with a username, email, and password. Sign in to reach the notes board, and use Profile to update your account details or sign out.
- Create, view, edit, and delete notes. Each note needs a body and category. Titles are optional, and the editor shows when a note was added and last edited.
- Browse all notes or open the **Work**, **Study**, or **Personal** page. Switch between **Board** and **List** layouts.
- Search titles and note text. Every word in the query must match, and search is case-insensitive.
- Sort by **Date added**, either newest or oldest first. Tap a card's pin icon to move the note to **Pinned**, and tap again to unpin it. Date sorting applies within each section.

## Run locally

Use [Node.js 24 LTS](https://nodejs.org/) with npm. From the repository root, run:

```bash
cd mobile
npm i
npm start
```

Scan the terminal QR code with an Expo Go build compatible with SDK 58. With an Android emulator or iOS simulator already configured, press `a` or `i` in the Expo terminal. See [Expo's device setup guide](https://docs.expo.dev/get-started/start-developing/) and [SDK compatibility guide](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

Create an account on the device the first time you open the app. The app creates its SQLite tables on first use and needs no backend or API keys.

## Data and authentication

SQLite stores accounts, notes, and pins on the device. Passwords are stored as salted Argon2id hashes, and Expo SecureStore retains the signed-in account ID. React Navigation guards authenticated screens, and note queries are scoped to the signed-in account. Accounts and notes are local to each installation.

## Project structure

The app uses Expo SDK 58, React Native, TypeScript, React Navigation, Expo SQLite, and Expo SecureStore.

| Directory                                        | Purpose                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| [`mobile/src/screens`](mobile/src/screens)       | Sign-in, registration, board, category, editor, and profile screens |
| [`mobile/src/navigation`](mobile/src/navigation) | Stack routes, route types, and auth-based routing                   |
| [`mobile/src/board`](mobile/src/board)           | Board and list layouts, note cards, and the paper theme             |
| [`mobile/src/notes`](mobile/src/notes)           | Categories, note queries, search, and pinning                       |
| [`mobile/src/auth`](mobile/src/auth)             | Account validation, password hashing, and session management        |
| [`mobile/src/storage`](mobile/src/storage)       | SQLite initialization and tables                                    |

## Verify the app

From `mobile/`, check the TypeScript source with `npx tsc --noEmit`.

On a device, register and sign in, then create two notes in one category. Edit one and check its timestamps, search for it using two words, switch date order, and pin it. Reopen the app to confirm the note and pin are saved. Unpin or delete the note, update your profile, and sign out.
