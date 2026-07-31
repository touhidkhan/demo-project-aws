# GitHub Actions Documentation & Custom Actions Guide

## 📚 How to Find Documentation for Actions


### Method 1: GitHub Marketplace (Easiest)
1. Go to [GitHub Marketplace](https://github.com/marketplace)
2. Search for the action name (e.g., "docker login")
3. Click on the action to see:
   - Usage examples
   - Input parameters
   - Output values
   - Version history
   - Pricing (if applicable)

**Example URLs:**
- Docker Login: https://github.com/marketplace/actions/docker-login
- Trivy: https://github.com/marketplace/actions/aqua-security-trivy

### Method 2: Action's GitHub Repository
1. Navigate to the repository: `https://github.com/ORG/REPO-NAME`
   - For `docker/login-action@v3` → `https://github.com/docker/login-action`
   - For `aquasecurity/trivy-action` → `https://github.com/aquasecurity/trivy-action`
2. Look for:
   - **README.md** - Main documentation
   - **action.yml** or **action.yaml** - Action definition file (shows all inputs/outputs)
   - **Examples/** folder - Usage examples

### Method 3: Direct Links from Your Workflow
In VS Code or GitHub, you can:
- Hover over the action name to see a tooltip
- Click "Go to Definition" (if available)
- Right-click → "Go to Repository"

---

## 🔍 How to View Source Code

### Step 1: Find the Repository
Actions follow this pattern: `ORG/REPO-NAME@VERSION`

**Examples:**
- `docker/login-action@v3` → Repository: `github.com/docker/login-action`
- `aquasecurity/trivy-action@master` → Repository: `github.com/aquasecurity/trivy-action`

### Step 2: View the Action Definition
Look for `action.yml` or `action.yaml` in the repository root. This file defines:
```yaml
name: 'Action Name'
description: 'What it does'
inputs:
  username:
    description: 'Username input'
    required: true
runs:
  using: 'docker'  # or 'node12', 'composite'
  image: 'Dockerfile'
```

### Step 3: Explore the Implementation
- **Docker actions**: Check `Dockerfile` and entrypoint scripts
- **JavaScript actions**: Check `lib/` or `dist/` folders
- **Composite actions**: Check the shell scripts in `action.yml`

### Step 4: Check Specific Versions
- Click on "Releases" or "Tags" in the repository
- Select a version (e.g., `v3.0.0`)
- View the code at that specific point in time

**Example: Viewing docker/login-action@v3 source:**
1. Go to: https://github.com/docker/login-action
2. Click "Releases" → Find `v3.x.x`
3. Or browse: https://github.com/docker/login-action/tree/v3

---

## 🛠️ Creating Custom Actions

You can create three types of actions:

### Type 1: Composite Actions (Simplest)
**Best for:** Simple scripts that combine multiple commands

**Structure:**
```
my-custom-action/
├── action.yml
└── README.md
```

**Example `action.yml`:**
```yaml
name: 'My Custom Action'
description: 'Does something cool'
inputs:
  message:
    description: 'Message to print'
    required: true
    default: 'Hello World'
outputs:
  result:
    description: 'The result'
    value: ${{ steps.step1.outputs.result }}
runs:
  using: 'composite'
  steps:
    - name: Print message
      shell: bash
      run: echo "${{ inputs.message }}"
    
    - name: Set output
      id: step1
      shell: bash
      run: echo "result=success" >> $GITHUB_OUTPUT
```

**Usage in workflow:**
```yaml
- uses: ./.github/actions/my-custom-action
  with:
    message: 'Custom message'
```

### Type 2: JavaScript Actions
**Best for:** Complex logic, API calls, file manipulation

**Structure:**
```
my-js-action/
├── action.yml
├── package.json
├── index.js
└── README.md
```

**Example `action.yml`:**
```yaml
name: 'JavaScript Action'
description: 'Does something with JS'
inputs:
  name:
    description: 'Name input'
    required: true
runs:
  using: 'node20'
  main: 'index.js'
```

**Example `index.js`:**
```javascript
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const name = core.getInput('name');
  console.log(`Hello, ${name}!`);
  
  core.setOutput('result', 'success');
}

run().catch(core.setFailed);
```

### Type 3: Docker Actions
**Best for:** Actions that need specific tools/environments

**Structure:**
```
my-docker-action/
├── action.yml
├── Dockerfile
├── entrypoint.sh
└── README.md
```

**Example `action.yml`:**
```yaml
name: 'Docker Action'
description: 'Runs in Docker container'
inputs:
  command:
    description: 'Command to run'
    required: true
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.command }}
```

**Example `Dockerfile`:**
```dockerfile
FROM ubuntu:22.04
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

---

## 📖 Practical Examples

### Example 1: View docker/login-action Documentation
1. **Marketplace**: https://github.com/marketplace/actions/docker-login
2. **Repository**: https://github.com/docker/login-action
3. **Action file**: https://github.com/docker/login-action/blob/main/action.yml
4. **Source code**: https://github.com/docker/login-action/tree/main/src

### Example 2: View trivy-action Documentation
1. **Marketplace**: https://github.com/marketplace/actions/aqua-security-trivy
2. **Repository**: https://github.com/aquasecurity/trivy-action
3. **Action file**: https://github.com/aquasecurity/trivy-action/blob/master/action.yml

### Example 3: Create a Simple Composite Action
Create `.github/actions/hello-world/action.yml`:
```yaml
name: 'Hello World'
description: 'Prints a greeting'
inputs:
  name:
    description: 'Name to greet'
    required: true
    default: 'World'
runs:
  using: 'composite'
  steps:
    - shell: bash
      run: echo "Hello, ${{ inputs.name }}!"
```

Use it:
```yaml
- uses: ./.github/actions/hello-world
  with:
    name: 'GitHub Actions'
```

---

## 🔗 Quick Reference Links

### Finding Action Documentation
- **Marketplace**: https://github.com/marketplace
- **Docker Actions**: https://github.com/docker
- **Popular Actions**: https://github.com/actions

### Action Repositories
- `docker/login-action`: https://github.com/docker/login-action
- `docker/build-push-action`: https://github.com/docker/build-push-action
- `aquasecurity/trivy-action`: https://github.com/aquasecurity/trivy-action
- `actions/checkout`: https://github.com/actions/checkout
- `actions/upload-artifact`: https://github.com/actions/upload-artifact

### Official Documentation
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Creating Actions**: https://docs.github.com/en/actions/creating-actions
- **Action Syntax**: https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions

---

## 💡 Best Practices

1. **Pin versions**: Use `@v3` instead of `@master` for stability
2. **Check releases**: Look at release notes for breaking changes
3. **Review source**: Always review action source code for security
4. **Test locally**: Test custom actions before using in production
5. **Document well**: Add clear README and examples for custom actions

---

## 🎯 Quick Commands

### View action.yml from command line:
```bash
# View action definition
curl https://raw.githubusercontent.com/docker/login-action/v3/action.yml

# View README
curl https://raw.githubusercontent.com/docker/login-action/v3/README.md
```

### Clone and explore:
```bash
git clone https://github.com/docker/login-action.git
cd login-action
cat action.yml  # See inputs/outputs
ls src/         # See implementation
```

---

## 🚀 Next Steps

1. **Explore**: Visit the repositories mentioned above
2. **Practice**: Create a simple composite action
3. **Learn**: Read the `action.yml` files to understand structure
4. **Build**: Create your own custom action for your specific needs

