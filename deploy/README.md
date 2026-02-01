# NEXX GSM - Vultr Deployment Guide

## 🔧 Server Configuration

| Parameter | Value |
|-----------|-------|
| **Provider** | Vultr |
| **Region** | Frankfurt, Germany (fra) |
| **Plan** | vc2-1c-1gb ($5/month) |
| **Specs** | 1 vCPU, 1GB RAM, 25GB SSD |
| **OS** | Ubuntu 24.04 LTS x64 |
| **Domain** | nexxgsm.com |

## 📁 Files

- `vultr-config.json` - Vultr API configuration
- `deploy-vultr.sh` - Automated deployment script
- `nginx.conf` - Nginx server configuration
- `setup-server.sh` - Server setup script

## 🚀 Deployment Steps

### 1. Fix Vultr Account Balance

Your Vultr account has an **open balance of $100.03**. 

1. Go to https://my.vultr.com/billing/
2. Pay the outstanding balance
3. Then proceed with deployment

### 2. Create VPS (after balance is paid)

```bash
./deploy-vultr.sh
```

Or manually via API:
```bash
curl "https://api.vultr.com/v2/instances" \
  -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{
    "region": "fra",
    "plan": "vc2-1c-1gb",
    "os_id": 2284,
    "label": "nexx-gsm-web",
    "hostname": "nexx-gsm",
    "enable_ipv6": true
  }'
```

### 3. Configure DNS

Point your domain to the server IP:
```
A     @     → SERVER_IP
A     www   → SERVER_IP
AAAA  @     → SERVER_IPV6
AAAA  www   → SERVER_IPV6
```

### 4. SSH to Server

```bash
ssh root@SERVER_IP
```

### 5. Upload Website Files

```bash
# On local machine
rsync -avz --progress ./public/ root@SERVER_IP:/var/www/nexx-gsm/public/
```

### 6. Configure Nginx

```bash
# On server
cp nginx.conf /etc/nginx/sites-available/nexx-gsm
ln -sf /etc/nginx/sites-available/nexx-gsm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 7. Setup SSL Certificate

```bash
certbot --nginx -d nexxgsm.com -d www.nexxgsm.com
```

### 8. Setup Auto-renewal

```bash
systemctl enable certbot.timer
systemctl start certbot.timer
```

## 📊 Monitoring

### Check Nginx Status
```bash
systemctl status nginx
```

### View Logs
```bash
tail -f /var/log/nginx/nexx-gsm.access.log
tail -f /var/log/nginx/nexx-gsm.error.log
```

### Check SSL Certificate
```bash
certbot certificates
```

## 💰 Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Vultr VPS (vc2-1c-1gb) | $5.00 |
| Domain (yearly/12) | ~$1.00 |
| SSL (Let's Encrypt) | FREE |
| **Total** | **~$6/month** |

## 🔐 Security Checklist

- [x] UFW firewall enabled (ports 22, 80, 443)
- [x] SSH key authentication (recommended)
- [x] HTTPS with Let's Encrypt
- [x] Security headers configured
- [x] Gzip compression enabled

## 📞 Support

- Vultr Support: https://my.vultr.com/support/
- API Documentation: https://www.vultr.com/api/

---
Created: 2026-01-21
API Key: HTMDUAS6KYB4B3THYSIJDZ5YQMU4UL3OZ3LA
