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

## Deploy (CodePipeline → Elastic Beanstalk)

Files in this repo that support deployment:

| File | Purpose |
| ---- | ------- |
| `Procfile` | Tells the Elastic Beanstalk Node.js platform how to start the app |
| `buildspec.yml` | CodeBuild stage: `npm ci`, `npm test`, prune dev deps |
| `.ebextensions/01-app.config` | Health check URL, enhanced health, `NODE_ENV` |
| `infra/pipeline.yaml` | CloudFormation: EB app/env + CodePipeline (Source → Build → Deploy) |

### One-time setup

1. **Create a GitHub connection** (CodeConnections) in the AWS console:
   Developer Tools → Settings → Connections → *Create connection* → GitHub.
   Finish the OAuth handshake so it shows **Available** — a connection created
   any other way stays `PENDING` and the pipeline cannot use it.
2. **Pick the current Node.js solution stack** for your region:

   ```bash
   aws elasticbeanstalk list-available-solution-stacks \
     --query "SolutionStacks[?contains(@, 'running Node.js 20')]" --output text
   ```

3. **Deploy the pipeline stack:**

   ```bash
   aws cloudformation deploy \
     --stack-name simple-webapp-pipeline \
     --template-file infra/pipeline.yaml \
     --capabilities CAPABILITY_IAM \
     --parameter-overrides \
       GitHubConnectionArn=arn:aws:codeconnections:REGION:ACCOUNT:connection/xxxx \
       SolutionStackName="64bit Amazon Linux 2023 v6.6.4 running Node.js 20"
   ```

Every push to `main` then triggers the pipeline. The app URL is in the stack
outputs (`AppUrl`).
