---
layout: post
title: Windows의 방화벽 해제. 하지만 모든 프로필을 곁들인
author: Honsal
date: 2021-08-13 17:23:39 +09:00
categories: [Windows Tips]
tags: [Windows Tips, Security, Firewall]
comments: true
---

기본적으로 Windows OS의 방화벽은 설치 직후부터 항상 켜져있습니다. 그리고 사용자는 필요에 의해 방화벽 허용 규칙을 추가하거나, 방화벽을 끄게 됩니다.

예전에는 제어판에서, Windows 10 이후에는 설정 앱과 제어판에서 방화벽을 끌 수 있는데, 이번 포스트에서는 **모든 프로필**의 방화벽을 해제하는 방법에 대해 작성하도록 하겠습니다.

## 방화벽 프로필

윈도우는 세 개의 방화벽 프로필을 제공합니다. 바로 개인 프로필, 공용 프로필, 도메인 프로필입니다.

### 개인/공용 프로필

이 중 개인 프로필과 공용 프로필은 비교적 이해가 쉽습니다. 여러분이 포맷 등으로 신선한 상태의 윈도우를 설정할 때, 혹은 설치 후에 인터넷에 연결했을 때, 혹은 새로운 네트워크 어댑터를 추가했을 때마다 윈도우는 우리에게 해당 어댑터가 어떤 프로필로 작동하게 할지 묻습니다. 윈도우 10 이상에서는 알림 바가 열리며 공용 또는 개인 버튼이 보여지게 되며, 기본값은 공용으로 선택되어 있죠.

즉 개인 프로필과 공용 프로필은 관리자[^1]가 마음대로 선택할 수 있는 겁니다.

### 도메인 프로필

도메인 프로필은 성격이 좀 다릅니다. 깊게 들어가지 않고 간단히 설명하자면, 해당 네트워크 어댑터가 도메인에 가입되어 있고, 그러한 도메인의 도메인 컨트롤러를 검색할 수 있다면 도메인 프로필이 규칙이 적용되게 됩니다.

그렇다면 도메인이 뭘까요? 이것 역시 겉핥기 식으로 설명하면 윈도우에서 제공하는 디렉터리 공유 기능을 위한 네트워크로 연결된 하나의 그룹입니다.

죄송합니다. 더 쉽게 설명해보겠습니다.

간단히 설명하자면 학교나 회사에서 같은 라우터에 연결된 컴퓨터끼리 폴더[^2]를 공유해 작업할 때, 이 컴퓨터들은 같은 도메인에 가입되어 있어야 합니다. 윈도우의 도메인 주소(`\\BUJANG-PC\data\document.doc`과 같은 형식)를 이 글을 보시는 여러분께서 한 번쯤은 보셨으리라 생각합니다. 여기서 *BUJANG-PC*를 식별하기 위해 도움을 주는 것이 도메인입니다. 같은 내부 네트워크에 같은 이름의 컴퓨터가 여러 대 있다고 하더라도 가입된 도메인이 다르다면[^3] 각각 식별할 수 있게 됩니다.

위에서는 내부 네트워크로 설명했지만 외부 네트워크와의 연결도 가능합니다. 오히려 내부 네트워크에서는 도메인보다는 주로 *작업 그룹*이라는 것을 더 많이 사용하죠.

---

프로필에 대한 설명은 너무 길어질 것 같으니 여기까지만 하고, 이번 글에서는 위 세 가지의 방화벽 프로필에 적용되는 방화벽을 모두 해제하는 방법에 대해 알려드리도록 하겠습니다.

## 방화벽 해제

제어판에 들어갑니다.[^4] 시스템 및 보안 그룹에 진입해 Windows Defender 방화벽 섹션을 클릭합니다.

![Windows Defener 방화벽](/assets/images/posts/20210813/DisableFirewall/1.png)

고급 설정에 진입합니다.

![고급 설정](/assets/images/posts/20210813/DisableFirewall/2.png)

Windows Defender 방화벽 설정 링크를 엽니다.

![Windows Defender 방화벽 설정](/assets/images/posts/20210813/DisableFirewall/3.png)

도메인 프로필, 개인 프로필, 공용 프로필에 대해 방화벽 상태를 모두 *사용 안 함*으로 설정하고 확인을 누릅니다.

![사용 안 함](/assets/images/posts/20210813/DisableFirewall/4.png)

끝!

## 주의사항

이 설정을 적용하면 Windows 보안 센터 앱이 수시로 방화벽이 작동중이지 않다며 알림을 보냅니다. 예전에는 알림 센터에서 뮤트할 수 있었지만 이제는 그럴 수가 없습니다.

해당 알림을 비활성화하려면 **설정 앱의 Windows 보안 센터에서 모든 알림을 해제**하고, **제어판의 보안 및 유지 관리 설정 변경**에서 보안 메시지의 **네트워크 방화벽** 체크박스를 해제하시면 됩니다.

[^1]: 대부분의 경우 OS 사용자

[^2]: 파일 포함

[^3]: 기본값은 WORKGROUP

[^4]: `Windows 키 + R`을 눌러 실행 창을 띄우고 *control*을 입력 후 엔터