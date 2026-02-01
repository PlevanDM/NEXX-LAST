#!/bin/bash
# NEXX GSM - Vultr Deployment Script
# Created: 2026-01-21

set -e

# Configuration
VULTR_API_KEY="HTMDUAS6KYB4B3THYSIJDZ5YQMU4UL3OZ3LA"
REGION="fra"  # Frankfurt, Germany (closest to Romania)
PLAN="vc2-1c-1gb"  # 1 vCPU, 1GB RAM, 25GB SSD - $5/month
OS_ID="2284"  # Ubuntu 24.04 LTS x64
LABEL="nexx-gsm-web"
HOSTNAME="nexx-gsm"
DOMAIN="nexxgsm.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 NEXX GSM - Vultr Deployment${NC}"
echo "=================================="

# Check API connection
echo -e "\n${YELLOW}1. Checking Vultr API...${NC}"
ACCOUNT=$(curl -s "https://api.vultr.com/v2/account" \
  -H "Authorization: Bearer ${VULTR_API_KEY}")

BALANCE=$(echo $ACCOUNT | jq -r '.account.balance')
echo -e "   Balance: ${GREEN}\$${BALANCE}${NC}"

# Check for existing instance
echo -e "\n${YELLOW}2. Checking existing instances...${NC}"
INSTANCES=$(curl -s "https://api.vultr.com/v2/instances" \
  -H "Authorization: Bearer ${VULTR_API_KEY}")

EXISTING=$(echo $INSTANCES | jq -r ".instances[] | select(.label==\"${LABEL}\") | .id")

if [ -n "$EXISTING" ]; then
  echo -e "   ${YELLOW}⚠️  Instance already exists: ${EXISTING}${NC}"
  MAIN_IP=$(echo $INSTANCES | jq -r ".instances[] | select(.label==\"${LABEL}\") | .main_ip")
  echo -e "   IP: ${GREEN}${MAIN_IP}${NC}"
  
  read -p "   Delete and recreate? (y/N): " CONFIRM
  if [ "$CONFIRM" = "y" ]; then
    echo -e "   Deleting instance..."
    curl -s "https://api.vultr.com/v2/instances/${EXISTING}" \
      -X DELETE \
      -H "Authorization: Bearer ${VULTR_API_KEY}"
    echo -e "   ${GREEN}✓ Deleted${NC}"
    sleep 5
  else
    echo -e "   Keeping existing instance."
    exit 0
  fi
fi

# Create startup script
echo -e "\n${YELLOW}3. Creating startup script...${NC}"
STARTUP_SCRIPT=$(cat << 'SCRIPT_EOF'
#!/bin/bash
# NEXX GSM Server Setup Script

# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install nginx
apt-get install -y nginx certbot python3-certbot-nginx

# Install PM2
npm install -g pm2

# Create app directory
mkdir -p /var/www/nexx-gsm
cd /var/www/nexx-gsm

# Clone or copy files (placeholder - will be configured later)
echo "Server ready for deployment" > /var/www/nexx-gsm/status.txt

# Configure nginx
cat > /etc/nginx/sites-available/nexx-gsm << 'NGINX_EOF'
server {
    listen 80;
    server_name nexxgsm.com www.nexxgsm.com;
    
    root /var/www/nexx-gsm/public;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/nexx-gsm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "Setup complete!" > /var/www/nexx-gsm/setup-complete.txt
SCRIPT_EOF
)

SCRIPT_BASE64=$(echo "$STARTUP_SCRIPT" | base64 -w 0)

# Create the instance
echo -e "\n${YELLOW}4. Creating VPS instance...${NC}"
echo "   Region: Frankfurt (fra)"
echo "   Plan: $PLAN (1 vCPU, 1GB RAM, 25GB SSD)"
echo "   OS: Ubuntu 24.04 LTS"
echo "   Cost: \$5/month"

RESPONSE=$(curl -s "https://api.vultr.com/v2/instances" \
  -X POST \
  -H "Authorization: Bearer ${VULTR_API_KEY}" \
  -H "Content-Type: application/json" \
  --data "{
    \"region\": \"${REGION}\",
    \"plan\": \"${PLAN}\",
    \"os_id\": ${OS_ID},
    \"label\": \"${LABEL}\",
    \"hostname\": \"${HOSTNAME}\",
    \"enable_ipv6\": true,
    \"tags\": [\"production\", \"web\", \"nexx\"],
    \"user_data\": \"${SCRIPT_BASE64}\"
  }")

INSTANCE_ID=$(echo $RESPONSE | jq -r '.instance.id')

if [ "$INSTANCE_ID" = "null" ] || [ -z "$INSTANCE_ID" ]; then
  echo -e "   ${RED}❌ Failed to create instance${NC}"
  echo "$RESPONSE" | jq .
  exit 1
fi

echo -e "   ${GREEN}✓ Instance created: ${INSTANCE_ID}${NC}"

# Wait for instance to be ready
echo -e "\n${YELLOW}5. Waiting for instance to boot...${NC}"
for i in {1..60}; do
  STATUS=$(curl -s "https://api.vultr.com/v2/instances/${INSTANCE_ID}" \
    -H "Authorization: Bearer ${VULTR_API_KEY}" | jq -r '.instance.status')
  
  MAIN_IP=$(curl -s "https://api.vultr.com/v2/instances/${INSTANCE_ID}" \
    -H "Authorization: Bearer ${VULTR_API_KEY}" | jq -r '.instance.main_ip')
  
  if [ "$STATUS" = "active" ] && [ "$MAIN_IP" != "0.0.0.0" ]; then
    echo -e "\n   ${GREEN}✓ Instance is ready!${NC}"
    break
  fi
  
  echo -n "."
  sleep 5
done

# Get instance details
echo -e "\n${YELLOW}6. Instance Details:${NC}"
INSTANCE=$(curl -s "https://api.vultr.com/v2/instances/${INSTANCE_ID}" \
  -H "Authorization: Bearer ${VULTR_API_KEY}")

MAIN_IP=$(echo $INSTANCE | jq -r '.instance.main_ip')
IPV6=$(echo $INSTANCE | jq -r '.instance.v6_main_ip')
PASSWORD=$(echo $INSTANCE | jq -r '.instance.default_password')

echo -e "   Instance ID: ${GREEN}${INSTANCE_ID}${NC}"
echo -e "   IPv4: ${GREEN}${MAIN_IP}${NC}"
echo -e "   IPv6: ${GREEN}${IPV6}${NC}"
echo -e "   Root Password: ${YELLOW}${PASSWORD}${NC}"
echo ""
echo -e "${GREEN}=================================="
echo -e "🎉 Deployment Complete!"
echo -e "==================================${NC}"
echo ""
echo "Next steps:"
echo "1. Point DNS: ${DOMAIN} -> ${MAIN_IP}"
echo "2. SSH: ssh root@${MAIN_IP}"
echo "3. Upload files to /var/www/nexx-gsm/"
echo "4. Setup SSL: certbot --nginx -d ${DOMAIN}"
echo ""
echo -e "${YELLOW}Save these credentials!${NC}"
