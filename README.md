# Stealth Web App

## Getting Started

### Requirements

You must have the stealth backend running locally on port 8080 connect to a postgres database.

1. Generate a secret for nextAuth. You can copy/paste the code below in your terminal to get a random secret

```bash
openssl rand -hex 32
```

2. Create a copy the .env.sample to .env.local

```bash
cp .env.sample .env.local
```

Replace the `NEXTAUTH_SECRET` in the .env.local file with the secret you just generated

3. Install the dependencies

```bash
yarn install
```

4. First, run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

_Note: To activate an account on local, get the activation key from the db and append it to this link_ like so: `http://localhost:3000/account/activate?key=<your_activation_key>`
