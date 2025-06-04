# Cargohub Backend

Cargohub is a RESTful API built with [NestJS](https://nestjs.com/) and MongoDB, designed to manage logistics operations including users, clients, carriers, requests, routes, trucks, billing, and audit logs.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <REPO_URL>
   cd cargohub-back
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.template` to `.env` and fill in the required values.

4. **Run the development server:**

   ```sh
   npm run start:dev
   ```

5. **Access the API:**
   - API base URL: `http://localhost:3000/api`
   - Swagger docs: `http://localhost:3000/api/v1`

## 📧 Gmail Credentials Setup

To enable email features, set up Gmail OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the Gmail API for your project.
4. Create OAuth 2.0 Client ID credentials.
5. Configure the OAuth consent screen.
6. Set the application type to "Web application".
7. Add authorized redirect URIs (e.g., `https://developers.google.com/oauthplayground`).
8. Add your `EMAIL_CLIENT_ID` and `EMAIL_CLIENT_SECRET` to `.env`.
9. Use [OAuth 2.0 Playground](https://developers.google.com/oauthplayground) to authorize Gmail API access.
10. Copy the `refresh_token` and add it to `.env` as `EMAIL_REFRESH_TOKEN`.
11. Ensure `redirect_uri` in `.env` matches your Google Cloud configuration.

## 🛠️ Features

### Authentication

| Method | Route                         | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/auth/refresh-token`         | Refresh JWT token        |
| GET    | `/auth/verify-session-token`  | Verify session JWT token |
| GET    | `/auth/verify-email-token`    | Verify email JWT token   |
| POST   | `/auth/login`                 | User login               |
| POST   | `/auth/register`              | User registration        |
| POST   | `/auth/register/adminManager` | Register admin/manager   |
| POST   | `/auth/set-password`          | Set user password        |
| POST   | `/auth/change-password`       | Change password          |
| POST   | `/auth/recover-password`      | Recover password         |
| POST   | `/auth/2fa/verify`            | Verify 2FA code          |
| POST   | `/auth/2fa/activate`          | Activate 2FA             |
| POST   | `/auth/2fa/generate`          | Generate 2FA secret      |
| PATCH  | `/auth/2fa/disable`           | Disable 2FA              |

### Dashboard

| Method | Route                | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/dashboard/summary` | Dashboard summary |

### Users

| Method | Route                          | Description       |
| ------ | ------------------------------ | ----------------- |
| GET    | `/users/get-users`             | List users        |
| PATCH  | `/users/update-user`           | Update user       |
| DELETE | `/users/delete-user`           | Delete user       |
| DELETE | `/users/delete-user/admin/:id` | Admin delete user |

### Clients

| Method | Route                 | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/clients`            | List clients         |
| GET    | `/clients/:id`        | Get client by ID     |
| PATCH  | `/clients/:id/status` | Update client status |

### Requests

| Method | Route                               | Description           |
| ------ | ----------------------------------- | --------------------- |
| GET    | `/requests/clientRequest/:clientId` | Get client requests   |
| GET    | `/requests/:requestId`              | Get request by ID     |
| PATCH  | `/requests/status/:requestId`       | Update request status |
| POST   | `/requests`                         | Create request        |
| DELETE | `/requests/:requestId`              | Delete request        |

### Routes

| Method | Route                                          | Description                 |
| ------ | ---------------------------------------------- | --------------------------- |
| GET    | `/routes`                                      | List routes                 |
| GET    | `/routes/:id`                                  | Get route by ID             |
| GET    | `/routes/status/:status`                       | List routes by status       |
| GET    | `/routes/carrier/:carrierId`                   | List routes by carrier      |
| POST   | `/routes/assign-carrier/{routeId}/{carrierId}` | Assign carrier to route     |
| POST   | `/routes/unassign-carrier/{routeId}`           | Unassign carrier from route |
| PATCH  | `/routes/status/:id`                           | Update route status         |

### Carriers

| Method | Route                                        | Description                 |
| ------ | -------------------------------------------- | --------------------------- |
| GET    | `/carriers`                                  | List carriers               |
| GET    | `/carriers/:id`                              | Get carrier by ID           |
| POST   | `/carriers/carrierRoutes/:carrierId`         | Get carrier's routes        |
| POST   | `/carriers/:carrierid/assign-truck/:truckId` | Assign truck to carrier     |
| POST   | `/carriers/:carrierid/unassign-truck`        | Unassign truck from carrier |
| PATCH  | `/carriers/:carrierId/status`                | Update carrier status       |

### Trucks

| Method | Route                | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/trucks`            | List trucks         |
| GET    | `/trucks/:id`        | Get truck by ID     |
| PATCH  | `/trucks/:id`        | Update truck        |
| PATCH  | `/trucks/status/:id` | Update truck status |
| POST   | `/trucks`            | Create truck        |
| DELETE | `/trucks/:id`        | Delete truck        |

### Billing

| Method | Route                        | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/billings`                  | List billings     |
| GET    | `/billings/:id`              | Get billing by ID |
| GET    | `/billings/status/:status`   | List by status    |
| GET    | `/billings/client/:clientId` | List by client    |
| PATCH  | `/billings/status/:id`       | Update billing    |
| DELETE | `/billings/:id`              | Delete billing    |

### Audit Logs

| Method | Route         | Description     |
| ------ | ------------- | --------------- |
| GET    | `/audit-logs` | List audit logs |

## 📂 Project Structure

```
src/
  app.module.ts
  main.ts
  common/
  config/
  modules/
    audit-logs/
    auth/
    carriers/
    clients/
    dashboard/
    facturacion/
    requests/
    rutas/
    trucks/
    users/
test/
```

## 🧭 How the Backend Works

Cargohub follows a modular architecture using NestJS, with each domain (users, clients, carriers, etc.) organized in its own module under `src/modules/`. The backend exposes RESTful endpoints for all core logistics operations, and uses MongoDB as its primary data store.

### User Flow

1. **Registration & Authentication**

   - Users register via `/auth/register` or are created by an admin.
   - Email verification and password setup are handled via secure tokens.
   - Users log in via `/auth/login` and receive a JWT for authenticated requests.
   - Two-factor authentication (2FA) can be enabled for added security.

2. **Role Assignment**

   - Users can have roles such as `client`, `carrier`, `admin`, or `manager`.
   - Depending on the role, additional data is collected (e.g., company info for clients, DNI for carriers).

3. **Entity Creation**

   - When a user registers as a client or carrier, related entities are created in the `clients` or `carriers` collections.
   - The user document stores references to these entities.

4. **Requests and Operations**

   - Clients can create shipment requests via `/requests`.
   - Admins and managers can assign carriers to routes and manage logistics operations.
   - Carriers can view and manage their assigned routes and trucks.

5. **Audit Logging**

   - All critical actions (user creation, updates, deletions, assignments) are logged in the audit logs for traceability.

6. **Billing and Tracking**

   - Billing records are generated once a request is completed and are managed for each client.
   - The status of requests, routes, and trucks can be updated and tracked via their respective endpoints.

7. **Admin Features**
   - Admins can manage all users, clients, carriers, and system configurations.
   - Special endpoints exist for admin-level user deletion and management.

### Example User Journey

- A new client registers and verifies their email.
- The client logs in and creates a shipment request.
- An admin reviews the request and assigns a carrier with truck assigned to the route.
- The carrier is notified and manages the assigned route.
- All actions are logged for auditing.
- Billing is generated for the completed shipment.

## 📄 License

This project is licensed under the MIT License.

---
