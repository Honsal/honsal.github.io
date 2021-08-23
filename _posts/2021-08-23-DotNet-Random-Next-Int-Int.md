---
layout: post
date: 2021-08-23 23:15:11 +09:00
author: Honsal
title: "닷넷 Random.Next(minValue, maxValue) 사용시 주의사항"
categories: ["C#", "Development"]
tags: ["C#", "Development"]
comments: true
---

개발을 하다보면 생각보다 자주 `System.Random` 클래스를 사용하게 됩니다.

닷넷의 랜덤 클래스에는 미리 정의된 `Random.Next(int, int)`라는, 최솟값과 최댓갑 사이의 값을 반환해주는 좋은 기능이 있죠. 예전에 루아를 사용할 때엔 이게 없어서 직접 `n * (max - min) + min`과 같은 식을 함수로 만들어서 썼었는데 정말 고마운 프레임워크입니다.

### maxValue

오늘도 어김없이 개발을 하던 도중, GitLab에 이슈가 올라왔습니다. 최소 설정값과 최대 설정값 사이의 랜덤한 값으로 작업이 반복되어야 하는 로직이 있는데, 이게 작동을 안 한다는 것이었죠. 해당 부분의 코드는 제가 만든 것이 아니기 때문에 디버그를 하며 어디가 문제인지 찾아봤습니다.

그러다가 찾은 다음 코드.

```cs
public int RandomValue 
{
    get 
    {
        return m_rnd.Next(COND_MIN, COND_MAX);
    }
}
```

아... 설마? 하고 브레이크포인트를 걸어봤습니다. 아니나 다를까, COND_MAX 값에 사용자가 입력한 값이 그대로 들어가있더군요.

예를 들어, 사용자가 최소 설정값을 1, 최대 설정값을 2로 지정했다면 COND_MIN = 1, COND_MAX = 2가 되는 식이었습니다.

그렇다면 이게 뭐가 문제일까요? 얼핏 보면 minValue, maxValue라는 인자명을 생각해보면 당연히 해당 코드가 1 또는 2를 반환하리라 생각됩니다. 하지만, **그게 바로 함정**입니다.

[MSDN의 Random 클래스](https://docs.microsoft.com/en-us/dotnet/api/system.random?view=net-5.0) 문서를 보면, 다음과 같은 내용이 있습니다.

> A 32-bit signed integer **greater than or equal to minValue and less than maxValue**; that is, the range of return values includes minValue but not maxValue. If minValue equals maxValue, minValue is returned.

번역해보면, *minValue **이상** maxValue **미만**의 부호 있는 32비트 정수 값을 반환*한다는 것이죠. 중요한 건 *maxValue **미만***이라는 겁니다.

따라서, 위 코드는 다음과 같이 재정의되어야 합니다.

```cs
public int RandomValue
{
    get 
    {
        return m_rnd.Next(COND_MIN, COND_MAX);
    }
}
```

문제 해결!