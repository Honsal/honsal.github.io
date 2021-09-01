---
layout: page
title: ".NET 6 프리뷰, 'A descriptor for a page was not found.' 문제 해결 방법"
author: Honsal
date: 2021-09-01 13:30:23 +09:00
categories: ["Development", ".NET"]
tags: ["Development", ".NET"]
comments: true
bg: posts/20210901/PageDescriptorWasNotFound/1.png
---

## Visual Studio 2022, .NET 6 Preview Build

VS2022와 닷넷 6 프리뷰 빌드가 출시된지도 어느덧 꽤 많은 시간이 흘렀습니다. 개인적으로는 둘 모두 실무에 사용할 수 있을 정도로 코딩 쪽에서는 안정화가 되었다고 생각하지만, 역시 프리뷰 빌드인지라 자잘한 버그들이 조금씩 보이긴 하더라고요.

### .NET 6

닷넷 6의 Hot Reload 기능은 정말이지 끝내줍니다. 예전엔 단순한 코드 변경[^1]에도 디버그를 재시작해야 브레이크포인트를 걸 수 있었으나[^2], 핫 리로드 기능을 사용하면 중대한 변경 사항[^3]이 아니라면 리빌드/디버그 재시작 없이 바로바로 코드 변경 사항을 적용해 브레이크포인트를 걸 수 있을 뿐 아니라, 연결된 브라우저도 자동으로 업데이트되어 개발 시간을 획기적으로 단축할 수 있습니다.

### 버그

그러나 얼마 전 발견한 버그가 이렇게 단축된 시간을 다시 야금야금 잡아먹고 있네요.

#### ASP Core Razor Page 프로젝트

현재 저는 ASP Core Razor Page 프로젝트 템플릿을 사용해 개발을 하고있습니다. 당연히 수시로 새 Razor Page 파일 템플릿을 통해 페이지를 추가하기도 하는데, 바로 이 때 문제가 발생합니다.

![예외가 처리되지 않음](/assets/images/posts/20210901/PageDescriptorWasNotFound/1.png)

어떤 Razor Page를 추가하면 어김없이 발생하는 예외입니다. 처음에는 .NET 6 프리뷰의 문제가 아닌 줄 알고 구글링을 해봤지만 일치하는 문제가 없어서 프로젝트를 .NET 5로 변경하고 VS2019에서 빌드해보니 정상적으로 빌드가 되는 것을 확인하고 .NET 6의 문제라는 것을 알아챘습니다.

그 다음부터는 왜 이런 문제가 발생하는지 곰곰히 생각해봤죠. 가만 생각해보니, VS2019에서 .NET 5로 만들었던 레이저 페이지는 문제가 없었습니다. 그렇다면 **프로젝트 구성에 뭔가 문제가 있지 않을까** 하고 찾아봤습니다.

아니나 다를까,

```xml
<ItemGroup>
    <Content Remove="{문제가 발생한 페이지 cshtml 파일 경로}" />
</ItemGroup>
```

위와 같은 코드가 생성되어있더군요. 심지어 그 뒤의 `ItemGroup` 엘리먼트에는 `Include`하는 부분이 있었습니다. 그러니까 대충

```xml
<ItemGroup>
    <Content Remove="A.cshtml" />
</ItemGroup>

<!-- ... -->

<ItemGroup>
    <None Include="A.cshtml" />
</ItemGroup>
```

위와 같은 모양새가 되었던 것이죠.

### 문제 해결 방법

해결 방법은 간단했습니다. 바로 **문제가 발생한 cshtml 경로를 Remove 속성으로 갖는 Content 엘리먼트를 제거**하면 되었죠.

그런데 보다보니 이상한 게 있더군요. 프로젝트 템플릿에서 기본적으로 생성하는 페이지, 레이아웃 등[^4]이 애초에 csproj 파일에 없더라고요?

그래서 아래에 있던 *&lt;None Include="..." /&gt;* 엘리먼트도 제거해봤는데 아니나 다를까 정상 작동했습니다.

정식 출시되면 버그가 픽스되리라 기대하며 당분간 불편해도 이렇게 사용하려 합니다. 왜냐하면, 이런 단순하게 수정할 수 있는 문제 때문에 핫 리로드를 버리기에는 그 기능이 너무 막강하기 때문입니다.

[^1]: 수식 변경, 변수 할당 변경, ...

[^2]: dotnet watch를 사용해도 되지만, 이 역시 디버거를 재연결해야했습니다.

[^3]: using 구문 수정, 메서드 이름 변경, ... [공식 문서](https://github.com/dotnet/roslyn/blob/main/docs/wiki/EnC-Supported-Edits.md)

[^4]: _Layout.cshtml, Index.cshtml, ...
