---
aliases: [macOS_Caps_Lock_Delay_Fix, FOCD_Input_Method]
tags: [사례, 완료]
type: Case
difficulty: Low
---
# 사례-macOS Caps Lock 한영 전환 지연 해결 및 입력 환경 최적화

## 상황 (Situation)
- 기존에 구름 입력기를 사용하며 `Shift + Space` 단축키로 한/영 전환을 수행함.
- 고속 타이핑 시 `Shift + Space` 조합이 의도치 않게 띄어쓰기로 인식되거나, 반대로 띄어쓰기를 하려다 언어가 전환되는 등 입력 흐름을 방해하는 현상이 빈번하게 발생함.
- 이에 따라 macOS 기본 방식인 **Caps Lock** 키로 복귀하고자 함.

## 실제 발생한 일 (What Happened)
- **문제 발생**: macOS 기본 Caps Lock 한영 전환기는 특유의 딜레이(지연 시간)가 존재하여, 빠르게 전환하고 입력할 경우 첫 글자가 이전 언어로 입력되는 문제가 발생함.
- **해결 방안**: 개발자가 만든 입력기 보조 앱인 **FOCD**([GST-Main/FOCD](https://github.com/GST-Main/FOCD))를 도입함.
- **설정 변경**:
    - FOCD를 통해 Caps Lock 키를 누르는 즉시 지연 없이 입력 소스가 전환되도록 개선.
    - 기존 Caps Lock의 기능(대문자 전환)은 `Shift + Caps Lock` 조합으로 동작하도록 변경하여 기능적 충돌을 방지함.

## 근본 원인 (Root Cause)
- macOS 시스템의 기본 Caps Lock 전환 동작은 오입력 방지를 위해 짧은 시간 동안 키를 누르고 있어야 동작하도록 설계되어 있어, 빠른 전환을 원하는 파워 유저에게는 딜레이로 느껴짐.
- `Shift + Space` 방식은 가장 빈번하게 사용되는 `Space` 키와 조합되므로, 타이핑 리듬이 빨라질 경우 OS 수준에서 단축키와 일반 입력을 완벽하게 분리하지 못하는 한계가 있음.

## 교훈 및 조치 (Lessons & Fixes)
- **표준 방식의 개선**: OS 표준 방식(Caps Lock)이 불편할 경우 아예 다른 방식을 찾는 것보다, 표준 방식의 동작 메커니즘을 개선하는 도구(FOCD 등)를 사용하는 것이 장기적인 습관 유지에 유리함.
- **키 중복 최소화**: 범용적인 입력 인터페이스(Space)를 건드리는 커스텀 단축키는 생산성 저하의 원인이 될 수 있음을 인지함.
- 현재 Caps Lock 기반의 즉각적인 전환 환경을 구축하여 오타 없는 고속 입력 환경을 완성함.

## 관련 문서
- [[00-Meta/keymaps]]
- [[사례-독거미(AULA) F65 macOS Tahoe 최적화 가이드]]
