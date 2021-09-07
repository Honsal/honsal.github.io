---
layout: post
date: 2021-09-07 15:27:52 +09:00
title: 파워쉘을 통해 핸드폰 파일 복사하기
author: Honsal
categories: ["Computing Tips"]
tags: ["Computing Tips", "Windows Tips", "Phone Tips"]
comments: true
---

오늘 일어나보니 제 노트10의 유심 트레이가 죽어있었습니다. 현금도 얼마 없는데 수리비 깨질 것을 생각하니 그냥 핸드폰을 바꾸고 몇 달에 걸쳐 할부금을 납부하는게 이득 아닐까라는 생각이 계속 들더군요.

그래서 핸드폰을 바꾸고자 마음먹고 기종을 찾아보니, 제가 바꾸고자 하는 기종은 Micro SD를 지원하지 않는다는 것을 알게 되었습니다.

따라서 저는 외장 SD카드와 내장 SD카드의 중요 내용을[^1] 컴퓨터에 백업하고자 했는데...

## 느려터진 탐색기

언제나 그렇듯 이 탐색기가 또 발목을 잡았습니다. 탐색기에서 파일 복사/이동/삭제를 대량으로 할 때에 우선 탐색기는 해당 컨텐츠들[^2]을 쭉 읽어들입니다. 이건 제 뇌피셜이지만 아마 대량의 파일 복사/이동/삭제시 나타나는 프로그래스바를 표시하기 위해 일단 전체 파일이 몇 개인지 읽어들이는 것 같습니다. 그래야 현재까지 복사/이동/삭제된 파일 수와 전체 파일 수의 비율로 프로그래스바를 표시할 수 있을 테니까요.

아무튼, 이미 저는 대량의 파일 삭제 시 이렇게 느려터진 게 짜증나서[^3] 파워쉘을 통해 빠르게 삭제하는 스크립트를 레지스트리로 컨텍스트 메뉴에 등록해둔 상태였습니다.

## mtp는 다르다

하지만 핸드폰은 같은 방법을 사용할 수 없었습니다. 정확히 말하면, 기본적으로 파워쉘에서 제공해주는 명령어 셋으로는 불가능했습니다. 단순히 제가 찾지 못한 것일 수도 있지만, 아무튼 찾을 수조차 없었습니다.

하지만 구글, 그리고 스택오버플로우는 언제나 답을 알려주죠. 검색해보니 [이런 스택오버플로우 글](https://stackoverflow.com/a/55638981)을 찾을 수 있었습니다.

### Shell.Application COM Object

[MSDN 문서](https://docs.microsoft.com/en-us/windows/win32/shell/shell-application)를 보면 해당 COM Object는 쉘 어플리케이션을 반환합니다. 즉 탐색기 API라고 보셔도 무방할 듯 합니다. 이를 사용하면, 탐색기로 할 수 있는 일을 프로그램화시켜 할 수 있다는 것이죠.

그리고 해당 스택오버플로우 글에서 제시한 방법을 따르면, 다음과 같이 사용이 가능합니다.

```powershell
$shell = new-object -ComObject Shell.Application
$PhoneObject = $shell.NameSpace(17).Self.GetFolder().items() | where { $_.name -like "*Galaxy*" }
$SourceFolder = $shell.NameSpace((Join-Path $PhoneObject.path Card Pictures)).self.GetFolder()
$DestFolder = $Shell.NameSpace("Backups\Phone\20210907\Pictures")

$SourceFolder.Items() | foreach {
>>   $DestFolder.CopyHere($_)
>>
>>   do {
>>     $CopiedFile = $null
>>     $CopiedFile = $DestFolder.Items()
>>   } While(($CopiedFile -eq $null) -and ($null -eq (Sleep -Milliseconds100)))
>>
>>   Write-Host "Copied $($item.Name)"
>> }
```

직접 사용해보니, 탐색기의 복사 프로그래스바는 표시됐으나 어찌 된 영문인지 표시된 직후 전체 파일을 계산하는 작업[^4]이 없이 즉시 복사가 시작됐으며, 결과적으로 시간을 아낄 수 있었습니다.

## 결론

역시 파워쉘을 통해 Shell.Application COM Object로 복사하는 쪽이 시간 손해를 줄일 수 있었습니다. 저는 구글링하는데 걸린 시간이 시간인지라 어쩌면 오히려 손해를 봤을 수도 있겠지만, 이미 해당 스크립트를 ps1 파일로 만들어 저장해놨기에 다음부터는 더 빠르게 작업할 수 있을 것 같습니다. 여러분은 처음부터 이 방법을 사용해 시간 손해를 줄이시길 바랍니다.

물론, 복사할 대상의 수가 몇천개가 넘지 않는다면 단순히 탐색기에서 복사하는 게 더 효율적일 수 있습니다.

[^1]: 주로 추억 사진

[^2]: 폴더, 그 하위의 폴더, 파일, ...

[^3]: 주로 .git 폴더가 포함된 폴더 삭제

[^4]: 시간이 오래 걸리는 작업