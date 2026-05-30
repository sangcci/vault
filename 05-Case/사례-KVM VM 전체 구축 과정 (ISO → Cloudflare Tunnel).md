---
aliases: [KVM VM 구축, Cockpit VM, 홈서버 구축]
tags: [사례, 작성중]
type: Case
difficulty: Low
---

## 상황 (Situation)

- **Host**: HP Elitebook 845 G7 / Debian 13 (Trixie) / 16GB RAM / 512GB SSD
- **가상화**: KVM + Cockpit + libvirt
- **목표**: Web / WAS / DB / Cache 역할별 VM 4개 구축 후 Cloudflare Tunnel로 외부 노출

| VM | Name | Memory | Disk | vCPU |
|----|------|--------|------|------|
| Web | vm-web | 1024MB | 20GB | 1 |
| WAS | vm-was | 4096MB | 30GB | 2 |
| DB | vm-db | 4096MB | 100GB | 2 |
| Cache | vm-cache | 2048MB | 20GB | 1 |

---

## 실제 발생한 일 (What Happened)

### Step 1. Host 필수 패키지 설치
```bash
sudo apt install -y cockpit cockpit-machines virt-manager \
  qemu-kvm libvirt-daemon-system bridge-utils
sudo systemctl enable --now libvirtd
sudo systemctl enable --now cockpit.socket
```

### Step 2. Debian ISO 다운로드
- Cloud Image → `localhost login:` 문제 발생 → ISO 방식으로 전환
  - 원인: cloud-init이 패스워드 미설정 → [[사례-cloud-init 미설정으로 인한 VM 로그인 불가]]
- `debian-13.3.0-amd64-netinst.iso` (754MB) 사용
```bash
sudo wget -P /var/lib/libvirt/images/ \
  https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.3.0-amd64-netinst.iso
```

### Step 3. Cockpit에서 VM 생성
```
브라우저 → https://localhost:9090
→ Virtual Machines → Create VM
→ Installation type: Local install media (ISO)
→ ISO 경로: /var/lib/libvirt/images/debian-13.3.0-amd64-netinst.iso
```

### Step 4. Debian 설치 옵션
```
1. "Install" 선택 (Graphical Install 아님)
2. 언어: English
3. hostname: web-tier / was-tier / db-tier / cache-tier
4. 파티셔닝: Guided - use entire disk
5. Software selection:
   ☑ SSH server
   ☐ 나머지 전부 해제
6. GRUB 설치: /dev/vda
```

### Step 5. 설치 후 기본 세팅 (VM 내부)
```bash
su -
apt update && apt install -y vim sudo
usermod -aG sudo <유저명>

# visudo로 sudoers 등록
visudo
# root ALL=(ALL:ALL) ALL 아래에 추가
# <유저명> ALL=(ALL:ALL) ALL
```

### Step 6. 고정 IP 설정 (VM 내부)
```bash
ip addr show  # NIC 이름 확인 (enp1s0)
sudo vim /etc/network/interfaces
```
```
auto enp1s0
iface enp1s0 inet static
  address 192.168.122.10   # vm-web 기준
  netmask 255.255.255.0
  gateway 192.168.122.1
  dns-nameservers 8.8.8.8
```
```bash
sudo systemctl restart networking
# DHCP IP가 secondary로 잔존할 수 있음
# 즉시 제거: sudo ip addr del 192.168.122.x/24 dev enp1s0
```
→ [[사례-Static IP 설정 후 DHCP IP가 secondary로 잔존]]

### Step 7. /etc/hosts 등록 (VM 내부)
```
192.168.122.10  web   web.allreva.local
192.168.122.20  was   was.allreva.local
192.168.122.30  db    db.allreva.local
192.168.122.40  cache cache.allreva.local
```

### Step 8. Host SSH config 등록
```
# ~/.ssh/config
Host vm-web
  HostName 192.168.122.10
  User <유저명>

Host vm-was
  HostName 192.168.122.20
  User <유저명>

Host vm-db
  HostName 192.168.122.30
  User <유저명>

Host vm-cache
  HostName 192.168.122.40
  User <유저명>
```
```bash
ssh vm-web  # 이후 간단하게 접속
```

### Step 9. Docker 설치 (VM 내부)
```bash
sudo apt remove -y docker docker.io containerd runc
sudo apt update && sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian trixie stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
```

### Step 10. nginx 컨테이너 실행 (vm-web 내부)
```bash
mkdir -p ~/nginx/conf.d

cat > ~/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    location / {
        return 200 'vm-web nginx ok';
        add_header Content-Type text/plain;
    }
}
EOF

cat > ~/nginx/docker-compose.yml <<'EOF'
services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./conf.d:/etc/nginx/conf.d:ro
    restart: unless-stopped
EOF

cd ~/nginx && docker compose up -d
curl http://localhost  # vm-web nginx ok
```

### Step 11. 포트 포워딩 설정 (Host)
```bash
# DNAT: 외부 80 → vm-web 80
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.122.10:80

# FORWARD 허용 (ufw allow만으로는 부족)
sudo ufw route allow proto tcp to 192.168.122.10 port 80
```
→ [[사례-DNAT 후 FORWARD chain에서 패킷 차단]]
→ [[사례-ufw와 iptables-persistent 충돌]]

### Step 12. Cloudflare Tunnel 설정 (vm-web 내부)
- ISP 포트 80/443 차단 확인 → Cloudflare Tunnel로 우회
- cloudflared 설치 → 터널 생성 → Public Hostname(Route) 등록
- DNS CNAME 자동 생성: `allreva.site → <tunnel-id>.cfargotunnel.com`
- `restart: unless-stopped` 설정으로 VM 재부팅 후 자동 재수립

→ [[탐구-Cloudflare Tunnel은 어떻게 포트 개방 없이 외부 접속을 가능하게 하는가]]

---

## 근본 원인 (Root Cause)

각 단계에서 마주친 문제들은 모두 독립된 사례 노트로 분리:

| 문제 | 사례 노트 |
|------|-----------|
| Cloud Image 로그인 불가 | [[사례-cloud-init 미설정으로 인한 VM 로그인 불가]] |
| DHCP IP 잔존 | [[사례-Static IP 설정 후 DHCP IP가 secondary로 잔존]] |
| ufw/iptables 충돌 | [[사례-ufw와 iptables-persistent 충돌]] |
| FORWARD chain DROP | [[사례-DNAT 후 FORWARD chain에서 패킷 차단]] |
| ISP 포트 차단 | [[사례-ISP 포트 차단으로 인한 Cloudflare Tunnel 전환]] |

---

## 교훈 및 조치 (Lessons & Fixes)

**VM 구축 체크리스트**
```
☑ ISO 설치 (Cloud Image 아님)
☑ sudo + vim 설치 후 sudoers 등록
☑ 고정 IP 설정 + DHCP 잔존 IP 제거 확인
☑ /etc/hosts + SSH config 등록
☑ Docker 설치 후 usermod -aG docker
☑ 포트 포워딩 시 DNAT + FORWARD 규칙 모두 설정
☑ Cloudflare Tunnel Route 등록 확인 (없으면 Error 1016)
```
