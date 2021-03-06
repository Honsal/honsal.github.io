---
layout: post
author: Honsal
date: 2021-08-23 06:26:32 +09:00
title: "C# 인터렉티브에서 .NET Core 사용하기"
categories: ["C#", "Development"]
tags: ["C#", "Developments", "C# Tips"]
comments: true
---

저는 꽤나 자주 C# 인터렉티브 콘솔을 사용합니다. 간단한 로직을 테스트하거나, 현재 C# 버전의 어떤 기능이 어떻게 작동하는지 기억이 안 날 때 확인하는 용도로 말이죠.

디버그를 걸어도 물론 되지만 코드 입력과 실행 결과 확인에 길어야 1, 2분도 채 걸리지 않는 테스트를 위해서 코드를 새 파일에 작성하고 빌드하고 디버그하는 것은 너무나도 귀찮기 때문입니다.

이럴 때 C# 인터렉티브 콘솔은 그야말로 딱이죠. 심지어 Visual Studio에 내장되어 있는 기능이라 따로 실행파일을 직접 실행하지 않아도 간편히 작업할 수 있다는 장점까지 있습니다.

## .NET Framework, .NET Core

이번에 제가 확인하고자 했던(까먹었던) 기능은, C#의 [Ranges and Indices](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/ranges-indexes) 기능입니다. `a .. b` 혹은 `a .. ^b` 식으로 사용하는 것이란 건 기억이 나는데, `str[a .. b]`와 같이 사용했을 때 문자열의 a번째 인덱스부터 b번째 인덱스까지였는지, 아니면 a번째 인덱스부터 b - 1번째 인덱스까지였는지가 기억이 나질 않았죠.

### 기본값은 .NET Framework

그래서 어느 때와 같이 단축키로 C# Interactive 콘솔을 열어 다음과 같이 입력해봤습니다.

![img](/assets/images/posts/20210823/CSharpInteractive/1.png)

그랬더니 위와 같이 *System.Range*, *System.Index*를 정의하지 않았거나 가져오지 않았다며 *CS0518* 에러가 발생했습니다.

#### 구글링은 필요없다!

다행히도, 예전에 .NET Framework 프로젝트에서 Ranges, Indices를 사용하는 방법에 대해 찾던 중 이런 에러를 마주한 적이 있기 때문에 이 에러가 왜 발생했는지 바로 알 수 있었습니다. **C# 인터렉티브 콘솔이 Core가 아닌 .NET Framework에서 실행되고 있기 때문**라는 것을요.

### .NET Core 인터렉티브로 전환

그리고 거의 동시에 예전, 즉 C# 8.0이 출시된지 얼마 안 됐을 때 비슷한 경험을 한 적이 있다는 사실을 떠올렸습니다. 그 때엔 분명 C# 인터렉티브 콘솔이 .NET Core를 사용하게 할 방법이 없어서 포기했었죠.

하지만 지금은 시간이 많이 흘렀습니다. 이제 .NET Framework보다 .NET Core가 대세라고 할 수 있을 정도로 많이 사용되고 있고 혹시 방법이 생기지 않았나 하고 구글링을 해봤더니, **아주 간단한 솔루션**이 있더라고요.

```csharp
#reset core
```

단 한 줄. 위의 단 한 줄만 적으면 C# 인터렉티브 콘솔이 .NET Core 64비트 프로세스 모드에서 동작하게 된다는 [스택오버플로우 글](https://stackoverflow.com/questions/60946159/how-to-set-c-sharp-version-for-csi-exe)에 따른 솔루션입니다. 심지어 저 글은 C# 인터렉티브 콘솔을 .NET Core 모드에서 동작하게 하는 것을 포기했었던 그 시기에 봤던 글이었습니다. 고맙게도 작성자가 글을 계속 업데이트하고 있었더라고요.

위의 명령을 적으면 다음과 같은 화면으로 진행됩니다.

![img](/assets/images/posts/20210823/CSharpInteractive/2.png)

#### 작동 여부 확인

그럼 어디 한 번 아까 하려던 테스트를 마저 해볼까요? 저는 "202108"에서 앞 네 글자, 즉 연도만을 따오고 싶습니다.

![img](/assets/images/posts/20210823/CSharpInteractive/3.png)

오우, 이게 아닌가 봅니다.

![img](/assets/images/posts/20210823/CSharpInteractive/4.png)

이거였네요!

![img](/assets/images/posts/20210823/CSharpInteractive/5.png)

모두 잘 작동하네요.

### 다시 .NET Framework로 전환하려면?

물론 다시 돌아갈 수도 있습니다. 동일하게 `#reset` 명령어를 사용합니다.

```csharp
// 사용법:
   #reset [noconfig] [core|32|64]
```

`#reset 32`는 32비트 .NET Framework, `#reset 64`는 64비트 .NET Framework, `#reset core`는 .NET Core입니다.