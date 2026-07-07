---
aliases: [VPN Access Boundary Misunderstanding, Remote Access Scope]
tags: [문제, 작성중, Network, Security]
difficulty: Medium
type: Problem
---

# Problem: 59-VPN을 켰는데도 접근 권한과 노출 범위를 구분하지 못함

## 상황

재택근무 환경에서 VPN을 연결하면 사내 GitLab, Jenkins, 개발 DB에 접근할 수 있다. 그런데 VPN 연결 자체를 권한 부여로 오해해, 내부망에 들어온 사용자가 모든 자원에 접근해도 된다고 생각한다.

```text
User device
  -> VPN tunnel
  -> Company private network
  -> GitLab / Jenkins / DB / Grafana
```

---

## 관찰된 증거

- VPN 접속 후 불필요한 내부 서비스까지 접근 가능하다.
- 개발 DB, 운영 DB, CI 서버 접근 정책이 같은 네트워크 단위로 묶여 있다.
- VPN 계정 탈취 시 내부 자원 전체가 노출된다.
- SaaS처럼 public endpoint인 서비스에도 VPN이 필요하다고 오해한다.

---

## 원인

VPN은 공개 네트워크 위에 암호화된 통신 경로를 만드는 기술이지, 자원별 권한 모델을 대신하지 않는다. 네트워크에 들어오는 것과 특정 리소스를 사용할 권한은 분리해야 한다.

---

## 해결 방향

- VPN은 접근 경로, IAM/RBAC/ReBAC은 권한 판단으로 분리한다.
- 내부 자원도 최소 권한과 네트워크 세그먼트를 적용한다.
- 개발/스테이징/운영망을 분리한다.
- VPN 접속 로그와 자원 접근 로그를 함께 본다.
- public SaaS와 private self-hosted resource를 구분한다.

---

## 연결되는 본질

- [[본질-사설 접근 경로와 권한 판단의 분리]]
- [[본질-권한 모델과 리소스 관계]]
- [[본질-네트워크 경계와 노출면]]

---

## 참고

> "A VPN is a virtual network built on top of existing physical networks that provides a secure communications mechanism for data and control information transmitted between computers or networks." — [NIST SP 800-77 Rev. 1: Guide to IPsec VPNs](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf)

> "SSL VPNs provide users with secure remote access to an organization's resources." — [NIST SP 800-113: Guide to SSL VPNs](https://csrc.nist.gov/pubs/sp/800/113/final)
