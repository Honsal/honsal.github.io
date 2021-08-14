---
title: 윈도우 터미널에서 투명한 배경을 사용하는 방법
author: Honsal
date: 2021-08-14 11:03:11 +09:00
layout: post
categories: ["Windows Tips"]
tags: ["Windows Tips", "Windows Terminal"]
comments: true
---

윈도우 11로 넘어오면서 이제 pwsh이나 cmd보다 윈도우 터미널[^1]을 더 자주 사용하게 되었습니다. 하지만 비주얼이 조금 아쉬웠습니다. 파워쉘은 반투명하게 처리할 수가 있었는데 터미널은 옵션에서 아무리 찾아도 그런 설정이 보이지 않았기 때문입니다.

## 옵션은 settings.json에서 변경

하지만 구글링 해보니 단지 옵션이 숨겨져 있었을 뿐이란 걸 깨닫게 되었죠. 누가 개발자용 툴 아니랄까봐 UI에는 대충 필요한 것만 박아두고 세부 설정은 죄다 settings.json에서 하게 되어있더군요.

![설정 파일](/assets/images/posts/20210814/WT_ACRYLLIC/1.png)

.json 파일과 연결된 프로그램이 없으면 메모장으로 열리니 사전에 자주 사용하는 에디터에 연결을 해놓으시거나 `%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json` 파일을 직접 열어도 됩니다.

### profiles 수정

이제 간단히 두 줄만 추가하거나, 개별로 설정할 경우 여러 줄을 추가해주시면 됩니다. 여러 줄이라고 해봐야 앞서 얘기한 두 줄과 동일한 형식이니 크게 어려울 것은 없습니다.

#### 전역 설정

`profiles.default`에 다음과 같은 코드를 추가하면 전역 투명도가 설정됩니다.

```json
"acrylicOpacity": 0, // 0-1; 0: 완전 투명, 1: 불투명
"useAcrylic": true
```

#### 프로필별 설정

`profiles.list`의 원하는 요소에 위와 같은 옵션을 적용하면 됩니다. 더 투명했으면 좋겠다 싶은 프로필에는 `acrylicOpacity` 값을 낮추고, 아니면 높이고. 불투명했으면 좋겠다 싶은 프로필에는 `useAcrylic`을 `false`로 설정하면 됩니다.

저는 그냥 전역으로 0을 박아놓고 사용하고 있습니다. 아크릴 효과 덕분에 0으로 박아도 별로 거부감이 없더라고요.

![0으로 박은 모습](/assets/images/posts/20210814/WT_ACRYLLIC/2.png)

[^1]: 단축 명령어: wt
