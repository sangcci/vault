---
aliases: [Integration, Interworking]
tags: [본질, 작성중]
created: 2026-02-05
updated: 2026-02-05
type: Principle
difficulty: Medium
---
# Principle: 연동 (Integration)
**핵심 질문**: "서로 다른 언어를 쓰는 두 시스템이 어떻게 오해 없이 대화할 것인가?"

## One-liner Definition
> (사전적) 서로 다른 시스템이나 소프트웨어가 상호 작용하여 기능을 수행하거나 데이터를 교환하는 과정.
> (이해용) **"서로 다른 두 세계를 잇는 통역사와 악수하는 규칙을 정하는 것."**

## Usage Examples (문장 3개)
1. "우리 서비스의 결제 기능을 외부 PG사 API와 **연동**하여 처리했다."
2. "마이크로서비스 간의 원활한 **연동**을 위해 gRPC를 도입하여 통신 속도를 최적화했다."
3. "이 기종 시스템 간의 데이터 **연동** 시 포맷 불일치로 인한 오차를 줄이기 위해 어댑터 패턴을 적용했다."

## Recurring Core Problem
각 시스템은 각자의 데이터 구조, 언어, 프로토콜을 가집니다. 이를 연결할 때 발생하는 데이터 형식의 불일치(Mismatch), 통신 지연(Latency), 그리고 한쪽의 장애가 다른 쪽으로 번지는 장애 전파(Fault Propagation)가 핵심 문제입니다.

## Why It Doesn't Disappear
하나의 거대한 단일 시스템(Monolith)만으로는 현대의 복잡한 요구사항을 처리할 수 없기 때문입니다. 외부 서비스 활용, 레거시 시스템과의 공존, MSA 구조 등 시스템 간의 협력은 현대 아키텍처의 필수 조건입니다.

## Trade-offs
- **기능 확장 vs 결합도**: 연동을 통해 손쉽게 새로운 기능을 추가할 수 있지만, 상대 시스템의 변화에 종속되는 '외부 의존성'이 커집니다.
- **개발 속도 vs 장애 탄력성**: 직접 만드는 대신 외부 연동을 선택하면 개발은 빠르지만, 네트워크 장애나 상대 서버 다운 시 우리 서비스의 가용성도 위협받습니다.

## Appears As
- **Standard Protocol**: HTTP, gRPC, MQTT
- **Data Exchange Format**: JSON, Protocol Buffers, XML
- **Integration Patterns**: Gateway, Adapter, Messaging Queue

## Related Cases
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
- [[본질-가용성 (Availability)]] — 서킷 브레이커를 통한 연동 장애 격리
- [[본질-멱등성 (Idempotency)]] — 안전한 재연동 보장
