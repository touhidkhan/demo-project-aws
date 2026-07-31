# Cloud Native CI/CD Pipeline Workshop
## Cloud Native Days 2026

This workshop demonstrates a complete **Cloud Native CI/CD pipeline** using modern DevOps practices including containerization, security scanning, and GitOps deployment.

## Workshop Objectives

Learn how to build a production-ready CI/CD pipeline that:
- **Containerizes** applications using Docker
- **Automates** builds and deployments with GitHub Actions
- **Scans** for security vulnerabilities with Trivy
- **Implements** GitOps practices for automated deployments
- **Follows** Cloud Native best practices

## CI/CD Pipeline Overview

<img src="src/assets/diagram.png" alt="CI/CD Pipeline Diagram" width="600" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">

The pipeline follows this workflow:

1. **Code Push** → Push to main branch triggers the pipeline
2. **Build** → Docker image is built and pushed to Docker Hub
3. **Security Scan** → Trivy scans the image for vulnerabilities
4. **Security Gate** → Build fails if critical vulnerabilities are found
5. **GitOps Update** → Deployment manifest is updated automatically
6. **Deploy** → Changes are committed to GitOps repository

## Prerequisites

### Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
```

Verify installation:
```bash
docker --version
docker run hello-world
```

For platform-specific instructions, visit [Docker Documentation](https://docs.docker.com/get-docker/).

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cnbd-workshop-demo-app.git
cd cnbd-workshop-demo-app
```

Replace `YOUR_USERNAME` with your GitHub username or the repository owner.

### 2. Manual Docker Build (Before Automation)

Before setting up the automated CI/CD pipeline, test the Docker build locally:

**Build the Docker image:**
```bash
docker build -t devops-radar:local .
```

**Verify the build:**
```bash
docker images | grep devops-radar
```

You should see the `devops-radar:local` image in the list.

### 3. Run the Container

**Run the container on port 30999:**
```bash
docker run -d -p 30999:80 --name devops-skills-radar devops-radar:local
```

**Verify the container is running:**
```bash
docker ps | grep devops-skills-radar
```

**Access the application:**
Open your browser and navigate to:
```
http://<SERVER_IP>:30999
```

Replace `<SERVER_IP>` with your server's IP address. For example:
- If running locally: `http://localhost:30999` or `http://127.0.0.1:30999`
- If running on a remote server: `http://192.168.1.100:30999` (use your server's actual IP)

**View container logs:**
```bash
docker logs devops-skills-radar
```

**Stop the container:**
```bash
docker stop devops-skills-radar
```

**Remove the container:**
```bash
docker rm devops-skills-radar
```

**Note:** The container runs Nginx on port 80 internally, which is mapped to port 30999 on your host machine.

## Project Structure

```
workshop/
├── .github/
│   └── workflows/
│       ├── docker-build-push-scan.yml  # Main CI/CD pipeline
│       └── gitops-update.yml            # GitOps automation
├── Dockerfile                           # Multi-stage Docker build
├── docker-compose.yml                   # Local development
├── nginx.conf                          # Production web server config
└── src/                                # Application source code
```

## CI/CD Pipeline Details

### Workflow 1: Build, Push, and Scan

**File:** `.github/workflows/docker-build-push-scan.yml`

**What it does:**
1. **Checkout Code** - Retrieves source code from repository
2. **Docker Build** - Builds container image using Dockerfile
3. **Push to Registry** - Pushes image to Docker Hub with tags:
   - `username/devops-radar:commit-sha` (e.g., `abc1234`)
   - `username/devops-radar:latest`
4. **Security Scan** - Scans image with Trivy for vulnerabilities
5. **Generate Reports** - Creates SARIF and table format reports

**Key Features:**
- Automatic image tagging with commit SHA
- Security scanning before deployment
- Build fails on critical vulnerabilities
- Artifact generation for security reports

### Workflow 2: GitOps Update

**File:** `.github/workflows/gitops-update.yml`

**What it does:**
1. **Trigger** - Runs automatically after successful build
2. **Checkout GitOps Repo** - Retrieves deployment configurations
3. **Update Image Tag** - Replaces `:latest` with `:commit-sha` in `frontend/deployment.yml`
4. **Commit & Push** - Commits changes to trigger deployment

**GitOps Benefits:**
- Automated deployment updates
- Version-controlled infrastructure
- Audit trail of all changes
- Faster, safer deployments

## Setup Instructions

### 1. Configure Docker Hub Secrets

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Docker Hub access token
     - Create token at: [Docker Hub Account Settings](https://hub.docker.com/settings/security)

### 2. Configure GitOps Secrets (Optional)

For automated GitOps deployments using **Deploy Keys** (SSH keys - recommended for security):

#### Step 1: Generate SSH Key Pair

On your local machine or server, generate an SSH key pair:

```bash
ssh-keygen -t rsa -b 4096 -C "gitops-deploy-key" -f ~/.ssh/gitops_deploy_key
```

This creates two files:
- `~/.ssh/gitops_deploy_key` (private key - keep this secret!)
- `~/.ssh/gitops_deploy_key.pub` (public key - add to GitHub)

#### Step 2: Add Deploy Key to GitOps Repository

1. On GitHub, navigate to your **GitOps repository**
2. Under your repository name, click **Settings**
3. In the sidebar, click **Deploy Keys**
4. Click **Add deploy key**
5. In the **Title** field, provide a title (e.g., `gitops-update-key`)
6. In the **Key** field, paste your **public key** (contents of `gitops_deploy_key.pub`)
7. **Select "Allow write access"** - This is required for pushing changes
8. Click **Add key**

#### Step 3: Add Secrets to Main Repository

1. Go to your main repository → **Settings** → **Secrets and variables** → **Actions**
2. Add `GITOPS_REPO`: Your GitOps repository in format `owner/repo-name`
   - Example: `amdadulbari/cloudnative-gitops`
   - Don't use: `https://github.com/amdadulbari/cloudnative-gitops.git`
3. Add `GITOPS_DEPLOY_KEY`: Your **private key** (contents of `gitops_deploy_key`)
   - Copy the entire private key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

**Why Deploy Keys?**
- More secure than Personal Access Tokens
- Repository-specific (can't access other repos)
- Can be easily revoked by deleting the key
- Better for automation and CI/CD
- Uses SSH encryption

### 3. Workflow Triggers

- **Automatic**: Runs on every push to `main` branch
- **Manual**: Can be triggered from GitHub Actions tab

## Security Scanning

### Trivy Integration

The pipeline uses **Trivy** to scan Docker images for:
- Known vulnerabilities (CVE database)
- Misconfigurations
- Secrets exposure
- License compliance

**Scan Results:**
- Build **fails** on CRITICAL vulnerabilities
- Reports available as downloadable artifacts
- SARIF format for security tool integration
- Human-readable table format

**Access Reports:**
1. Go to **Actions** tab
2. Click on workflow run
3. Download artifacts from **Artifacts** section

## Docker Best Practices

### Multi-Stage Build

The Dockerfile uses multi-stage builds to:
- Reduce final image size
- Improve security (fewer packages)
- Faster builds with layer caching

### Production Configuration

- **Nginx** serves static files
- **Health checks** for container monitoring
- **Optimized** for production workloads

## GitOps Workflow

### How It Works

1. Developer pushes code to main branch
2. CI pipeline builds and scans Docker image
3. If scan passes, GitOps workflow updates deployment manifest
4. GitOps repository change triggers deployment
5. New version is deployed automatically

### Benefits

- **Declarative**: Infrastructure as code
- **Versioned**: All changes tracked in Git
- **Automated**: No manual deployment steps
- **Auditable**: Complete history of deployments

## Image Tagging Strategy

Images are tagged with:
- **Commit SHA**: `username/devops-radar:abc1234` (immutable, specific version)
- **Latest**: `username/devops-radar:latest` (always points to newest build)

**Why both?**
- Commit SHA: Pin to specific version for production
- Latest: Easy access to most recent build

## Technologies & Tools

### Core Technologies
- **Docker** - Containerization platform
- **GitHub Actions** - CI/CD automation
- **Trivy** - Security vulnerability scanner
- **Nginx** - Web server for production

### DevOps Practices
- **CI/CD** - Continuous Integration and Deployment
- **GitOps** - Git-based operations
- **Security Scanning** - Shift-left security

## Learning Outcomes

After completing this workshop, you will understand:

1. How to containerize applications with Docker
2. How to build automated CI/CD pipelines
3. How to implement security scanning in pipelines
4. How to use GitOps for automated deployments
5. How to follow Cloud Native best practices

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [GitOps Principles](https://www.gitops.tech/)

## Contributing

This is a workshop project for Cloud Native Days 2026. Feel free to experiment and learn!

## License

MIT License - Educational use for Cloud Native Days 2026 workshop

---

**Workshop:** Cloud Native Days 2026  
**Focus:** CI/CD, Docker, Security Scanning, GitOps
