# 🌊 Digital Ocean Deployment Guide

Complete guide to deploying Vindictive AI on Digital Ocean.

## Prerequisites

- Digital Ocean account
- GitHub repository with your code
- Replicate API key
- OpenAI API key

## Method 1: App Platform (Easiest) ⭐

### Step 1: Prepare Your Repository

1. Push all your code to GitHub
2. Make sure you have a `.env.example` file in the `agent/` directory

### Step 2: Create a New App

1. Go to [Digital Ocean Console](https://cloud.digitalocean.com/)
2. Click **Apps** in the left sidebar
3. Click **Create App**
4. Choose **GitHub** as your source
5. Authorize Digital Ocean to access your repository
6. Select your repository and branch (usually `main`)

### Step 3: Configure Components

Digital Ocean should auto-detect your Next.js app. You'll need to configure two components:

#### Component 1: Next.js Frontend

```yaml
Name: vindictive-ai-frontend
Type: Web Service
Environment: Node.js
Build Command: npm install && npm run build
Run Command: npm start
HTTP Port: 3000
Instance Size: Basic ($5/month)
Environment Variables:
  - LANGGRAPH_DEPLOYMENT_URL=${vindictive-ai-agent.PRIVATE_URL}:8123
```

#### Component 2: Python Agent

Click **Add Component** → **Web Service**

```yaml
Name: vindictive-ai-agent
Type: Web Service
Environment: Python
Source Directory: /agent
Build Command: pip install -r requirements.txt
Run Command: python -m langgraph dev --port 8123 --host 0.0.0.0
HTTP Port: 8123
Instance Size: Basic ($5/month)
Environment Variables:
  - REPLICATE_API_TOKEN=<your-replicate-token>
  - OPENAI_API_KEY=<your-openai-key>
```

### Step 4: Set Environment Variables

1. In the **Environment Variables** section for each component
2. Add the required variables:
   - `REPLICATE_API_TOKEN` (Encrypt this!)
   - `OPENAI_API_KEY` (Encrypt this!)
   - `LANGGRAPH_DEPLOYMENT_URL` (Set to internal URL of agent)

### Step 5: Deploy

1. Review your configuration
2. Click **Create Resources**
3. Wait for deployment (usually 5-10 minutes)
4. Your app will be live at `https://your-app-name.ondigitalocean.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to your app settings
2. Click **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## Method 2: Droplet (More Control)

### Step 1: Create a Droplet

1. Go to **Droplets** in Digital Ocean
2. Click **Create Droplet**
3. Choose:
   - **Distribution:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($12/month - 2GB RAM recommended)
   - **Datacenter:** Choose closest to your users
   - **Authentication:** SSH Key (recommended) or Password
4. Click **Create Droplet**

### Step 2: Initial Server Setup

SSH into your droplet:

```bash
ssh root@your-droplet-ip
```

Update system and install dependencies:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Python and pip
apt install -y python3 python3-pip

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2
```

### Step 3: Clone and Setup Project

```bash
# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install Node dependencies
npm install

# Install Python dependencies
cd agent
pip3 install -r requirements.txt
cd ..

# Create .env file
cp agent/.env.example agent/.env
nano agent/.env  # Add your API keys
```

### Step 4: Build the Application

```bash
# Build Next.js app
npm run build
```

### Step 5: Setup PM2 for Process Management

Create PM2 ecosystem file:

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'vindictive-ui',
      cwd: '.',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        LANGGRAPH_DEPLOYMENT_URL: 'http://localhost:8123'
      }
    },
    {
      name: 'vindictive-agent',
      cwd: './agent',
      script: 'python',
      args: '-m langgraph dev --port 8123 --host 0.0.0.0',
      interpreter: 'python3',
      env: {
        // Your env vars are loaded from .env file
      }
    }
  ]
};
EOF
```

Start the applications:

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 6: Setup Nginx (Reverse Proxy)

Install Nginx:

```bash
apt install -y nginx
```

Create Nginx configuration:

```bash
cat > /etc/nginx/sites-available/vindictive-ai << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # LangGraph Agent
    location /api/agent/ {
        proxy_pass http://localhost:8123/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

Enable the site:

```bash
# Remove default site
rm /etc/nginx/sites-enabled/default

# Enable your site
ln -s /etc/nginx/sites-available/vindictive-ai /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 7: Setup SSL (HTTPS)

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

Get SSL certificate:

```bash
certbot --nginx -d your-domain.com
```

### Step 8: Setup Firewall

```bash
# Allow SSH
ufw allow OpenSSH

# Allow HTTP/HTTPS
ufw allow 'Nginx Full'

# Enable firewall
ufw enable
```

## Monitoring & Maintenance

### View PM2 Logs

```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs vindictive-ui
pm2 logs vindictive-agent
```

### Restart Applications

```bash
# Restart all
pm2 restart all

# Restart specific app
pm2 restart vindictive-ui
```

### Update Application

```bash
cd your-repo
git pull
npm install
npm run build
pm2 restart all
```

### Monitor Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000 or 8123
lsof -ti:3000
lsof -ti:8123

# Kill the process
kill -9 <PID>
```

### PM2 Not Starting on Boot

```bash
# Re-run startup command
pm2 startup
pm2 save
```

### Nginx 502 Bad Gateway

```bash
# Check if apps are running
pm2 status

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart all
systemctl restart nginx
```

### Out of Memory

```bash
# Add swap space
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## Cost Estimation

### App Platform
- 2x Basic Instances ($5 each) = **$10/month**
- Bandwidth included

### Droplet
- Basic Droplet (2GB) = **$12/month**
- Bandwidth included (1TB)
- Domain (optional) = ~$12/year

## Security Best Practices

1. **Never commit `.env` files to Git**
2. **Use SSH keys, not passwords**
3. **Keep system updated:** `apt update && apt upgrade`
4. **Enable firewall:** Only allow necessary ports
5. **Use HTTPS:** Always enable SSL certificates
6. **Rotate API keys regularly**
7. **Monitor logs for suspicious activity**

## Resources

- [Digital Ocean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Digital Ocean Droplet Docs](https://docs.digitalocean.com/products/droplets/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## Support

If you encounter issues:
1. Check the logs (`pm2 logs`)
2. Verify environment variables are set
3. Ensure API keys are valid
4. Check firewall settings
5. Review Nginx configuration

---

**Happy Deploying! 🚀**

