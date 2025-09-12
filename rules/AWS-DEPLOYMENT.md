# 🚀 AWS EC2 Deployment Guide - Assembleo Core

Este guia te ajudará a fazer deploy da aplicação Assembleo Core em uma instância EC2 da AWS.

## 📋 Pré-requisitos

- Conta AWS ativa
- AWS CLI configurado (opcional, mas recomendado)
- Chave SSH (.pem) para acessar a EC2

## 🏗️ 1. Criando a Instância EC2

### Através do Console AWS:

1. **Acesse o EC2 Dashboard**
   - Vá para [AWS Console](https://console.aws.amazon.com)
   - Navegue até EC2

2. **Lance uma Nova Instância**
   - Clique em "Launch Instance"
   - **Name**: `assembleo-core-server`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t2.micro (Free tier) ou t3.small (Recomendado)
   - **Key Pair**: Crie ou selecione uma chave existente
   - **Security Group**: Configure as seguintes regras:
     ```
     SSH (22)    - Source: Your IP
     HTTP (80)   - Source: 0.0.0.0/0
     Custom (3000) - Source: 0.0.0.0/0
     ```

3. **Storage**: 8GB de GP3 (padrão é suficiente)

4. **Launch Instance**

## ⚡ 2. Configuração Rápida

### Opção A: Script Automatizado

```bash
# 1. Conecte-se à EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Execute o script de setup
curl -fsSL https://raw.githubusercontent.com/seu-usuario/assembleo-core/main/scripts/setup-ec2.sh | bash

# 3. Logout e login novamente
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Opção B: Configuração Manual

```bash
# Conectar à EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Atualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configurar firewall
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw --force enable

# Logout e login novamente
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## 🚀 3. Deploy da Aplicação

### Usando o Script de Deploy Automatizado:

```bash
# No seu computador local, na pasta do projeto
./scripts/deploy.sh YOUR_EC2_IP ~/.ssh/your-key.pem
```

### Deploy Manual:

```bash
# 1. Criar pacote da aplicação (local)
tar --exclude='node_modules' --exclude='.git' --exclude='dist' -czf assembleo-core.tar.gz .

# 2. Enviar para EC2
scp -i ~/.ssh/your-key.pem assembleo-core.tar.gz ubuntu@YOUR_EC2_IP:/tmp/

# 3. Conectar à EC2 e extrair
ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_EC2_IP
mkdir -p ~/assembleo-core
cd ~/assembleo-core
tar -xzf /tmp/assembleo-core.tar.gz

# 4. Iniciar aplicação
docker-compose up -d --build
```

## 🔧 4. Verificação e Monitoramento

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Verificar se a aplicação está rodando
curl http://localhost:3000

# Status do sistema
docker system df
```

## 🌐 5. Acessar a Aplicação

Após o deploy, sua API estará disponível em:
- **URL**: `http://YOUR_EC2_IP:3000`
- **Health Check**: `http://YOUR_EC2_IP:3000/`
- **Swagger/Docs**: `http://YOUR_EC2_IP:3000/api` (se configurado)

## 🎯 6. Comandos Úteis

```bash
# Parar aplicação
docker-compose down

# Reiniciar aplicação
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f assembleo-api

# Atualizar aplicação (após novo deploy)
docker-compose down
docker-compose up -d --build

# Limpar containers não utilizados
docker system prune -f
```

## 🔐 7. Configurações de Segurança

### Security Group Recomendado:
```
Type        Port    Protocol    Source          Description
SSH         22      TCP         Your IP/32      SSH access
HTTP        80      TCP         0.0.0.0/0       HTTP access
Custom      3000    TCP         0.0.0.0/0       API access
HTTPS       443     TCP         0.0.0.0/0       HTTPS (if using SSL)
```

### Firewall (UFW):
```bash
sudo ufw status
sudo ufw allow from YOUR_IP to any port 22  # Restringir SSH ao seu IP
sudo ufw allow 3000
sudo ufw enable
```

## 💰 8. Custos Estimados (us-east-1)

| Instância | vCPU | RAM | Custo/mês* |
|-----------|------|-----|------------|
| t2.micro  | 1    | 1GB | $8.50      |
| t3.small  | 2    | 2GB | $16.80     |
| t3.medium | 2    | 4GB | $33.60     |

*Valores aproximados, sempre verifique a calculadora da AWS

## 🆘 9. Troubleshooting

### Aplicação não inicia:
```bash
# Verificar logs
docker-compose logs

# Verificar se a porta está sendo usada
sudo netstat -tulnp | grep 3000

# Reiniciar Docker
sudo systemctl restart docker
```

### Problemas de conexão:
```bash
# Verificar Security Group
# Verificar se a porta 3000 está aberta no Security Group

# Verificar firewall local
sudo ufw status

# Testar conectividade
curl -I http://localhost:3000
```

### Atualizar aplicação:
```bash
# Re-executar o script de deploy
./scripts/deploy.sh YOUR_EC2_IP ~/.ssh/your-key.pem
```

## 🔄 10. CI/CD (Opcional)

Para automatizar deploys, você pode configurar GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to EC2
      run: |
        echo "${{ secrets.EC2_SSH_KEY }}" > key.pem
        chmod 600 key.pem
        ./scripts/deploy.sh ${{ secrets.EC2_HOST }} key.pem
```

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. ✅ Security Group configurado corretamente
2. ✅ Docker e Docker Compose instalados
3. ✅ Aplicação buildando sem erros
4. ✅ Porta 3000 liberada no firewall

**Agora sua API está rodando na nuvem! 🎉**