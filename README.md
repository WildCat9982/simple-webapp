# Simple Node.js Web App

A minimal Express web app: a static frontend plus a small JSON API with an
in-memory message store.

## Run

```bash
cd webapp
npm install
npm start
```

Then open http://localhost:3000

Use `npm run dev` to auto-restart on file changes. Set `PORT` to change the port.

## API

| Method | Path            | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | `/api/health`   | Health check                  |
| GET    | `/api/messages` | List messages                 |
| POST   | `/api/messages` | Add a message `{ "text": "" }` |
