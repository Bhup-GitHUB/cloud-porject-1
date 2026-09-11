# eCommerce Secure Cloud File Platform

A full-stack secure analytical platform for eCommerce, demonstrating secure file storage with upload/download, S3-native versioning, backup replication, JWT-based authentication, and a personalized product ranking system.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, JWT, bcrypt, Multer, AWS SDK v3
- Database: PostgreSQL on Neon.tech, Prisma ORM
- Cloud: AWS S3 (versioning + replication), EC2-ready deployment

## Project Structure

```
ecommerce-cloud-platform/
  frontend/
  backend/
  README.md
  docker-compose.yml
```

## Personalized Product Ranking

Logged-in users see a `/products` page listing sample eCommerce products ranked specifically for them. The ranking score for each product combines:

- **Popularity (70%)**: the product's `rating` and `salesCount`, each normalized 0-1 across the whole catalog and averaged.
- **Personal affinity (30%)**: how often the current user has viewed products in that product's category, normalized against their own most-viewed category. A user with no view history yet gets 0 affinity, so their ranking falls back to pure popularity.

Every time a user opens a product (`POST /api/products/:id/view`), that view is recorded, so clicking around different categories visibly reorders the list on refresh — this is the "personalized" part demoed live, e.g. by logging in as two different users and viewing different categories to show each gets a different ranking.

## 1. Local Setup

### Backend

```
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:4000`.

Seed sample product data for the ranking feature after running migrations:

```
npx prisma db seed
```

### Frontend

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 2. Neon Database Setup

1. Create an account at neon.tech and create a new project.
2. Copy the connection string from the Neon dashboard.
3. Paste it into `backend/.env` as `DATABASE_URL`.

```
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
```

## 3. Prisma Migration Commands

```
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

Schema is defined in `backend/prisma/schema.prisma` with `User`, `File`, `Product`, and `ProductView` models. `npx prisma db seed` populates the `Product` table with sample eCommerce products so the ranking page has data to rank.

## 4. AWS S3 Setup

### Create buckets

```
aws s3api create-bucket --bucket your-primary-bucket --region us-east-1
aws s3api create-bucket --bucket your-backup-bucket --region us-east-1
```

### Enable versioning on both buckets

```
aws s3api put-bucket-versioning --bucket your-primary-bucket --versioning-configuration Status=Enabled
aws s3api put-bucket-versioning --bucket your-backup-bucket --versioning-configuration Status=Enabled
```

Versioning must be enabled on the primary bucket for the file version history and restore features to work.

### Configure replication

1. Create an IAM role that grants S3 permission to replicate objects (`s3:GetReplicationConfiguration`, `s3:ListBucket`, `s3:GetObjectVersionForReplication`, `s3:GetObjectVersionAcl`, `s3:ReplicateObject`, `s3:ReplicateDelete` on the source and destination buckets).
2. In the S3 console, open the primary bucket, go to Management, and create a replication rule targeting the backup bucket, using the IAM role created above.
3. Alternatively via CLI:

```
aws s3api put-bucket-replication --bucket your-primary-bucket --replication-configuration file://replication.json
```

Example `replication.json`:

```
{
  "Role": "arn:aws:iam::ACCOUNT_ID:role/s3-replication-role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "DeleteMarkerReplication": { "Status": "Disabled" },
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::your-backup-bucket"
      }
    }
  ]
}
```

### IAM user for the backend application

Create an IAM user with programmatic access and an inline policy allowing `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucketVersions` on the primary bucket. Put the access key and secret into `backend/.env`.

## 5. EC2 Deployment Steps

1. Launch an EC2 instance (Ubuntu 22.04, t2.micro or larger).
2. SSH into the instance and install Docker and Docker Compose.

```
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

3. Clone the repository onto the instance.

```
git clone <your-repo-url>
cd ecommerce-cloud-platform
```

4. Create `backend/.env` with production values (`DATABASE_URL`, `JWT_SECRET`, AWS credentials, bucket names).
5. Build and run:

```
docker compose up -d --build
```

6. Open the EC2 security group to allow inbound traffic on port 80 (frontend) and optionally 4000 (backend, if accessed directly).
7. Point a domain or use the EC2 public IP to access the app at `http://<ec2-public-ip>`.

An `nginx.conf.example` is provided in `frontend/` showing how the frontend container serves the built static assets and reverse-proxies `/api` to the backend service.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list of required variables.
