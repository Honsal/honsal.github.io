---
title: Visual Studio 2022용 ReSharper 프리뷰 빌드가 출시되었습니다.
date: 2021-08-23 01:32:37 +09:00
author: Honsal
comments: true
categories: ["Development", "ReSharper"]
tags: ["Development", "ReSharper", "Preview"]
layout: post
---

[MSDN Visual Studio 2022 프리뷰 릴리즈 정보](https://docs.microsoft.com/ko-kr/visualstudio/releases/2022/release-notes-preview)의 내역을 보면 얼마 남지 않은 출시를 앞두고 꾸준히 프리뷰 빌드가 업데이트되고 있는 것을 알 수 있습니다.

새 기술이 나왔다 하면 물불을 가리지 않는 저는 처음 프리뷰 빌드가 공개됐을 때 이미 설치해서 사용해봤지만, JetBrains ReSharper가 지원되지 않는 단계였기에 일단 보류한 채 ReSharper가 지원할 때까지 존버를 하기로 했죠.

## ReSharper의 VS2022 프리뷰 빌드 지원

그리고 드디어! JetBrains에서 [블로그 포스트](https://blog.jetbrains.com/dotnet/2021/04/28/resharper-and-visual-studio-2022-64-bit/)를 업데이트했습니다.

> **Update (August 12, 2021):** a preview version of [ReSharper 2021.2 for Visual Studio 2022 is now available for download](https://resharper-support.jetbrains.com/hc/en-us/articles/4404930135570?_ga=2.117721097.1464335430.1629649811-197827840.1629649811&_gl=1*g745tu*_ga*MTk3ODI3ODQwLjE2Mjk2NDk4MTE.*_ga_0WQ2ZF5VGT*MTYyOTY0OTgxMS4xLjEuMTYyOTY1MDA0NS4w). Find out more [in this blog post](https://blog.jetbrains.com/dotnet/2021/08/11/support-for-visual-studio-2022-preview/).

### 프리뷰 빌드 다운로드

프리뷰 빌드는 위 인용구에 쓰여있듯 [이 링크](https://resharper-support.jetbrains.com/hc/en-us/articles/4404930135570)에서 손쉽게 다운받아 설치할 수 있습니다.

단, 만약 이미 이전 버전의 Visual Studio에서 릴리즈 버전의 ReSharper를 사용하고 계신다면, 설치하실 때 프로덕트 설정에 주의해주세요. 이전 버전의 Visual Studio용으로 프리뷰 버전을 설치하지 않도록 꼼꼼히 확인하시기 바랍니다.

#### 주의

다운로드 페이지에 적혀있는 내용이지만, 중요하므로 제 포스트에도 적도록 하겠습니다. 아래 내용은 ReSharper 프리뷰 빌드에 대한 내용입니다.

* 모든 최신 빌드는 30일 후에 만료됩니다.
* 업데이트 알림과 업데이트 패치는 **불가능**합니다.
* 툴박스 앱[^1]을 통한 설치 및 업데이트가 **불가능**합니다.
* 최소 한 달에 한 번은 새 빌드가 출시되어 다운로드 섹션[^2]에 배포됩니다.

### 성능 비교는 아직 없다

2021-08-23 01:43:55 +09:00 기준으로, 아직 JetBrains에서 VS2019와 VS2022버전 사이의 성능 비교는 진행하지 않았다고 합니다. 단, [추측 글](https://blog.jetbrains.com/dotnet/2021/04/28/resharper-and-visual-studio-2022-64-bit/)에 의하면 JetBrains Rider가 64비트 버전으로 이동하며 생긴 성능상 이점[^3]이 64비트 버전의 ReSharper에도 적용되리라 본다고 합니다. 일단 메모리 제약이 현재 기술 수준에서는 없다고 할 만큼 풀리게 된 이상, GC 호출 등에 할당되는 시간이 줄어들게 될 것이고 이는 결국 더 부드러운 UI와 직결된다는 의견이네요.

CPU와 관계된 성능 예측은 정확히 밝힌 내용이 없지만, ReSharper를 out-of-process 방식으로 전환해 이 분야에서 더 향상된 결과를 얻겠다고 합니다.

[^1]: JetBrains 설치 도구

[^2]: 다운로드 링크 페이지의 다운로드 섹션

[^3]: 처리량 증가, out of memory 예외 처리를 위한 조건들 해제(heap fragmentation 등)와 같은 작업으로 인한 부드러운 실행
