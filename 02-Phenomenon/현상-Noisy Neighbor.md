---
aliases: [시끄러운 이웃, Resource Contention]
tags: [현상, 인프라, 가상화]
created: 2026-02-06
updated: 2026-02-14
type: Phenomenon
---
# Phenomenon: Noisy Neighbor (시끄러운 이웃)

## One-liner Definition
> (사전적) 멀티 테넌트 환경에서 자원을 공유하는 특정 인스턴스가 자원을 과도하게 사용하여 이웃 인스턴스의 성능에 악영향을 미치는 현상.
> (이해용) **아파트에서 옆집 사람이 밤새도록 큰 소리로 노래를 불러서(자원 점유), 내가 잠을 못 자는(성능 저하) 상황.**

## Observation (Context & Symptoms)
- **발생 환경**: 클라우드 공유 서버, 가상화 환경, 오버커밋(Overcommit)이 설정된 인프라.
- **관찰 증상**: 
    - **성능 변동성 (Jitter)**: 동일한 요청임에도 불구하고 응답 시간이 불규칙해짐.
    - **예측 불가능성**: 특정 시간대에 성능이 급격히 저하되나 서비스 내부 지표는 정상임.

## Hypothesized Causes
- 물리 자원(CPU, Disk I/O, Network Bandwidth)의 공유 및 격리 수준 부족.
- 하이퍼바이저의 자원 스케줄링 경합.

## Related Concepts / Principles
- [[개념-Namespaces와 Cgroups]] — 해결을 위한 도구
- [[개념-하이퍼바이저 (Hypervisor)]] — 현상이 발생하는 계층
- [[본질-격리성 (Isolation)]] — 현상을 방지하고자 하는 가치
